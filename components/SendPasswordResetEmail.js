
import React from 'react'

export const SendPasswordResetEmail = async({email, resetLink}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Password Reset',
        text: `Please click the following link to reset your password: ${resetLink}`,
        html: `<p>Please click the following link to reset your password:</p> <a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
}
