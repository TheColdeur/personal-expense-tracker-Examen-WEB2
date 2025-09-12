import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
};

export default function BarChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error('Erreur chargement dépenses :', err));
  }, []);

  // 🔍 Regrouper les montants par catégorie
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    const cat = e.category || 'Sans catégorie';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
  });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total par catégorie (Ar)',
        data: dataValues,
        backgroundColor: '#facc15',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#000',
          font: { family: 'Poppins', size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Dépenses par catégorie',
        color: '#000',
        font: { family: 'Poppins', size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#000' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#000' },
        grid: { color: '#f3f3f3' },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-white p-6 rounded-xl shadow-md border border-yellow-300">
      <Bar data={data} options={options} />
    </div>
  );
}
