import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
  
    try {
      const [rows] = await connection.execute('SELECT * FROM cart WHERE user_id = ?', [userId]);
      return new NextResponse(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch cart items' }), { status: 500 });
    }
}