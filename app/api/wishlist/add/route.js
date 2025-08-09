import { NextResponse } from "next/server";
import connection from "@/lib/connection";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { userId, productId } = body;

//     if (!userId || !productId) {
//       return NextResponse.json({ error: "userId and productId required" }, { status: 400 });
//     }

//     await connection.execute(
//       "INSERT INTO wishlist (userId, productId) VALUES (?, ?)",
//       [userId, productId]
//     );

//     return NextResponse.json({ message: "Added to wishlist" }, { status: 200 });
//   } catch (error) {
//     console.error("Wishlist Error:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

export async function POST(req) {
    try {
      const body = await req.json();
      const { userId, productId } = body;
  
      if (!userId || !productId) {
        return NextResponse.json({ error: "userId and productId required" }, { status: 400 });
      }
  
      // Try inserting into wishlist
      await connection.execute(
        "INSERT INTO wishlist (userId, productId) VALUES (?, ?)",
        [userId, productId]
      );
  
      return NextResponse.json({ message: "Added to wishlist" }, { status: 200 });
  
    } catch (error) {
      // Detect duplicate error (ER_DUP_ENTRY in MySQL)
      if (error.code === "ER_DUP_ENTRY") {
        return NextResponse.json({ error: "This product is already in your wishlist" }, { status: 409 });
      }
  
      console.error("Wishlist Error:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }
  


export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const [rows] = await connection.execute(
      `SELECT p.id, p.name, p.images, p.inStock
       FROM wishlist w
       JOIN products p ON w.productId = p.id
       WHERE w.userId = ?`,
      [userId]
    );

    const items = rows.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: JSON.parse(product.images)[0],  // 🟡 Assuming images is JSON array
      inStock: product.inStock === 1
    }));

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Fetch Wishlist Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

