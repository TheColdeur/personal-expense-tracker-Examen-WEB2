import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { 
    uploadIncomeReceipt, 
    downloadIncomeReceipt, 
    deleteIncomeReceipt 
} from "../controllers/incomeReceiptController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/:idRevenue/upload", authentication, upload.single('receipt'), uploadIncomeReceipt);

router.get("/:idRevenue/download", authentication, downloadIncomeReceipt);

router.delete("/:idRevenue/receipt", authentication, deleteIncomeReceipt);

export default router;