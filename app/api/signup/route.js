import { NextResponse } from "next/server";
import connection from "@/lib/db";
import bcrypt from 'bcryptjs';


export async function POST(request) {
    const { name, email, password, contact, address } = await request.json();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!name || !trimmedEmail ||!trimmedPassword || !contact || !address ) {
        return NextResponse.json({ error: 'Please fill in all fields'}, {status: 400});
    }

    try {
        //Check if already exists 
        const [userExists] = await connection.execute("SELECT * FROM users WHERE email = ?", [trimmedEmail]);
        if( userExists.length > 0) {
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        //Hash the Password //
        const hasedPassword = await bcrypt.hash(trimmedPassword, 10);

        //Insert the new user into the database 
        await connection.execute(
            "INSERT INTO users (name, email, password, contact, address) VALUES (?, ?, ?, ?, ?)",
            [name, trimmedEmail, hasedPassword, contact, address]
        );

        return NextResponse.json({message: 'User registered successfully'}, {status: 201});

    } catch (error) {
        return NextResponse.json({error: "Database error: " + error.message}, {status: 500});
    }
}