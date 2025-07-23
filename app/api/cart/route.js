import connection from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(request) {
   const { userId, productId, quantity } = await request.json();
   try {
    // Check if the product is already in the cart for this user
    const [existingCartItem] = await connection.execute('SELECT * FROM cart WHERE product_id = ?', [ productId]);
    if (existingCartItem.length > 0) {
      // Update the quantity of the existing cart item
      await connection.execute('UPDATE cart SET quantity = ?, color = ?, size = ? WHERE  product_id = ?', [quantity,  productId]);
    } else {
      // Insert a new cart item
      await connection.execute('INSERT INTO cart ( product_id, quantity, color, size) VALUES (?, ?, ?, ?)', [productId, quantity, color, size]);
    }
    return new NextResponse(JSON.stringify({ message: 'Cart updated successfully' }), { status: 200 });
   } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update cart' }), { status: 500 });
   }
}

