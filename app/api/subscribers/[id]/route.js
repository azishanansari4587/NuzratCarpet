import connection from "@/lib/connection"; // apna MySQL connection file
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await connection.query(`DELETE FROM subscriber WHERE id = ?`, [id]);

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