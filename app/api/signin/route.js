// import { NextResponse } from "next/server";
// import connection from "@/lib/connection";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//     const { email, password } = await request.json();

//     const trimmedEmail = email?.trim();
//     const trimmedPassword = password?.trim();

//     if(!trimmedEmail || !trimmedPassword) {
//         return NextResponse.json({error: "Please fill in all fields"}, {status: 400});
//     }

//     try {
//         //Check if the user exists //
//         const [user] = await connection.execute("SELECT * FROM users WHERE email = ?", [trimmedEmail]);
//         if(user.length === 0) {
//             return NextResponse.json({error: "User not found"}, {status: 404});
//         }

//         const users = user[0];

//         // Check if verified
//         if (users.is_verified !== 1) {
//           return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
//         }
    

//         // Compare the provided password with the stored hash password //
//         const isPasswordValid = await bcrypt.compare(trimmedPassword, user[0].password);
//         if (!isPasswordValid) {
//             return NextResponse.json({error: "Invalid Credentials"}, {status: 401});
//         }

//         // If successful, you can return user data or a token //
//         return NextResponse.json({message: "Sign-in successful", user: user[0]}, {status: 200}); 
//     } catch (error) {
//         return NextResponse.json({error: 'Database error: ' + error.message}, {status: 500});
//     }
// }

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
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

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
