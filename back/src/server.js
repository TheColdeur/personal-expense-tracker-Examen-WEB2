import express, { json } from "express"
import cors from "cors"
import { hash, compare } from "bcryptjs"
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors())
app.use(json())

//Routes
app.use("/api/auth", authRoutes)

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if(!email || !password){
            return res.status(404).send("Email and password are required")
        }

        const data = await readFile("users.json", "utf-8")
        const result = JSON.parse(data)
        const users = result.users

        for(let i=0; i<users.length; i++){
            if(email == users[i].email && await compare(password, users[i].password)){
                const token = sign(
                    { userId: users[i].id, email: users[i].email },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                )
            
                return res.json({ token, user: { id: users[i].id, email: users[i].email } })
            }
        }
        return res.status(401).send("Invalid password or email")

    } catch (err) {
        console.error();
        res.status(500).send("Internal server error")
    }
})
app.listen(PORT, () => {
    console.log(`Server started at : http://localhost:${PORT}`);
})