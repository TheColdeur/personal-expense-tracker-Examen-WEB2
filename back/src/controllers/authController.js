import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const createUser = async (username, email, password) => {
    const user = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email, username", [username, email, password]);
    return user.rows[0];
}
const findUserByEmail = async (email) => {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return user.rows[0];
}
const assignDefaultCategoriesToUser = async (userId) => {
    const defaultCategories = (await pool.query("SELECT id FROM categories WHERE is_default = true")).rows;
    
    for (const category of defaultCategories) {
        await pool.query(
            "INSERT INTO user_category (userId, categoryId) VALUES ($1, $2)",
            [userId, category.id]
        );
    }
    
    return defaultCategories;
}
// Create a new user, register
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        const exist = await findUserByEmail(email);
        
        if (exist) {
            return res.status(400).json({message: "User already exist"});
        }
        const hashedPassword = await hash(password, 12);
        const newUser = await createUser(username, email, hashedPassword);

        await assignDefaultCategoriesToUser(newUser.id);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: "User created",
            token,
            user : newUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    }
} 
// Log in into account
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        const exist = await findUserByEmail(email);
        
        if(!exist){
            return res.status(404).json({message: "Email or password incorrect"});
        }
        
        const validPassword = await bcrypt.compare(password, exist.password);

        if(!validPassword){
            return res.status(401).json({message: "Email or password incorrect"});
        }
        const token = jwt.sign(
            { id: exist.id, email: exist.email, username: exist.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successfully",
            token,
            user: {
                id: exist.id,
                username: exist.username,
                email: exist.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    }
}
// Log out
export const logout = async (req, res) => {
    try {
        res.json({ message: "Logout successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
}
// Get user info
export const userInfo = async (req, res) => {
    try {
        const userId = req.user;
        const user = await pool.query("SELECT id, email, username, create_at FROM users WHERE id = $1", [userId]);

        res.status(200).json({ user: user.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
}