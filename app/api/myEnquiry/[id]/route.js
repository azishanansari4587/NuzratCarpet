import connection from "@/lib/connection"; // apna MySQL connection file

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
