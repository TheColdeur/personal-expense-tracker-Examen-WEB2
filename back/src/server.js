import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";
import revenueReceiptRoutes from "./routes/revenueReceiptRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/revenues", revenueRoutes);
app.use("/api/revenue-receipts", revenueReceiptRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server started at : http://localhost:${PORT}`);
});