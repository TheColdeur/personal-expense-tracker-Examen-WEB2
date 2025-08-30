import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const createUser = async (username, email, password) => {
    const user = await pool.query("INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING id, email, username", [username, email, password]);
    return user.rows[0];
}
const findUserByEmail = async (email) => {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return user.rows[0];
}
// Create a new user, register
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(404).send("Email and password are required");
        }

        const exist = await findUserByEmail(email);
        
        if (exist) {
            return res.status(400).send("User already exist");
        }
        const hashedPassword = await hash(password, 12);
        const newUser = await createUser(username, email, hashedPassword);

        const token = jwt.sign(
            { userId: newUser.id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        res.status(201).json({
            message: "User created",
            token,
            user : newUser
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error");
    }
} 
// Log in into account
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(404).send("Email and password are required");
        }

        const exist = await findUserByEmail(email);
        
        if(!exist){
            return res.status(404).json({message: "Email or password incorrect"});
        }
        
        const validPassword = await bcrypt.compare(password, exist.hashed_password);

        if(!validPassword){
            return res.status(401).json({message: "Email or password incorrect"});
        }
        const token = jwt.sign(
            { userId: exist.id },
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
        console.error(err.message);
        res.status(500).send("Internal server error");
    }
}