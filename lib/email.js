import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Verify Your Email',
    text: `Click the following link to verify your email: ${verificationLink}`,
    // html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}
