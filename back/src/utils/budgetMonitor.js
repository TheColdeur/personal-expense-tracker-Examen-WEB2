const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBudget(userId, month, year) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const incomes = await prisma.income.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);


    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        OR: [
          {
            type: 'one-time',
            date: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            type: 'recurring',
            OR: [
              {
                startDate: { lte: endDate },
                endDate: { gte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: null
              }
            ]
          }
        ]
      }
    });

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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

}catch (error) {
    console.error('Budget check error:', error);
    throw error;
  }
}

module.exports = { checkBudget };