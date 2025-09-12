import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { uploadReceipt, downloadReceipt } from "../controllers/receiptController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/:idExpense/upload", authentication, upload.single('receipt'), uploadReceipt);
router.get("/:idExpense/download", authentication, downloadReceipt);

export default router;