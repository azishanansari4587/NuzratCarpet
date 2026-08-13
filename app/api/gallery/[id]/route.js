import connection from "@/lib/connection";
import { NextResponse } from "next/server";

// ✅ DELETE -> Delete gallery image by id
export async function DELETE(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
  }

  try {
    const [result] = await connection.execute(
      "DELETE FROM gallery WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting gallery image:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ PUT -> Update image URL (replace image)
export async function PUT(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const [result] = await connection.execute(
      "UPDATE gallery SET imageUrl = ? WHERE id = ?",
      [imageUrl, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error updating gallery image:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
