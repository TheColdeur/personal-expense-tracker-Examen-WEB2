import { pool } from "../config/db.js";
import path from "path";

export const uploadReceipt = async (req, res) => {
    try {
        const expenseId = req.params.idExpense;
        const userId = req.user;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const expense = await pool.query(
            "SELECT * FROM expenses WHERE id = $1 AND userId = $2", 
            [expenseId, userId]
        );

        if (expense.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found or access denied" });
        }

        await pool.query(
            "UPDATE expenses SET receipt_upload = $1 WHERE id = $2",
            [req.file.filename, expenseId]
        );

        res.status(200).json({ 
            message: "File uploaded successfully", 
            filename: req.file.filename 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const downloadReceipt = async (req, res) => {
    try {
        const expenseId = req.params.idExpense;
        const userId = req.user;

        const expense = await pool.query(
            "SELECT * FROM expenses WHERE id = $1 AND userId = $2", 
            [expenseId, userId]
        );

        if(expense.rows.length === 0){
            return res.status(404).json({ message: "Expense not found or access denied" });
        }

        if (!expense.rows[0].receipt_upload) {
            return res.status(404).json({ message: "No receipt found for this expense" });
        }

        const filePath = path.resolve('./uploads', expense.rows[0].receipt_upload);
        
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