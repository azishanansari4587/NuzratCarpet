import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is set in your .env file

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return NextResponse.json({ error: "Please fill in all fields" }, { status: 400 });
    }

    // Fetch user from database
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [trimmedEmail]);

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Check if email is verified
    if (user.is_verified !== 1) {
      return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    // Return token and user data (avoid sending sensitive data like password)
    return NextResponse.json({
      message: "Sign-in successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name, // include whatever fields you want
        last_name: user.last_name
        // DO NOT return password
      },
    });

  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
