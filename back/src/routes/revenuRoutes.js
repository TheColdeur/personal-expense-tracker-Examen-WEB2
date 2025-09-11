import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { 
    createRevenue, 
    deleteRevenue, 
    getRevenues, 
    getRevenueById, 
    updateRevenue,
    getRevenueStats 
} from "../controllers/revenueController.js";

const router = express.Router();

router.get("/", authentication, getRevenues);

router.get("/stats", authentication, getRevenueStats);

router.get("/:id", authentication, getRevenueById);

router.post("/", authentication, createRevenue);

router.put("/:id", authentication, updateRevenue);

router.delete("/:id", authentication, deleteRevenue);

export default router;