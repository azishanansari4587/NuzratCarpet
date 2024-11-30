import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Newsletter Subscription Verification',
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
