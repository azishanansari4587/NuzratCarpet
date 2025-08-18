import connection from "@/lib/connection";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const [userRows] = await connection.query("SELECT COUNT(*) AS totalUsers FROM users");
        const [productRows] = await connection.query("SELECT COUNT(*) AS totalProducts FROM product");
        const [collectionRows] = await connection.query("SELECT COUNT(*) AS totalCollections FROM collection");
        const [orderRows] = await connection.query("SELECT COUNT(*) AS totalOrders FROM enquiries");
        
        
        // Fetch order counts for this month and last month
        const [currentMonth] = await connection.execute(
            `SELECT COUNT(*) AS count FROM enquiries WHERE MONTH(created_at) = MONTH(CURRENT_DATE())`
        );
        const [lastMonth] = await connection.execute(
            `SELECT COUNT(*) AS count FROM enquiries WHERE MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)`
        );



        
        const totalUsers = userRows[0].totalUsers;
        const totalProducts = productRows[0].totalProducts;
        const totalCollections = collectionRows[0].totalCollections;
        const totalOrders = orderRows[0].totalOrders;


        const currentCount = currentMonth[0]?.count || 0;
        const lastCount = lastMonth[0]?.count || 0;

        // Calculate percentage change
        let percentageChange = 0;
        if (lastCount > 0) {
        percentageChange = ((currentCount - lastCount) / lastCount) * 100;
        } else if (currentCount > 0) {
        percentageChange = 100; // If last month was 0, treat it as 100% growth
        }

        percentageChange = Math.round(percentageChange);

        // Simulated data; replace with your actual data fetching logic
        const data = {
        totalUsers,
        totalProducts,
        totalCollections,
        totalOrders,
        percentageChange,
        };
    
        return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        });
            
    }catch (error) {
        console.error('Database query error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch totals from database' }), {
            status: 500,
            headers: {
            'Content-Type': 'application/json',
            },
        });
    } 
  }