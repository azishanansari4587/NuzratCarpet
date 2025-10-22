import connection from "@/lib/connection"; // apna MySQL connection file
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {

    const { id } = await context.params; // App Router me query params yaha se milte hain

    // Fetch enquiry
    const [rows] = await connection.execute(
      "SELECT * FROM enquiries WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Enquiry not found" }),
        { status: 404 }
      );
    }

    const enquiry = rows[0];

    return new Response(
      JSON.stringify({
        ...enquiry,
        cartItems: JSON.parse(enquiry.cartItems), // JSON string ko object banate hain
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }

}


export async function PUT(req, { params }) {
  try {
    const { id } = params; // route params
    const { status } = await req.json();

    // Update query
    const [result] = await connection.query(
      "UPDATE enquiries SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    // Get updated row (optional)
    const [rows] = await connection.query("SELECT * FROM enquiries WHERE id = ?", [id]);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await connection.query(`DELETE FROM enquiries WHERE id = ?`, [id]);

    return NextResponse.json(
      { success: true, message: "Product enquiry deleted successfully!" },
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


