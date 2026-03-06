import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
    });
  }
  return transporter;
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, organization, jobRole, participationStatus } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "tanhyu.kim@gmail.com";
    const mailTransporter = getTransporter();

    await mailTransporter.sendMail({
      from: `"AI 슈퍼워크샵" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `[슈퍼워크샵] 새 가입 승인 요청 — ${name}`,
      html: `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;">
  <table style="width:100%;max-width:500px;margin:40px auto;border-collapse:collapse;">
    <tr>
      <td style="background:#059669;padding:24px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:18px;">🎓 새 가입 승인 요청</h1>
      </td>
    </tr>
    <tr>
      <td style="background:#111;padding:32px;border:1px solid #262626;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">이름</td><td style="padding:8px 0;color:#fff;font-size:14px;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">이메일</td><td style="padding:8px 0;color:#10b981;font-size:14px;">${email}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">소속</td><td style="padding:8px 0;color:#fff;font-size:14px;">${organization || '-'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">직무</td><td style="padding:8px 0;color:#fff;font-size:14px;">${jobRole}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">참여 상태</td><td style="padding:8px 0;color:#fbbf24;font-size:14px;">${participationStatus === 'participating' ? '참여 중' : '수료'}</td></tr>
        </table>
        <div style="margin-top:24px;text-align:center;">
          <a href="https://hobbytan-ai.web.app/super-wks/admin" style="display:inline-block;padding:12px 28px;background:#059669;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">승인 페이지로 이동</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px;text-align:center;">
        <p style="margin:0;color:#525252;font-size:11px;">${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</p>
      </td>
    </tr>
  </table>
</body>
</html>`,
    }).catch(err => {
      console.error("Failed to send onboarding notification:", err);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding notify error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
