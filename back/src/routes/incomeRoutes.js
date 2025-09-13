import express from "express";
import { 
    createRevenue,
    deleteRevenue,
    getRevenues,
    getRevenueById,
    updateRevenue,
    getRevenueStats
} from "../controllers/incomeController.js";

const router = express.Router();

router.get("/", getRevenues);
router.get("/stats", getRevenueStats);
router.get("/:id", getRevenueById);
router.post("/", createRevenue);
router.put("/:id", updateRevenue);
router.delete("/:id", deleteRevenue);

export default router;