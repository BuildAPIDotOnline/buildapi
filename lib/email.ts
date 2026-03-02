import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'BuildAPI <noreply@example.com>';

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'SMTP not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local'
    );
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: 'Verify your BuildAPI account',
    html: `
      <h2>Verify your email</h2>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <hr>
      <p style="color: #888; font-size: 12px;">BuildAPI</p>
    `,
    text: `Your verification code is: ${otp}. This code expires in 10 minutes. If you didn't create an account, you can safely ignore this email.`,
  });
}

export async function sendUnderReviewEmail(
  email: string,
  firstName: string
): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: 'Your BuildAPI account is under review',
    html: `
      <h2>Hi ${firstName},</h2>
      <p>Thank you for verifying your email address. Your account is now under review.</p>
      <p>Your account will be accessible within <strong>2–3 business days</strong>. We'll send you another email once it's approved.</p>
      <p>If you have any questions, please contact our support team.</p>
      <hr>
      <p style="color: #888; font-size: 12px;">BuildAPI</p>
    `,
    text: `Hi ${firstName}, Thank you for verifying your email. Your account is under review and will be accessible within 2-3 business days. We'll email you once it's approved.`,
  });
}
