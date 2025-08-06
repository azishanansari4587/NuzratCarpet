// app/api/cart/[id]/route.ts
// import { NextResponse } from "next/server";
// import connection from "@/lib/connection";

// export async function DELETE(req, { params }) {
//   const cartItemId = parseInt(params.id);
//   if (!cartItemId) {
//     return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
//   }

//   try {
//     const [result] = await connection.execute("DELETE FROM cart WHERE id = ?", [cartItemId]);

//     return NextResponse.json({ message: "Item removed from cart." });
//   } catch (error) {
//     console.error("Error deleting cart item:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connection from "@/lib/connection";

const JWT_SECRET = process.env.JWT_SECRET;

export async function DELETE(req, { params }) {
  const { cartId } = params;
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;



    // const [result] = await connection.execute(
    //   `DELETE FROM cart WHERE productId = ? AND userId = ?`,
    //   [productId, userId]
    // );
    const [result] = await connection.execute(
      `DELETE FROM cart WHERE id = ? AND userId = ?`,
      [cartId, userId]
    );

    // await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Item not found or not yours." }, { status: 404 });
    }

    return NextResponse.json({ message: "Item removed from wishlist." });
  } catch (err) {
    console.error("Wishlist DELETE Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}