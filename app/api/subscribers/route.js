import nodemailer from 'nodemailer';
import connection from "@/lib/connection";
import { NextResponse } from "next/server";


export  async function POST(request) {
  
  try {
    const { email } = await request.json();
    console.log(email);
  

    if(!email || !email.includes('@')) {
        return  NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    await connection.execute(
      "INSERT INTO subscribers (email) VALUES (?)",
      [email]
    );

    // Configure nodemailer

    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
        
      },

    });
    console.log(process.env.EMAIL_ADDRESS, process.env.EMAIL_PASSWORD);

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Thanks for subscribing!",
      html: `
        <h1>Thanks for subscribing!</h1>
         <p>Thank you for subscribing to our newsletter. Stay tuned for the latest updates and exclusive content!</p>
        <p>Best Regards,</p>
        <p>Your Company Team</p>
        `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" });

  } catch (error) {
    console.log("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

