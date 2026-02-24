import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  website?: string; // honeypot field
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

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
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해 주세요." },
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

    // Save to Firestore
    const db = getFirebaseAdmin();
    const docRef = await db.collection("inquiries").add({
      ...data,
      createdAt: new Date().toISOString(),
      status: "new",
    });

    // Send email to admin
    await transporter.sendMail({
      from: `"하비탄 AI" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[문의] ${data.name}님이 문의를 남기셨습니다`,
      html: getAdminEmailHTML(data),
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"하비탄 AI" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: "[하비탄 AI] 문의해 주셔서 감사합니다",
      html: getConfirmationEmailHTML(data),
    });

    return NextResponse.json({
      success: true,
      message: "문의가 성공적으로 접수되었습니다.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = getFirebaseAdmin();
    const snapshot = await db
      .collection("inquiries")
      .orderBy("createdAt", "desc")
      .get();

    const inquiries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Get inquiries error:", error);
    return NextResponse.json(
      { error: "문의 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
