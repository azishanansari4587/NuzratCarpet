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
      size,
      customSize,
      material,
      colors,
      pattern,
      budget,
      timeline,
      additionalInfo,
    } = body;

    const customWidth = customSize?.width || null;
    const customLength = customSize?.length || null;

    await connection.query(
      `INSERT INTO custom_rug_requests 
        (name, email, phone, rug_type, size, custom_width, custom_length, material, colors, pattern, budget, timeline, additional_info)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        rugType,
        size,
        customWidth,
        customLength,
        material,
        colors,
        pattern,
        budget,
        timeline,
        additionalInfo,
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

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("MySQL Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
