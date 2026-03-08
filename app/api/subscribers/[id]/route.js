import connection from "@/lib/connection"; // apna MySQL connection file
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const [result] = await connection.execute(`DELETE FROM subscriber WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Subscriber not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Subscriber deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete subscriber." },
      { status: 500 }
    );
  }
}