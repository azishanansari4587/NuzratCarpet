
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connection from "@/lib/connection";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const body = await req.json();
    const { productId, quantity, color, size, image } = body;

    // Check if the same product with same color and size is already in cart
    const [existing] = await connection.execute(
      "SELECT * FROM cart WHERE userId = ? AND productId = ? AND color = ? AND size = ?",
      [decoded.id, productId, color, size]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "This item is already in the cart" }, { status: 409 });
    }

    // Insert if not exists
    await connection.execute(
      "INSERT INTO cart (userId, productId, quantity, color, size, image) VALUES (?, ?, ?, ?, ?, ?)",
      [decoded.id, productId, quantity, color, size, image]
    );

    return NextResponse.json({ message: "Added to cart successfully" });

  } catch (error) {
    console.error("Cart Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Join with product table if needed
    const [rows] = await connection.execute(`
      SELECT 
        c.id AS cartId,
        c.productId,
        c.quantity,
        c.size,
        c.color,
        c.image,
        p.name
      FROM cart c
      JOIN product p ON c.productId = p.id
      WHERE c.userId = ?
    `, [userId]);

    return NextResponse.json({ cartItems: rows });

  } catch (error) {
    console.error("Get Cart Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


