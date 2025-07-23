import { NextResponse } from "next/server";
import connection from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
    const { email, password } = await request.json();

    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if(!trimmedEmail || !trimmedPassword) {
        return NextResponse.json({error: "Please fill in all fields"}, {status: 400});
    }

    try {
        //Check if the user exists //
        const [user] = await connection.execute("SELECT * FROM users WHERE email = ?", [trimmedEmail]);
        if(user.length === 0) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const users = user[0];

        // Check if verified
        if (users.is_verified !== 1) {
          return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
        }
    

        // Compare the provided password with the stored hash password //
        const isPasswordValid = await bcrypt.compare(trimmedPassword, user[0].password);
        if (!isPasswordValid) {
            return NextResponse.json({error: "Invalid Credentials"}, {status: 401});
        }

        // If successful, you can return user data or a token //
        return NextResponse.json({message: "Sign-in successful", user: user[0]}, {status: 200}); 
    } catch (error) {
        return NextResponse.json({error: 'Database error: ' + error.message}, {status: 500});
    }
}

