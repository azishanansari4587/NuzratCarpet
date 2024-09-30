import connection from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const [userRows] = await connection.query("SELECT COUNT(*) AS totalUsers FROM users");
        const [productRows] = await connection.query("SELECT COUNT(*) AS totalProducts FROM products");
        const [collectionRows] = await connection.query("SELECT COUNT(*) AS totalCollections FROM collections");

        const totalUsers = userRows[0].totalUsers;
        const totalProducts = productRows[0].totalProducts;
        const totalCollections = collectionRows[0].totalCollections;

        // Simulated data; replace with your actual data fetching logic
        const data = {
        totalUsers,
        totalProducts,
        totalCollections,
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