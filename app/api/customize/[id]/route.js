import connection from "@/lib/connection";
import { NextResponse } from "next/server";


export async function PUT(req, { params }) {
  try {
    const { id } = params; // route params
    const { status } = await req.json();

    // Update query
    const [result] = await connection.query(
      "UPDATE custom_rug_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Rug not found" }, { status: 404 });
    }

    // Get updated row (optional)
    const [rows] = await connection.query("SELECT * FROM custom_rug_requests WHERE id = ?", [id]);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating rug:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await connection.query(`DELETE FROM custom_rug_requests WHERE id = ?`, [id]);

    return NextResponse.json(
      { success: true, message: "Custom rug enquiry deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete enquiry." },
      { status: 500 }
    );
  }
}
