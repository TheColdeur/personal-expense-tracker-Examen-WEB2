import { pool } from "../config/db.js";
import path from "path";

export const uploadRevenueReceipt = async (req, res) => {
    try {
        const revenueId = req.params.idRevenue;
        const userId = req.user;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const revenue = await pool.query(
            "SELECT * FROM revenues WHERE id = $1 AND userId = $2",
            [revenueId, userId]
        );

        if (revenue.rows.length === 0) {
            return res.status(404).json({ message: "Revenue not found or access denied" });
        }

        await pool.query(
            "UPDATE revenues SET receipt_upload = $1 WHERE id = $2",
            [req.file.filename, revenueId]
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

export const downloadRevenueReceipt = async (req, res) => {
    try {
        const revenueId = req.params.idRevenue;
        const userId = req.user;

        const revenue = await pool.query(
            "SELECT * FROM revenues WHERE id = $1 AND userId = $2",
            [revenueId, userId]
        );

        if (revenue.rows.length === 0) {
            return res.status(404).json({ message: "Revenue not found or access denied" });
        }

        if (!revenue.rows[0].receipt_upload) {
            return res.status(404).json({ message: "No receipt found for this revenue" });
        }

        const filePath = path.resolve('./uploads', revenue.rows[0].receipt_upload);
       
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

export const deleteRevenueReceipt = async (req, res) => {
    try {
        const revenueId = req.params.idRevenue;
        const userId = req.user;

        const revenue = await pool.query(
            "SELECT * FROM revenues WHERE id = $1 AND userId = $2",
            [revenueId, userId]
        );

        if (revenue.rows.length === 0) {
            return res.status(404).json({ message: "Revenue not found or access denied" });
        }

        if (!revenue.rows[0].receipt_upload) {
            return res.status(404).json({ message: "No receipt found for this revenue" });
        }

        await pool.query(
            "UPDATE revenues SET receipt_upload = NULL WHERE id = $1",
            [revenueId]
        );

        res.status(200).json({
            message: "Receipt deleted successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};