import express from "express";
import { 
    uploadIncomeReceipt, 
    downloadIncomeReceipt, 
    deleteIncomeReceipt 
} from "../controllers/incomeReceiptController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/:idRevenue/upload", upload.single('receipt'), uploadIncomeReceipt);

router.get("/:idRevenue/download", downloadIncomeReceipt);

router.delete("/:idRevenue/receipt", deleteIncomeReceipt);

export default router;