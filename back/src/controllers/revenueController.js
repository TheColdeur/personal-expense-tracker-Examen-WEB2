import { pool } from "../config/db.js";

export const getRevenues = async (req, res) => {
    try {
        const userId = req.user;
        const { page = 1, limit = 10, startDate, endDate, categoryId } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT i.id, i.amount, i.description, i.date, i.receipt_upload, 
                   c.name as category_name, c.id as category_id
            FROM incomes i 
            LEFT JOIN categories c ON i.categoryId = c.id 
            WHERE i.userId = $1
        `;
        let params = [userId];
        let paramCount = 1;

        if (startDate) {
            paramCount++;
            query += ` AND i.date >= $${paramCount}`;
            params.push(startDate);
        }
        if (endDate) {
            paramCount++;
            query += ` AND i.date <= $${paramCount}`;
            params.push(endDate);
        }
        if (categoryId) {
            paramCount++;
            query += ` AND i.categoryId = $${paramCount}`;
            params.push(categoryId);
        }

        query += ` ORDER BY i.date DESC, i.id DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const revenues = await pool.query(query, params);
        
        let countQuery = "SELECT COUNT(*) FROM incomes i WHERE i.userId = $1";
        let countParams = [userId];
        let countParamCount = 1;

        if (startDate) {
            countParamCount++;
            countQuery += ` AND i.date >= $${countParamCount}`;
            countParams.push(startDate);
        }
        if (endDate) {
            countParamCount++;
            countQuery += ` AND i.date <= $${countParamCount}`;
            countParams.push(endDate);
        }
        if (categoryId) {
            countParamCount++;
            countQuery += ` AND i.categoryId = $${countParamCount}`;
            countParams.push(categoryId);
        }

        const totalCount = await pool.query(countQuery, countParams);

        res.status(200).json({
            revenues: revenues.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount.rows[0].count / limit),
                totalItems: parseInt(totalCount.rows[0].count),
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRevenueById = async (req, res) => {
    try {
        const userId = req.user;
        const revenueId = req.params.id;

        const revenue = await pool.query(`
            SELECT i.id, i.amount, i.description, i.date, i.receipt_upload, i.source,
                   c.name as category_name, c.id as category_id
            FROM incomes i 
            LEFT JOIN categories c ON i.categoryId = c.id 
            WHERE i.id = $1 AND i.userId = $2
        `, [revenueId, userId]);

        if (revenue.rows.length === 0) {
            return res.status(404).json({ message: "Revenue not found or access denied" });
        }

        res.status(200).json({ revenue: revenue.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createRevenue = async (req, res) => {
    try {
        const userId = req.user;
        const { amount, description, date, source, categoryId } = req.body;

        if (!amount || !date || !source) {
            return res.status(400).json({ 
                message: "Amount, date, and source are required" 
            });
        }

        if (amount <= 0) {
            return res.status(400).json({ 
                message: "Amount must be greater than 0" 
            });
        }

        // Vérifier la catégorie si fournie
        if (categoryId) {
            const categoryCheck = await pool.query(`
                SELECT c.id FROM categories c 
                LEFT JOIN user_category uc ON uc.categoryId = c.id 
                WHERE (uc.userId = $1 OR c.is_default = true) AND c.id = $2
            `, [userId, categoryId]);

            if (categoryCheck.rows.length === 0) {
                return res.status(400).json({ 
                    message: "Category not found or access denied" 
                });
            }
        }

        const newRevenue = await pool.query(`
            INSERT INTO incomes (userId, amount, description, date, source, categoryId) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id, amount, description, date, source, categoryId
        `, [userId, amount, description || '', date, source, categoryId || null]);

        const revenueWithCategory = await pool.query(`
            SELECT i.id, i.amount, i.description, i.date, i.receipt_upload, i.source,
                   c.name as category_name, c.id as category_id
            FROM incomes i 
            LEFT JOIN categories c ON i.categoryId = c.id 
            WHERE i.id = $1
        `, [newRevenue.rows[0].id]);

        res.status(201).json({
            message: "Revenue created successfully",
            revenue: revenueWithCategory.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateRevenue = async (req, res) => {
    try {
        const userId = req.user;
        const revenueId = req.params.id;
        const { amount, description, date, source, categoryId } = req.body;

        const revenueCheck = await pool.query(
            "SELECT * FROM incomes WHERE id = $1 AND userId = $2",
            [revenueId, userId]
        );

        if (revenueCheck.rows.length === 0) {
            return res.status(404).json({ 
                message: "Revenue not found or access denied" 
            });
        }

        if (amount && amount <= 0) {
            return res.status(400).json({ 
                message: "Amount must be greater than 0" 
            });
        }

        if (categoryId) {
            const categoryCheck = await pool.query(`
                SELECT c.id FROM categories c 
                LEFT JOIN user_category uc ON uc.categoryId = c.id 
                WHERE (uc.userId = $1 OR c.is_default = true) AND c.id = $2
            `, [userId, categoryId]);

            if (categoryCheck.rows.length === 0) {
                return res.status(400).json({ 
                    message: "Category not found or access denied" 
                });
            }
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
        if (categoryId !== undefined) {
            paramCount++;
            updates.push(`categoryId = $${paramCount}`);
            values.push(categoryId);
        }

        if (updates.length === 0) {
            return res.status(400).json({ 
                message: "No fields to update" 
            });
        }

        values.push(revenueId);
        const query = `UPDATE incomes SET ${updates.join(', ')} WHERE id = $${paramCount + 1} RETURNING *`;
        
        const updatedRevenue = await pool.query(query, values);

        const revenueWithCategory = await pool.query(`
            SELECT i.id, i.amount, i.description, i.date, i.receipt_upload, i.source,
                   c.name as category_name, c.id as category_id
            FROM incomes i 
            LEFT JOIN categories c ON i.categoryId = c.id 
            WHERE i.id = $1
        `, [revenueId]);

        res.status(200).json({
            message: "Revenue updated successfully",
            revenue: revenueWithCategory.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteRevenue = async (req, res) => {
    try {
        const userId = req.user;
        const revenueId = req.params.id;

        const revenue = await pool.query(
            "SELECT * FROM incomes WHERE id = $1 AND userId = $2",
            [revenueId, userId]
        );

        if (revenue.rows.length === 0) {
            return res.status(404).json({ 
                message: "Revenue not found or access denied" 
            });
        }

        await pool.query("DELETE FROM incomes WHERE id = $1", [revenueId]);

        res.status(200).json({ message: "Revenue deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRevenueStats = async (req, res) => {
    try {
        const userId = req.user;
        const { startDate, endDate, period = 'month' } = req.query;

        let dateFilter = '';
        const params = [userId];
        let paramCount = 1;

        if (startDate) {
            paramCount++;
            dateFilter += ` AND i.date >= $${paramCount}`;
            params.push(startDate);
        }
        if (endDate) {
            paramCount++;
            dateFilter += ` AND i.date <= $${paramCount}`;
            params.push(endDate);
        }

        const totalQuery = `
            SELECT COALESCE(SUM(amount), 0) as total 
            FROM incomes i 
            WHERE userId = $1 ${dateFilter}
        `;
        const totalResult = await pool.query(totalQuery, params);

        const categoryQuery = `
            SELECT c.name, c.id, COALESCE(SUM(i.amount), 0) as total
            FROM categories c
            LEFT JOIN user_category uc ON uc.categoryId = c.id
            LEFT JOIN incomes i ON i.categoryId = c.id AND i.userId = $1 ${dateFilter}
            WHERE uc.userId = $1 OR c.is_default = true
            GROUP BY c.id, c.name
            HAVING COALESCE(SUM(i.amount), 0) > 0
            ORDER BY total DESC
        `;
        const categoryResult = await pool.query(categoryQuery, params);

        let timeGroupBy;
        switch (period) {
            case 'day':
                timeGroupBy = "DATE(i.date)";
                break;
            case 'week':
                timeGroupBy = "DATE_TRUNC('week', i.date)";
                break;
            case 'year':
                timeGroupBy = "DATE_TRUNC('year', i.date)";
                break;
            default:
                timeGroupBy = "DATE_TRUNC('month', i.date)";
        }

        const timeQuery = `
            SELECT ${timeGroupBy} as period, SUM(i.amount) as total
            FROM incomes i
            WHERE i.userId = $1 ${dateFilter}
            GROUP BY ${timeGroupBy}
            ORDER BY period ASC
        `;
        const timeResult = await pool.query(timeQuery, params);

        res.status(200).json({
            total: parseFloat(totalResult.rows[0].total),
            byCategory: categoryResult.rows.map(row => ({
                category: row.name,
                categoryId: row.id,
                total: parseFloat(row.total)
            })),
            overTime: timeResult.rows.map(row => ({
                period: row.period,
                total: parseFloat(row.total)
            }))
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};