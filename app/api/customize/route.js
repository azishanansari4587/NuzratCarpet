import { NextResponse } from "next/server";
import  connection  from "@/lib/connection";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      rugType,
      businessType,
      size,
      customSize,
      material,
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
        (name, email, phone, rug_type, business_type, size, custom_width, custom_length, material, colors, pattern, timeline, additional_info, uploaded_images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        rugType,
        businessType,
        size,
        customWidth,
        customLength,
        material,
        colors,
        pattern,
        timeline,
        additionalInfo,
        JSON.stringify(body.uploadedImages || [])
      ]
    );

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
