import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import revenueRoutes from "./routes/incomeRoutes.js";
import revenueReceiptRoutes from "./routes/incomeReceiptRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";

dotenv.config();

const app = express();
// const PORT = process.env.PORT;
const PORT = 4000;


app.use(cors());
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/revenues", revenueRoutes);
app.use("/api/revenue-receipts", revenueReceiptRoutes);
app.use("/api/user", userRoutes);
app.use("/api/summary", summaryRoutes);

app.listen(PORT, () => {
    console.log(`Server started at : http://localhost:${PORT}`);
});