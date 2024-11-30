import nodemailer from 'nodemailer';
import connection from "@/lib/db";
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




// export default async function POST(request) {
         
//         try {
//             const { email } = await request.json();

//             // Validate the email
//             if (!email || !email.includes('@')) {
//                 return  NextResponse.json({ error: 'Invalid email' }, { status: 400 });
//             }

//             // Generate verification token
//             const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            
//             // Insert subscriber into database
//             await connection.execute(
//                 "INSERT INTO subscribers (email, verification_token) VALUES (?, ?)", [email, verificationToken]
//             );

//             // Send verification email
//             const transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: "azishanansari4587@gmail.com",
//                     pass: "ttis babc wacu ywgu"
//                 }
//             }); 
//             const verificationLink = `http://localhost:3000/api/emailVerification?token=${verificationToken}`;
//             const mailOptions = {
//                 from: "azishanansari4587@gmail.com",
//                 to: email,
//                 subject: 'Email Verification',
//                 text: `Please click the following link to verify your email: ${verificationLink}`
//             };

//             // Send email
//             await transporter.sendMail(mailOptions);

//             return NextResponse.json({ message: 'Verification Email sent successfully' }, { status: 200 });
//         }catch (error) {
//             return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
//         }
//     }
