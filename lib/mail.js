// lib/mail.js
import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }) {
  // Transporter config
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
//     port: process.env.SMTP_PORT, // e.g. 465 (SSL) or 587 (TLS)
//     secure: process.env.SMTP_PORT == 465, // true for SSL, false for TLS
//     auth: {
//       user: process.env.SMTP_USER, // email address
//       pass: process.env.SMTP_PASS, // email password or app password
//     },
//   });
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Send email
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_ADDRESS}"`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
}
