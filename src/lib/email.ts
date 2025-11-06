import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const subject = 'Selamat Datang di Sistem Monitoring PEN';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Selamat Datang, ${name}!</h2>
      <p>Akun Anda telah berhasil dibuat di Sistem Monitoring Program Ekonomi Nasional (PEN).</p>
      <p>Anda dapat mengakses sistem melalui:</p>
      <a href="${process.env.APP_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Masuk ke Sistem</a>
      <p>Jika Anda memiliki pertanyaan, silakan hubungi administrator.</p>
      <p>Salam,<br>Tim Sistem Monitoring PEN</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  const subject = 'Reset Password - Sistem Monitoring PEN';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Reset Password</h2>
      <p>Anda telah meminta reset password untuk akun Sistem Monitoring PEN.</p>
      <p>Klik link berikut untuk mereset password Anda:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Password</a>
      <p>Link ini akan kadaluarsa dalam 1 jam.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
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
      <p>Silakan login ke sistem untuk melihat detail rencana aksi tersebut.</p>
      <a href="${process.env.APP_URL || 'http://localhost:5173'}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Lihat Dashboard</a>
      <p>Salam,<br>Tim Sistem Monitoring PEN</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
}