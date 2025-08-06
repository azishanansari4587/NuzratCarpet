import { NextResponse } from "next/server";
import connection from "@/lib/connection";



export async function GET() {
    try {
      const [rows] = await connection.query('SELECT * FROM users'); // Replace 'users' with your table name
      return NextResponse.json(rows);
    } catch (error) {
      return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
    }
}