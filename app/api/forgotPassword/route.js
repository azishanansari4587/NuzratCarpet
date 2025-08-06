import connection from "@/lib/connection";
import { SendPasswordResetEmail } from "@/components/SendPasswordResetEmail";
// import { updateUser } from "@/components/updateUser";
import nodemailer from 'nodemailer';

export const POST = async (req, res) => {

    try {
        const { email } = await req.json();

        // Check if email exists in database
        // const user = await connection.getUserByEmail(email);
        const user = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }  

         // Generate reset token
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const resetTokenExpiry = new Date(Date.now() + 3600000);  
        // await connection.updateUser(user.id, {resetToken, resetTokenExpiry});
        await connection.execute("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?", [resetToken, resetTokenExpiry, email]);

        // Send email with reset token
        const resetLink = `http://localhost:3000/api/resetPassword?token=${resetToken}`;
        // await SendPasswordResetEmail(user.email, resetLink);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD
            }
        });
        console.log(process.env.EMAIL_ADDRESS, process.env.EMAIL_PASSWORD);
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Password Reset',
            text: `Please click the following link to reset your password: ${resetLink}`,
            html: `<p>Please click the following link to reset your password:</p> <a href="${resetLink}">${resetLink}</a>`,
        };
    
        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ message: 'Password reset email sent to your email' }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }  
}