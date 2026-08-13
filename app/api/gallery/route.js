import connection from "@/lib/connection";
import { NextResponse } from "next/server";

// Auto-create gallery table if not exists
async function ensureTable() {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      imageUrl VARCHAR(500) NOT NULL,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// ✅ GET -> Fetch all gallery images sorted by sort_order
export async function GET() {
  try {
    await ensureTable();
    const [rows] = await connection.execute(
      "SELECT * FROM gallery ORDER BY sort_order ASC, created_at ASC"
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// ✅ POST -> Insert new gallery image
export async function POST(req) {
  try {
    await ensureTable();
    const body = await req.json();
    const { imageUrl, sort_order = 0 } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const [result] = await connection.execute(
      "INSERT INTO gallery (imageUrl, sort_order) VALUES (?, ?)",
      [imageUrl, sort_order]
    );

    return NextResponse.json(
      { message: "Image saved successfully", id: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving gallery image:", err);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
