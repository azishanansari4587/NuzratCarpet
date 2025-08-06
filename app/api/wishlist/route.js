import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connection from "@/lib/connection";

const JWT_SECRET = process.env.JWT_SECRET; // Ensure it's set in your .env.local

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const [rows] = await connection.execute(
      `SELECT p.id, p.name, p.images, p.inStock, p.slug
       FROM wishlist w
       JOIN product p ON w.productId = p.id
       WHERE w.userId = ?`,
      [userId]
    );

    const items = rows.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: JSON.parse(product.images)[0], // images stored as JSON array
      inStock: !!product.inStock
    }));

    return NextResponse.json({ wishlistItems: items }, { status: 200 });

  } catch (error) {
    console.error("Get Wishlist Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
