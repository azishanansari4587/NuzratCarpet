import connection from "@/lib/connection";
import { NextResponse } from "next/server";


// ✅ POST -> Save Banner
export async function POST(req) {
  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const [result] = await connection.execute(
      "INSERT INTO projects (imageUrl) VALUES (?)",
      [imageUrl]
    );

    return NextResponse.json(
      { message: "Project saved successfully", id: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving project:", err);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}

// ✅ GET -> Fetch Banners
export async function GET() {
  try {
    const [rows] = await connection.execute("SELECT * FROM projects ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
