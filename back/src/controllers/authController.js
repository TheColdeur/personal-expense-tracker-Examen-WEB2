import { pool } from "../config/db.js";
import { hash } from "bcryptjs";

const createUser = async (username, email, password) => {
    const user = await pool.query("INSERT INTO users (username, email, hashedPassword) VALUES ($1, $2, $3) RETURNING id, email, username", [username, email, password]);
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
        
        res.status(201).json(newUser);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error");
    }
} 