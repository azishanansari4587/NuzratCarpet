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
    
    // await connection.execute(
    //   "INSERT INTO subscriber (email) VALUES (?)",
    //   [email]
    // );

    try {
      // Try to insert the email
      await connection.execute(
        "INSERT INTO subscriber (email) VALUES (?)",
        [email]
      );
    } catch (dbError) {
      // Check for duplicate entry error
      if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'You are already subscribed.' }, { status: 409 });
      }

      // Other DB error
      throw dbError;
    }
    
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


// ** GET METHOD //
export async function GET() {
  try {
    const [rows] = await connection.execute("SELECT * FROM subscriber"); 
    return NextResponse.json({ subscribers: rows });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}