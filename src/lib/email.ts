import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_PASS,
  },
});

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    console.log('Attempting to send email to:', options.to);
    console.log('SMTP Config:', {
      host: 'smtp.gmail.com',
      port: 587,
      user: env.GMAIL_USER,
      from: env.SMTP_FROM
    });

    const mailOptions = {
      from: env.SMTP_FROM || env.GMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('Response:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const subject = 'Selamat Datang di Sistem Monitoring PEN';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Selamat Datang, ${name}!</h2>
      <p>Akun Anda telah berhasil dibuat di Sistem Monitoring Program Ekonomi Nasional (PEN).</p>
      <p>Akun Anda akan diverifikasi oleh tim admin. Selanjutnya Anda akan bisa login ke sistem menggunakan email dan password yang telah Anda daftarkan.</p>
      <p>Jika Anda memiliki pertanyaan, silakan hubungi administrator.</p>
      <p>Salam,<br>Tim Sistem Monitoring PEN</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const subject = 'Reset Password - Sistem Monitoring PEN';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Reset Password</h2>
      <p>Anda telah meminta reset password untuk akun Sistem Monitoring PEN.</p>
      <p><strong>Token Reset Password:</strong></p>
      <p style="background-color: #f3f4f6; padding: 15px; font-family: monospace; font-size: 16px; border-radius: 5px; word-break: break-all;">${resetToken}</p>
      <p>Silakan gunakan token di atas pada halaman reset password di sistem.</p>
      <p>Token ini akan kadaluarsa dalam 1 jam.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      <p>Salam,<br>Tim Sistem Monitoring PEN</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
}

export async function sendVerificationEmail(email: string, name: string): Promise<boolean> {
  const subject = 'Akun Anda Telah Diverifikasi - Sistem Monitoring PEN';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Akun Anda Telah Diverifikasi!</h2>
      <p>Halo ${name},</p>
      <p>Selamat! Akun Anda telah diverifikasi oleh tim admin.</p>
      <p>Anda sekarang dapat login ke sistem menggunakan email dan password yang telah Anda daftarkan.</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.APP_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Login ke Sistem</a>
      </div>
      <p>Jika Anda memiliki pertanyaan, silakan hubungi administrator.</p>
      <p>Salam,<br>Tim Sistem Monitoring PEN</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
}

export async function sendActionPlanNotification(email: string, name: string, actionPlanTitle: string): Promise<boolean> {
  const subject = 'Rencana Aksi Baru - Sistem Monitoring PEN';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Rencana Aksi Baru</h2>
      <p>Halo ${name},</p>
      <p>Rencana aksi baru telah dibuat: <strong>${actionPlanTitle}</strong></p>
      <p>Silakan login ke Sistem Monitoring PEN untuk melihat detail rencana aksi tersebut.</p>
      <p>Salam,<br>Tim Sistem Monitoring PEN</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
}