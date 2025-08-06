import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";


export async function POST(request) {
    

    try {
        const { first_name, last_name, email, password, contact } = await request.json();
        const trimmedEmail = email?.trim();
        const trimmedPassword = password?.trim();

        if (!first_name || !last_name || !trimmedEmail ||!trimmedPassword || !contact ) {
            return NextResponse.json({ error: 'Please fill in all fields'}, {status: 400});
        }

        //Check if already exists 
        const [userExists] = await connection.execute("SELECT * FROM users WHERE email = ?", [trimmedEmail]);
        if( userExists.length > 0) {
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        //Hash the Password //
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        // Generate Email Verification Token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        //Insert the new user into the database 
        await connection.execute(
            "INSERT INTO users (first_name, last_name, email, password, contact, role, is_verified, verification_token, reset_token, reset_token_expiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [first_name, last_name, trimmedEmail, hashedPassword, contact, 0, 0, verificationToken, null, null]
        );


        // Send Verification Email
        await sendVerificationEmail(trimmedEmail, verificationToken);

        return NextResponse.json({message: 'User registered successfully'}, {status: 201});

    } catch (error) {
        return NextResponse.json({error: "Database error: " + error.message}, {status: 500});
    }
}