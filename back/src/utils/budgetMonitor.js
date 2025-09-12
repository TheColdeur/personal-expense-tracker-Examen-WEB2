import { pool } from "../config/db.js";

async function checkBudget(userId, month, year) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const incomeResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_income 
       FROM incomes 
       WHERE "usersId" = $1 AND date BETWEEN $2 AND $3`,
      [userId, startDateStr, endDateStr]
    );
    
    const totalIncome = parseFloat(incomeResult.rows[0].total_income);
    
    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_expenses
       FROM expenses 
       WHERE "userId" = $1 AND (
         (type = 'one-time' AND date BETWEEN $2 AND $3) OR
         (type = 'recurring' AND (
           (start_date <= $3 AND (end_date IS NULL OR end_date >= $2)) OR
           (start_date <= $3 AND end_date IS NULL)
         ))
       )`,
      [userId, startDateStr, endDateStr]
    );
    
    const totalExpenses = parseFloat(expenseResult.rows[0].total_expenses);
    
    if (totalExpenses > totalIncome) {
      return {
        exceeded: true,
        amount: totalExpenses - totalIncome,
        totalIncome,
        totalExpenses
      };
    }
    
    return {
      exceeded: false,
      amount: 0,
      totalIncome,
      totalExpenses
    };
  } catch (error) {
    console.error('Erreur de vérification du budget:', error);
    throw error;
  }
}

export { checkBudget };