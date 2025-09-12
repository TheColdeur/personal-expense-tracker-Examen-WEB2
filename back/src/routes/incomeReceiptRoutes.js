import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { 
    uploadRevenueReceipt, 
    downloadRevenueReceipt, 
    deleteRevenueReceipt 
} from "../controllers/incomeReceiptController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/:idRevenue/upload", authentication, upload.single('receipt'), uploadRevenueReceipt);

router.get("/:idRevenue/download", authentication, downloadRevenueReceipt);

router.delete("/:idRevenue/receipt", authentication, deleteRevenueReceipt);

export default router;