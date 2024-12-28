import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        // console.log('Received Data:', body);

        const { userId, cartItems } = body;

        if (!userId.id || !Array.isArray(cartItems) || cartItems.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid user ID or empty cart items" }),
                { status: 400 }
            );
        }

        const queries = cartItems.map((item) => {
            console.log(item);
            
            const { productId, color, size, quantity } = item;
            console.log('Processing Item:', { userId, productId, color, size, quantity });

            // Extract the user ID
        const userIdValue = userId.id;
            // Validate cart items
        cartItems.forEach((item, index) => {
            const { productId, color, size, quantity } = item;
            if (!productId || !color || !size || typeof quantity !== 'number') {
                throw new Error(`Invalid cart item at index ${index}: ${JSON.stringify(item)}`);
            }
        });

            // if (!itemId || !color || !size || !quantity) {
            //     throw new Error('Invalid cart item');
            // }

            const userIdValue = userId.id;

            return connection.execute(
                `
                INSERT INTO cart (user_id, product_id, color, size, quantity)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    color = VALUES(color),
                    size = VALUES(size),
                    quantity = VALUES(quantity)
                `,
                [userIdValue, productId, color, size, quantity]
            );
            
            
        });


        // Execute all queries in parallel
        await Promise.all(queries);

        return new NextResponse(
            JSON.stringify({ message: "Checkout successful" }),
            { status: 200 }
        );
    } catch (error) {
        console.error('API Error:', error);
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error", details: error.message }),
            { status: 500 }
        );
    }
}


// export async function POST(request) {
//     const { userId, cartItems } = await request.json();

//     if (!userId || !Array.isArray(cartItems) || cartItems.length === 0) {
//         return new NextResponse(JSON.stringify({ error: 'Invalid user ID or empty cart items' }), { status: 400 });
//     }
    
//     try {
//         // await connection.beginTransaction();

//         // Verify if user exists in the users table
//         // const [userResult] = await connection.execute(
//         //     "SELECT * FROM users WHERE id = ?", [userId]
//         // );
//         // if(userResult.length === 0) {
//         //     return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
//         // }

//         const queries = cartItems.map((item) => {
//             const { itemId,  color, size, quantity } = item;
//             return connection.execute(
//                 `INSERT INTO cart (user_id, product_id, color, size,  quantity) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE color = VALUES(color), size = VALUES(size),  quantity = VALUES(quantity)`,
//                 [userId, itemId, color, size, quantity]
//             );
//         });

//         await Promise.all(queries);
//         return new NextResponse(JSON.stringify({ message: 'Cart updated successfully' }), { status: 200 }); 

//     } catch (error) {
//         console.error(error);
//         return new NextResponse(JSON.stringify({ error: 'Failed to update cart' }), { status: 500 });
//     }
// }
