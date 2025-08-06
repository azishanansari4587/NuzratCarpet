import connection from "@/lib/connection";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { userId, cartItems } = await request.json();
  
    try {
      await connection.beginTransaction();
  
      for (const item of cartItems) {
        const { itemId, quantity, color, size } = item;
  
        // Insert or update cart items
        await connection.execute(
          `INSERT INTO cart (user_id, product_id, quantity, color, size) VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), color = VALUES(color), size = VALUES(size)`,
          [userId, itemId, quantity, color, size]
        );
      }
  
      await connection.commit();
      connection.release();
      return new NextResponse(JSON.stringify({ message: 'Cart updated successfully' }), { status: 200 });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: 'Failed to update cart' }), { status: 500 });
    }
  }