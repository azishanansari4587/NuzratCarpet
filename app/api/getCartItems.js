import { NextResponse } from "next/server";
import connection from "@/lib/connection"; // Your MySQL connection file

export async function GET() {
  try {
    const [rows] = await connection.execute(`
      SELECT 
          cart.id,
          users.name AS user_name,
          users.email AS user_email,
          products.name AS product_name,
          products.images AS product_images,
          products.rugs,
          cart.quantity,
          cart.size,
          cart.color,
          DATE_FORMAT(cart.created_at, '%Y-%m-%d') AS formatted_date,
          TIME_FORMAT(cart.created_at, '%h:%i %p') AS formatted_time
      FROM cart
      JOIN users ON cart.user_id = users.id
      JOIN products ON cart.product_id = products.id;
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  }
}
