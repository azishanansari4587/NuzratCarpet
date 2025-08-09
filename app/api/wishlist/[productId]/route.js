import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connection from "@/lib/connection";

const JWT_SECRET = process.env.JWT_SECRET;

export async function DELETE(req, { params }) {
  const { productId } = params;
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;



    const [result] = await connection.execute(
      `DELETE FROM wishlist WHERE productId = ? AND userId = ?`,
      [productId, userId]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Item not found or not yours." }, { status: 404 });
    }

    return NextResponse.json({ message: "Item removed from wishlist." });
  } catch (err) {
    console.error("Wishlist DELETE Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
