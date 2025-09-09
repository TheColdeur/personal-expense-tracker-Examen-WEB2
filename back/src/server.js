import express, { json } from "express"
import cors from "cors"
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import receiptRoutes from "./routes/receiptRoutes.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(json())

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/receipts", receiptRoutes);


app.listen(PORT, () => {
    console.log(`Server started at : http://localhost:${PORT}`);
})