import { NextResponse } from "next/server";
import connection from "@/lib/db";


  export async function GET() {
    try {
      const [rows] = await connection.execute(`
        SELECT 
    cart.id,
    users.name AS user_name,
    users.email As user_email,
    products.name AS product_name,
    products.rugs,
    cart.quantity
    cart.size
    cart.color
    FROM cart
    JOIN users ON cart.user_id = users.id
    JOIN products ON cart.product_id = products.id;
      `);;
  
      return NextResponse.json(rows, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
    }
}