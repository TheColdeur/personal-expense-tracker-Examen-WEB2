import { pool } from "../config/db.js";
import path from "path";

export const uploadIncomeReceipt = async (req, res) => {
    try {
        const incomeId = req.params.idIncome;
        const userId = req.user;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const income = await pool.query(
            "SELECT * FROM incomes WHERE id = $1 AND usersId = $2",
            [incomeId, userId]
        );

        if (income.rows.length === 0) {
            return res.status(404).json({ message: "Income not found or access denied" });
        }

        await pool.query(
            "UPDATE incomes SET receipt_upload = $1 WHERE id = $2",
            [req.file.filename, incomeId]
        );

        res.status(200).json({
            message: "Receipt uploaded successfully",
            filename: req.file.filename
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const downloadIncomeReceipt = async (req, res) => {
    try {
        const incomeId = req.params.idIncome;
        const userId = req.user;

        const income = await pool.query(
            "SELECT * FROM incomes WHERE id = $1 AND usersId = $2",
            [incomeId, userId]
        );

        if (income.rows.length === 0) {
            return res.status(404).json({ message: "Income not found or access denied" });
        }

        if (!income.rows[0].receipt_upload) {
            return res.status(404).json({ message: "No receipt found for this income" });
        }

        const filePath = path.resolve('./uploads', income.rows[0].receipt_upload);
       
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(404).json({ message: "File not found" });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteIncomeReceipt = async (req, res) => {
    try {
        const incomeId = req.params.idIncome;
        const userId = req.user;

        const income = await pool.query(
            "SELECT * FROM incomes WHERE id = $1 AND usersId = $2",
            [incomeId, userId]
        );

        if (income.rows.length === 0) {
            return res.status(404).json({ message: "Income not found or access denied" });
        }

        if (!income.rows[0].receipt_upload) {
            return res.status(404).json({ message: "No receipt found for this income" });
        }

        await pool.query(
            "UPDATE incomes SET receipt_upload = NULL WHERE id = $1",
            [incomeId]
        );

        res.status(200).json({
            message: "Receipt deleted successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};