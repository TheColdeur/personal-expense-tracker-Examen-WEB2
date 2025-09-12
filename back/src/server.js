import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import revenueRoutes from "./routes/incomeRoutes.js";
import revenueReceiptRoutes from "./routes/incomeReceiptRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');

dotenv.config();

// Connexion PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cashflow',
  password: 'Novah Anusha', // ← adapte si besoin
  port: 5432,
});

const app = express();
// const PORT = process.env.PORT;
const PORT = 4000;
const upload = multer({ dest: 'uploads/' });


app.use(cors());
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/revenues", revenueRoutes);
app.use("/api/revenue-receipts", revenueReceiptRoutes);
app.use("/api/user", userRoutes);

// Routes catégories (GET, POST, PUT, DELETE)
app.use('/api/categories', categoryRoutes);

// Route GET dépenses
app.get('/api/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur GET /expenses:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route POST dépense
app.post('/api/expenses', upload.single('receipt'), async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      category,
      date,
      start_date,
      end_date,
      description
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
      receipt
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur POST /expenses:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Erreur DELETE /expenses/:id', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
    console.log(`Server started at : http://localhost:${PORT}`);
});