import express from "express";
import { uploadReceipt, downloadReceipt } from "../controllers/receiptController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/:idExpense/upload", upload.single('receipt'), uploadReceipt);
router.get("/:idExpense/download", downloadReceipt);

export default router;