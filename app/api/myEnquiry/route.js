import { NextResponse } from "next/server";
// import { getSession } from "next-auth/react"; // If using next-auth
import connection from "@/lib/db"; 


//   export async function GET() {
//     try {
//       const [rows] = await connection.execute(`
//         SELECT 
//     cart.id,
//     users.name AS user_name,
//     users.email AS user_email,
//     products.name AS product_name,
//     products.rugs,
//     cart.quantity,
//     cart.size,
//     cart.color
// FROM cart
// JOIN users ON cart.user_id = users.id
// JOIN products ON cart.product_id = products.id;
//       `);
  
//       return NextResponse.json(rows, { status: 200 });
//     } catch (error) {
//       return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
//     }
// }

// Ensure you import your DB connection


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id"); // Get user_id from frontend request

    let query = `
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
    JOIN products ON cart.product_id = products.id
  `;

  let values = [];

  if (userId) {
    // Fetch cart items for a specific user
    query += ` WHERE cart.user_id = ?`;
    values.push(userId);
  }

  const [rows] = await connection.execute(query, values);


    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  }
}
