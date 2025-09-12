import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import { hash } from "bcryptjs";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user;
        
        const user = await pool.query(
            "SELECT id, username, email, create_at FROM users WHERE id = $1", 
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "Profile retrieved successfully",
            user: user.rows[0] 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user;
        const { username, email } = req.body;

        if (!username && !email) {
            return res.status(400).json({ 
                message: "At least one field (username or email) is required" 
            });
        }

        const userCheck = await pool.query(
            "SELECT * FROM users WHERE id = $1", 
            [userId]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email) {
            const emailCheck = await pool.query(
                "SELECT id FROM users WHERE email = $1 AND id != $2", 
                [email, userId]
            );

            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ 
                    message: "Email already exists" 
                });
            }
        }

        const updates = [];
        const values = [];
        let paramCount = 0;

        if (username !== undefined) {
            paramCount++;
            updates.push(`username = $${paramCount}`);
            values.push(username);
        }
        if (email !== undefined) {
            paramCount++;
            updates.push(`email = $${paramCount}`);
            values.push(email);
        }

        values.push(userId);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount + 1} RETURNING id, username, email, create_at`;
        
        const updatedUser = await pool.query(query, values);

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: "Current password and new password are required" 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: "New password must be at least 6 characters long" 
            });
        }

        const user = await pool.query(
            "SELECT password FROM users WHERE id = $1", 
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ 
                message: "Current password is incorrect" 
            });
        }

        const hashedNewPassword = await hash(newPassword, 12);

        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2", 
            [hashedNewPassword, userId]
        );

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                message: "Password is required to delete account" 
            });
        }

        const user = await pool.query(
            "SELECT password FROM users WHERE id = $1", 
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ 
                message: "Password is incorrect" 
            });
        }

        await pool.query("DELETE FROM user_category WHERE userId = $1", [userId]);
        await pool.query("DELETE FROM expenses WHERE userId = $1", [userId]);
        await pool.query("DELETE FROM revenues WHERE userId = $1", [userId]);
        await pool.query("DELETE FROM users WHERE id = $1", [userId]);

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};