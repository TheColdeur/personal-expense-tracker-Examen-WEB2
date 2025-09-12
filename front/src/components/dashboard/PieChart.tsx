import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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
    const cat = e.category || 'Sans catégorie';
    acc[cat] = (acc[cat] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);
  const total = values.reduce((sum, val) => sum + val, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#facc15', '#60a5fa', '#34d399', '#f472b6', '#a78bfa',
          '#fb923c', '#4ade80', '#c084fc', '#f87171', '#22d3ee',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#000',
          font: { family: 'Poppins', size: 14 },
          boxWidth: 20,
        },
      },
      datalabels: {
        color: '#000',
        formatter: (value: number) => `${((value / total) * 100).toFixed(1)}%`,
        font: {
            weight: 'bold' as const, // ou 'bolder', 'lighter', ou même un nombre comme 400
            size: 12
            },
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'pie'>) => {
            const label = ctx.label || '';
            const value = ctx.raw as number;
            return `${label}: ${value.toLocaleString('fr-FR')} Ar`;
            },
        },
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 bg-white dark:bg-black p-8 rounded-xl shadow-lg border border-yellow-300">
      <h2 className="text-3xl font-bold text-yellow-500 dark:text-yellow-400 mb-6 text-center">
        🥧 Répartition des dépenses par catégorie
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
}
