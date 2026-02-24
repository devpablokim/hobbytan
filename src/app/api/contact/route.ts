import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

// Rate limiting - simple in-memory store (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute per IP

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  website?: string; // honeypot field
}

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const isValidPhone = (phone: string): boolean => {
  // Korean phone format or international
  const phoneRegex = /^[\d\-\+\(\)\s]{8,20}$/;
  return phoneRegex.test(phone);
};

const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 5000); // Limit length
};

// Rate limiting check
const checkRateLimit = (ip: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    };
  }

  record.count++;
  return { allowed: true };
};

// Lazy transporter initialization to avoid startup errors if env vars missing
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error("SMTP configuration is incomplete");
    }
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      pool: true, // Use connection pooling for better performance
      maxConnections: 5,
    });
  }
  return transporter;
};

function getAdminEmailHTML(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">새로운 문의가 도착했습니다</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">하비탄 AI 웹사이트</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <!-- Name -->
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">이름</p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">${data.name}</p>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">이메일</p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">
                      <a href="mailto:${data.email}" style="color: #059669; text-decoration: none;">${data.email}</a>
                    </p>
                  </td>
                </tr>

                <!-- Phone -->
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">연락처</p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">
                      <a href="tel:${data.phone}" style="color: #059669; text-decoration: none;">${data.phone}</a>
                    </p>
                  </td>
                </tr>

                <!-- Company -->
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">회사/기관명</p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">${data.company || "-"}</p>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding: 16px 0;">
                    <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">문의 내용</p>
                    <div style="margin-top: 8px; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #059669;">
                      <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}" style="display: inline-block; padding: 14px 32px; background-color: #059669; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">답장하기</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                하비탄 AI | pablo@hobbytan.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function getConfirmationEmailHTML(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">문의해 주셔서 감사합니다</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.7;">
                안녕하세요, <strong>${data.name}</strong>님!
              </p>

              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.7;">
                하비탄 AI에 문의해 주셔서 진심으로 감사드립니다.<br>
                귀하의 문의가 정상적으로 접수되었습니다.
              </p>

              <div style="padding: 24px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 12px; margin: 24px 0;">
                <p style="margin: 0; color: #059669; font-size: 16px; font-weight: 600; text-align: center;">
                  담당자가 빠르게 확인 후 연락 드리겠습니다.
                </p>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px; text-align: center;">
                  영업일 기준 48시간 이내 회신 드립니다.
                </p>
              </div>

              <!-- Inquiry Summary -->
              <div style="margin-top: 32px; padding: 24px; background-color: #f9fafb; border-radius: 8px;">
                <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">접수된 문의 내용</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">이름</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${data.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">이메일</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${data.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">연락처</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${data.phone}</td>
                  </tr>
                  ${data.company ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">회사/기관</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${data.company}</td>
                  </tr>
                  ` : ""}
                </table>
              </div>

              <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                추가 문의사항이 있으시면 언제든지
                <a href="mailto:pablo@hobbytan.com" style="color: #059669; text-decoration: none;">pablo@hobbytan.com</a>
                으로 연락해 주세요.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 32px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">하비탄 AI</p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 13px;">
                당신과 AI 기술 사이, 하비탄 AI
              </p>
              <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 12px;">
                pablo@hobbytan.com
              </p>
            </td>
          </tr>
        </table>

        <!-- Legal -->
        <p style="margin: 24px 0 0 0; color: #9ca3af; font-size: 11px; text-align: center;">
          본 메일은 하비탄 AI 웹사이트 문의에 대한 자동 발송 메일입니다.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfter),
          },
        }
      );
    }

    // Parse and validate request body
    let data: ContactFormData;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: "올바른 이메일 주소를 입력해 주세요." },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!isValidPhone(data.phone)) {
      return NextResponse.json(
        { error: "올바른 연락처를 입력해 주세요." },
        { status: 400 }
      );
    }

    // Validate name length
    if (data.name.length < 2 || data.name.length > 50) {
      return NextResponse.json(
        { error: "이름은 2자 이상 50자 이하로 입력해 주세요." },
        { status: 400 }
      );
    }

    // Validate message length
    if (data.message.length < 10 || data.message.length > 5000) {
      return NextResponse.json(
        { error: "문의 내용은 10자 이상 5000자 이하로 입력해 주세요." },
        { status: 400 }
      );
    }

    // Honeypot spam check - bots fill this hidden field, humans don't see it
    if (data.website) {
      // Silently accept but don't process spam submissions
      console.log("Spam detected via honeypot:", data.email);
      return NextResponse.json({
        success: true,
        message: "문의가 성공적으로 접수되었습니다.",
      });
    }

    // Sanitize inputs
    const sanitizedData: ContactFormData = {
      name: sanitizeInput(data.name),
      email: data.email.toLowerCase().trim(),
      phone: sanitizeInput(data.phone),
      company: sanitizeInput(data.company || ""),
      message: sanitizeInput(data.message),
    };

    // Save to Firestore
    const db = getFirebaseAdmin();
    const docRef = await db.collection("inquiries").add({
      ...sanitizedData,
      createdAt: new Date().toISOString(),
      status: "new",
      ipAddress: ip, // For audit/security purposes
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // Send emails (non-blocking for faster response)
    const emailPromises: Promise<unknown>[] = [];
    const mailTransporter = getTransporter();

    // Send email to admin
    emailPromises.push(
      mailTransporter.sendMail({
        from: `"하비탄 AI" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `[문의] ${sanitizedData.name}님이 문의를 남기셨습니다`,
        html: getAdminEmailHTML(sanitizedData),
      }).catch(err => {
        console.error("Failed to send admin email:", err);
        // Don't throw - we still want to return success if Firestore save worked
      })
    );

    // Send confirmation email to user
    emailPromises.push(
      mailTransporter.sendMail({
        from: `"하비탄 AI" <${process.env.SMTP_USER}>`,
        to: sanitizedData.email,
        subject: "[하비탄 AI] 문의해 주셔서 감사합니다",
        html: getConfirmationEmailHTML(sanitizedData),
      }).catch(err => {
        console.error("Failed to send confirmation email:", err);
        // Don't throw - we still want to return success if Firestore save worked
      })
    );

    // Wait for emails but don't fail the request if they fail
    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      success: true,
      message: "문의가 성공적으로 접수되었습니다.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    // Differentiate error types for better debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isFirebaseError = errorMessage.includes("Firebase") || errorMessage.includes("firestore");
    const isSmtpError = errorMessage.includes("SMTP") || errorMessage.includes("nodemailer");

    if (isFirebaseError) {
      console.error("Firebase error details:", errorMessage);
    }
    if (isSmtpError) {
      console.error("SMTP error details:", errorMessage);
    }

    return NextResponse.json(
      { error: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization header
    const authHeader = request.headers.get("authorization");
    const adminToken = process.env.ADMIN_API_TOKEN;

    // Simple token-based auth for admin endpoints
    // In production, use proper JWT/session-based authentication
    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // Parse query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const status = searchParams.get("status"); // "new" | "in-progress" | "completed"
    const startAfter = searchParams.get("startAfter");

    const db = getFirebaseAdmin();
    let query = db
      .collection("inquiries")
      .orderBy("createdAt", "desc")
      .limit(limit);

    // Apply status filter if provided
    if (status) {
      query = query.where("status", "==", status);
    }

    // Apply pagination cursor if provided
    if (startAfter) {
      const startDoc = await db.collection("inquiries").doc(startAfter).get();
      if (startDoc.exists) {
        query = query.startAfter(startDoc);
      }
    }

    const snapshot = await query.get();

    const inquiries = snapshot.docs.map((doc) => {
      const data = doc.data();
      // Remove sensitive fields from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ipAddress, userAgent, ...safeData } = data;
      return {
        id: doc.id,
        ...safeData,
      };
    });

    // Get the last document for pagination
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return NextResponse.json({
      inquiries,
      pagination: {
        count: inquiries.length,
        hasMore: inquiries.length === limit,
        nextCursor: lastDoc?.id || null,
      },
    });
  } catch (error) {
    console.error("Get inquiries error:", error);
    return NextResponse.json(
      { error: "문의 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH endpoint for updating inquiry status
export async function PATCH(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get("authorization");
    const adminToken = process.env.ADMIN_API_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "문의 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const validStatuses = ["new", "in-progress", "completed", "archived"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "올바르지 않은 상태값입니다." },
        { status: 400 }
      );
    }

    const db = getFirebaseAdmin();
    const docRef = db.collection("inquiries").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "문의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.adminNotes = sanitizeInput(notes);
    }

    await docRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: "문의가 업데이트되었습니다.",
    });
  } catch (error) {
    console.error("Update inquiry error:", error);
    return NextResponse.json(
      { error: "문의 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
