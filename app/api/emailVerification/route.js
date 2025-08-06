import connection from "@/lib/connection";


import { NextResponse } from 'next/server';
 // Assuming you have set up your DB connection

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Invalid or missing token' }, { status: 400 });
  }

  try {
    // Find user with the token
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE verification_token = ?",
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    const user = rows[0];

    // Update user to mark as verified
    await connection.execute(
      "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
      [user.id]
    );

    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
  
  // Check if the token exists in the database
  // const subscriber = await connection('users').where({ verification_token: token }).first();
  // if (!subscriber) {
  //   return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  // }

  // // Update the subscriber's status to verified
  // await connection('users').where({ verification_token: token }).update({ is_verified: true });

  // return NextResponse.json({ message: 'Email verified successfully!' }, { status: 200 });
}
