import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";
 // 👈 Cloudinary helper bana lena

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const image = formData.get("image");
    const pdf = formData.get("pdf");

    if (!title || !image || !pdf) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Upload image
    const imageUpload = await uploadToCloudinary(image, "catalogues");

    // ✅ Upload PDF
    const pdfUpload = await uploadToCloudinary(pdf, "catalogues", "raw"); // 👈 raw for PDF

    // ✅ Insert into DB
    await connection.execute(
      "INSERT INTO catalogues (title, imageUrl, pdfUrl) VALUES (?, ?, ?)",
      [title, imageUpload.secure_url, pdfUpload.secure_url]
    );

    return NextResponse.json(
      { message: "Catalogue uploaded successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Catalogue upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


// GET - Fetch all catalogues
export async function GET() {
  try {
    const [rows] = await connection.execute(
      "SELECT id, title, imageUrl, pdfUrl, created_at FROM catalogues ORDER BY created_at DESC"
    );

    return NextResponse.json({ catalogues: rows }, { status: 200 });
  } catch (err) {
    console.error("GET Catalogue Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
