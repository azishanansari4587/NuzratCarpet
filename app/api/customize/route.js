import { NextResponse } from "next/server";
import  connection  from "@/lib/connection";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      businessType,
      size,
      customSize,
      colors,
      pattern,
      timeline,
      additionalInfo,
      uploadedImages
    } = body;

    const customWidth = customSize?.width || null;
    const customLength = customSize?.length || null;

    await connection.query(
      `INSERT INTO custom_rug_requests 
        (name, email, phone, business_type, size, custom_width, custom_length, colors, pattern, timeline, additional_info, uploaded_images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        businessType,
        size,
        customWidth,
        customLength,
        colors,
        pattern,
        timeline,
        additionalInfo,
        JSON.stringify(body.uploadedImages || [])
      ]
    );

    //* Configure Nodemailer Transporter
    const transporter = await nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    //* Create Email HTML (for Admin)
    const adminHtml = `
      <h2>🧾 New Custom Rug Enquiry Received</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Business Type:</b> ${businessType}</p>
      <p><b>Size:</b> ${size}</p>
      ${
        customSize
          ? `<p><b>Custom Size:</b> ${customSize.width} x ${customSize.length}</p>`
          : ""
      }
      <p><b>Colors:</b> ${colors}</p>
      <p><b>Pattern:</b> ${pattern}</p>
      <p><b>Timeline:</b> ${timeline}</p>
      <p><b>Additional Info:</b> ${additionalInfo || "N/A"}</p>
      ${
        uploadedImages?.length
          ? `<p><b>Uploaded Images:</b><br>${uploadedImages
              .map((img) => `<a href="${img}" target="_blank">${img}</a>`)
              .join("<br>")}</p>`
          : ""
      }
    `; 

    // ✅ 4. Create Email HTML (for User)
    const userHtml = `
      <h3>Dear ${name},</h3>
      <p>Thank you for your custom rug enquiry at <b>Nuzrat Carpet Emporium</b>!</p>
      <p>We have received your request and will get back to you shortly.</p>
      <br/>
      <p>Here’s a summary of your enquiry:</p>
      <p><b>Size:</b> ${size}</p>
      <p><b>Colors:</b> ${colors}</p>
      <p><b>Pattern:</b> ${pattern}</p>
      <br/>
      <p>Warm regards,</p>
      <p><b>Nuzrat Carpet Emporium</b></p>
    `;

     // ✅ 5. Send Email to Admin
    await transporter.sendMail({
      from: `"Nuzrat Carpet Emporium" <${process.env.EMAIL_ADDRESS}>`,
      to: "nuzratcarpet@gmail.com", // admin email
      subject: "New Custom Rug Enquiry Received",
      html: adminHtml,
    });

    // ✅ 6. Send Confirmation Email to User
    await transporter.sendMail({
      from: `"Nuzrat Carpet Emporium" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Your Custom Rug Enquiry - Nuzrat Carpet Emporium",
      html: userHtml,
    });

    return NextResponse.json(
      { success: true, message: "Customization request submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving customization request:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const [messages] = await connection.query(
      `SELECT *
       FROM custom_rug_requests
       ORDER BY created_at DESC`
    );

     // Parse uploaded_images JSON strings
    const data = messages.map((row) => ({
      ...row,
      uploaded_images: JSON.parse(row.uploaded_images || "[]"),
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("MySQL Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
