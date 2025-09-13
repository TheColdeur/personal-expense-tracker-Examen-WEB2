import { pool } from "../config/db.js";

const userId = 1; // ← ID fixe pour développement sans auth

export const getRevenues = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, amount, description, date, source, receipt_upload, create_at
      FROM incomes 
      WHERE usersId = $1
    `;
    let params = [userId];
    let paramCount = 1;

    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }
    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` ORDER BY date DESC, id DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const revenues = await pool.query(query, params);

    let countQuery = "SELECT COUNT(*) FROM incomes WHERE usersId = $1";
    let countParams = [userId];
    let countParamCount = 1;

    if (startDate) {
      countParamCount++;
      countQuery += ` AND date >= $${countParamCount}`;
      countParams.push(startDate);
    }
    if (endDate) {
      countParamCount++;
      countQuery += ` AND date <= $${countParamCount}`;
      countParams.push(endDate);
    }

    const totalCount = await pool.query(countQuery, countParams);

    res.status(200).json({
      revenues: revenues.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount.rows[0].count / limit),
        totalItems: parseInt(totalCount.rows[0].count),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("❌ getRevenues error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRevenueById = async (req, res) => {
  try {
    const revenueId = req.params.id;

    const revenue = await pool.query(
      `SELECT id, amount, description, date, source, receipt_upload, create_at
       FROM incomes 
       WHERE id = $1 AND usersId = $2`,
      [revenueId, userId]
    );

    if (revenue.rows.length === 0) {
      return res.status(404).json({ message: "Revenue not found or access denied" });
    }

    res.status(200).json({ revenue: revenue.rows[0] });
  } catch (err) {
    console.error("❌ getRevenueById error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRevenue = async (req, res) => {
  try {
    const { amount, description, date, source, receipt_upload } = req.body;

    if (!amount || !date || !source) {
      return res.status(400).json({ message: "Amount, date, and source are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const newRevenue = await pool.query(
      `INSERT INTO incomes (usersId, amount, description, date, source, receipt_upload) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, amount, description, date, source, receipt_upload, create_at`,
      [userId, amount, description || '', date, source, receipt_upload || null]
    );

    res.status(201).json({
      message: "Revenue created successfully",
      revenue: newRevenue.rows[0],
    });
  } catch (err) {
    console.error("❌ createRevenue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRevenue = async (req, res) => {
  try {
    const revenueId = req.params.id;
    const { amount, description, date, source, receipt_upload } = req.body;

    const revenueCheck = await pool.query(
      "SELECT * FROM incomes WHERE id = $1 AND usersId = $2",
      [revenueId, userId]
    );

    if (revenueCheck.rows.length === 0) {
      return res.status(404).json({ message: "Revenue not found or access denied" });
    }

    if (amount && amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const updates = [];
    const values = [];
    let paramCount = 0;

    if (amount !== undefined) {
      paramCount++;
      updates.push(`amount = $${paramCount}`);
      values.push(amount);
    }
    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(description);
    }
    if (date !== undefined) {
      paramCount++;
      updates.push(`date = $${paramCount}`);
      values.push(date);
    }
    if (source !== undefined) {
      paramCount++;
      updates.push(`source = $${paramCount}`);
      values.push(source);
    }
    if (receipt_upload !== undefined) {
      paramCount++;
      updates.push(`receipt_upload = $${paramCount}`);
      values.push(receipt_upload);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(revenueId);
    const query = `UPDATE incomes SET ${updates.join(', ')} WHERE id = $${paramCount + 1} RETURNING *`;

    const updatedRevenue = await pool.query(query, values);

    res.status(200).json({
      message: "Revenue updated successfully",
      revenue: updatedRevenue.rows[0],
    });
  } catch (err) {
    console.error("❌ updateRevenue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRevenue = async (req, res) => {
  try {
    const revenueId = req.params.id;

    const revenue = await pool.query(
      "SELECT * FROM incomes WHERE id = $1 AND usersId = $2",
      [revenueId, userId]
    );

    if (revenue.rows.length === 0) {
      return res.status(404).json({ message: "Revenue not found or access denied" });
    }

    await pool.query("DELETE FROM incomes WHERE id = $1", [revenueId]);

    res.status(200).json({ message: "Revenue deleted successfully" });
  } catch (err) {
    console.error("❌ deleteRevenue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query;

    let dateFilter = '';
    const params = [userId];
    let paramCount = 1;

    if (startDate) {
      paramCount++;
      dateFilter += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }
    if (endDate) {
      paramCount++;
      dateFilter += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    const totalQuery = `
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM incomes 
      WHERE usersId = $1 ${dateFilter}
    `;
    const totalResult = await pool.query(totalQuery, params);

    let timeGroupBy;
    switch (period) {
      case 'day':
        timeGroupBy = "DATE(date)";
        break;
      case 'week':
        timeGroupBy = "DATE_TRUNC('week', date)";
        break;
      case 'year':
        timeGroupBy = "DATE_TRUNC('year', date)";
        break;
      default:
        timeGroupBy = "DATE_TRUNC('month', date)";
    }

    const timeQuery = `
      SELECT ${timeGroupBy} as period, SUM(amount) as total
      FROM incomes
      WHERE usersId = $1 ${dateFilter}
      GROUP BY ${timeGroupBy}
      ORDER BY period ASC
    `;
    const timeResult = await pool.query(timeQuery, params);

    res.status(200).json({
      total: parseFloat(totalResult.rows[0].total),
      overTime: timeResult.rows.map(row => ({
        period: row.period,
        total: parseFloat(row.total),
      })),
    });
  } catch (err) {
    console.error("❌ getRevenueStats error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
