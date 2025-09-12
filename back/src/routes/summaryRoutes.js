import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { checkBudget } from "../utils/budgetMonitor.js";

const router = express.Router();

router.get("/monthly", authentication, async (req, res) => {
  try {
    const { month } = req.query;
    const currentDate = month ? new Date(month) : new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const budgetStatus = await checkBudget(req.user, currentMonth, currentYear);
    res.status(200).json(budgetStatus);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/alerts", authentication, async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const budgetStatus = await checkBudget(req.user, currentMonth, currentYear);
    
    if (budgetStatus.exceeded) {
      res.status(200).json({
        alert: true,
        message: `You've exceeded your budget for this month by $${budgetStatus.amount.toFixed(2)}`,
        amount: budgetStatus.amount
      });
    } else {
      res.status(200).json({
        alert: false,
        message: 'Your budget is on track',
        amount: 0
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;