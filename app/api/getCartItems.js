import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { userId } = request.query;
    try {
      const [rows] = await connection.execute('SELECT cart.*, products.name, products.images FROM cart JOIN products ON cart.productId = products.id WHERE cart.userId = ?', [userId]);
      return new NextResponse(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch cart items' }), { status: 500 });
    }
  }