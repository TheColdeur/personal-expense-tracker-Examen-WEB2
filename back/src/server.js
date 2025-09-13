import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { Pool } from "pg";

// Routes
import categoryRoutes from "./routes/categoryRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js"; // <-- renommé pour plus de clarté
import incomeReceiptRoutes from "./routes/incomeReceiptRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = 4000;
const upload = multer({ dest: "uploads/" });

/* -------------------- DATABASE -------------------- */
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "cashflow",
  password: process.env.DB_PASSWORD || "Novah Anusha",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

/* -------------------- MIDDLEWARE -------------------- */
app.use(
  cors({
    origin: "http://localhost:5173", // ton frontend React
    credentials: true,
  })
);
app.use(json());
app.use(cors());

/* -------------------- ROUTES -------------------- */
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/revenues", incomeRoutes); // <-- on garde uniquement CE fichier
app.use("/api/revenue-receipts", incomeReceiptRoutes);
app.use("/api/user", userRoutes);
app.use("/api/summary", summaryRoutes);

/* -------------------- EXPENSES -------------------- */
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur GET /expenses:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/expenses", upload.single("receipt"), async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      category,
      date,
      start_date,
      end_date,
      description,
    } = req.body;

    const receipt = req.file?.filename || null;

    const query = `
      INSERT INTO expenses (title, amount, type, category_id, date, start_date, end_date, description, receipt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      title,
      amount,
      type,
      category,
      date || null,
      start_date || null,
      end_date || null,
      description,
      receipt,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur POST /expenses:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM expenses WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Erreur DELETE /expenses/:id", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* -------------------- DEBUG MIDDLEWARE -------------------- */
app.use("/api/revenues", (req, res, next) => {
  console.log("👉 Requête reçue sur /api/revenues");
  console.log("Headers:", req.headers);
  next();
});

/* -------------------- SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`✅ Server started at: http://localhost:${PORT}`);
});
