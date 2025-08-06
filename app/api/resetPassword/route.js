import bcrypt from 'bcryptjs';
import connection from '@/lib/connection'; // Adjust the path to your database connection module
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    // if (req.method !== "POST") {
    //     return res.status(405).json({ error: 'Method not allowed' });
    // }

    try {
    const { token, password, confirmPassword } = req.body;

    // Validate request body
    if (!token || !password || !confirmPassword) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const trimmedPassword = password.trim();
        // Find user by reset token
        // const user = await connection.getUserByResetToken(token);
        const user = await connection.execute("SELECT * FROM users WHERE reset_token = ?", [token]);

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Check if token is expired
        if (new Date() > new Date(user.resetTokenExpiry)) {
            return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        // Hash the new password
        const hasedPassword = await bcrypt.hash(trimmedPassword, 10);

        // Update user record
        // await connection.updateUser(user.id, {
        //     password: hashedPassword,
        //     resetToken: null,
        //     resetTokenExpiry: null,
        // });

        await connection.execute("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?", [hasedPassword, user.email]);

        return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });

    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
