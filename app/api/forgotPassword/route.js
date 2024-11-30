import connection from "@/lib/db";
import { SendPasswordResetEmail } from "@/components/SendPasswordResetEmail";


export const POST = async (req, res) => {

    try {
        
    } catch (error) {
        
    }

    const { email } = await req.json();

    // Check if email exists in database
    const user = await connection.getUserByEmail(email);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }    

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000);
    await connection.updateUser(user.id, {resetToken, resetTokenExpiry});

    // Send email with reset token
    const resetLink = `http://localhost:3000/api/resetPassword?token=${resetToken}`;
    await SendPasswordResetEmail(user.email, resetLink);
    return res.status(200).json({ message: 'Password reset email sent to your email' });

     
}