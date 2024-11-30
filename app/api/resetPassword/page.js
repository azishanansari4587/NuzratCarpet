

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const { token, password, confirmPassword } = req.body;
    const user = await connection.getUserByResetToken(token);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.updateUser(user.id, { password: hashedPassword, resetToken: null, resetTokenExpiry: null });
    return res.status(200).json({ message: 'Password reset successful' });
}   