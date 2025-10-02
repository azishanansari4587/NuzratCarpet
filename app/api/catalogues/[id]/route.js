import connection from "@/lib/connection";

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Catalogues ID is required" }), {
      status: 400,
    });
  }

  try {


    // Delete banner from database
    const [result] = await connection.execute(
      "DELETE FROM catalogues WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Catalogue not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Catalogue deleted successfully" }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}