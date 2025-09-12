// PieChart.tsx
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

type Expense = {
  id: number;
  amount: number;
  category: string;
};

export default function PieChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error('Erreur chargement dépenses :', err));
  }, []);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ['#facc15', '#60a5fa', '#34d399', '#f472b6', '#a78bfa'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-yellow-500 mb-6">Répartition par catégorie</h2>
      <Pie data={data} />
    </div>
  );
}
