import nodemailer from "nodemailer/lib/nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"NEXUS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your NEXUS account",
    html: `
    <div style="font-family: sans-serif; max-width: 480px;">
    <h2>Welcome to NEXUS</h2>
    <p>Click the link below to verify your email and activate your account:</p>
    <a href="${verifyUrl}" style="display:inline-block; padding:10px 20px; background:#111; color:#fff; text-decoration:none; border-radius:6px;">Verify Email </a>
    <p style="color:#888; font-size:12px; margin-top:20px;">This link expires in one hour.</p>
    </div>
    `,
  });
};