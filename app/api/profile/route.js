import  connection  from "@/lib/connection";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


// Utility function to extract userId from JWT
function getUserIdFromRequest(req) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;

    } catch (err) {
      return null;
    }
  }
  

  // ✅ GET method to fetch user profile
export async function GET(req) {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
  
      if (rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ user: rows[0] });
    } catch (err) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }
  


export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();

    const [result] = await connection.execute(
      `
      UPDATE users 
      SET name = ?, phone = ?, address = ?, city = ?, state = ?, zipCode = ?, country = ?
      WHERE id = ?
      `,
      [
        body.name,
        body.phone,
        body.address,
        body.city,
        body.state,
        body.zipCode,
        body.country,
        userId,
      ]
    );

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
