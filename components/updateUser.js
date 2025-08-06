import connection from "@/lib/connection"; // Ensure this is your MySQL connection setup

export const updateUser = async (userId, updateData) => {
    try {
        const fields = Object.keys(updateData).map(field => `${field} = ?`).join(', ');
        const values = Object.values(updateData);

        const query = `UPDATE users SET ${fields} WHERE id = ?`;
        await connection.execute(query, [...values, userId]);

        console.log(`User with ID ${userId} updated successfully`);
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Database update failed');
    }
};
