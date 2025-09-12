// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { Pool } from 'pg';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import receiptRoutes from './routes/receiptRoutes.js';
import revenueRoutes from './routes/incomeRoutes.js';
import revenueReceiptRoutes from './routes/incomeReceiptRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// 🔧 PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cashflow',
  password: 'Novah Anusha', // ← à sécuriser via .env
  port: 5432,
});

// 🔧 Express setup
const app = express();
const PORT = process.env.PORT || 4000;
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json()); // ← pas besoin d'importer `json` séparément

// 🔗 Route bindings
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/revenues', revenueRoutes);
app.use('/api/revenue-receipts', revenueReceiptRoutes);
app.use('/api/user', userRoutes);

// 🔍 GET expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur GET /expenses:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📝 POST expense
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

// 🗑️ DELETE expense
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

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
