import { useEffect, useState } from 'react';
import axios from 'axios';
import type { TooltipItem } from 'chart.js';

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
  category_id: number;
  date: string;
};

type Category = {
  id: number;
  name: string;
};

export default function BarChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error('Erreur chargement dépenses :', err));

    axios.get('http://localhost:4000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Erreur chargement catégories :', err));
  }, []);

  // 🔁 Regrouper les montants par nom de catégorie
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    const name = categories.find(cat => cat.id === e.category_id)?.name || 'Sans catégorie';
    categoryTotals[name] = (categoryTotals[name] || 0) + Number(e.amount);
  });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);
  const total = dataValues.reduce((sum, val) => sum + val, 0);
  const dominantCategory = labels[dataValues.indexOf(Math.max(...dataValues))] || '—';

  const data = {
    labels,
    datasets: [
      {
        label: 'Total par catégorie (Ar)',
        data: dataValues,
        backgroundColor: [
          'rgba(250, 204, 21, 0.8)',
          'rgba(96, 165, 250, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(167, 139, 250, 0.8)',
        ],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) => {
            const value = ctx.raw as number;
            return `${value.toLocaleString('fr-FR')} Ar`;
            }
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#000',
          font: { family: 'Poppins', size: 12 },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#000',
          font: { family: 'Poppins', size: 12 },
        },
        grid: { color: '#f3f3f3' },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto mt-0 px-4 md:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-semibold text-yellow-500 dark:text-yellow-400 tracking-tight">
          📊 Dépenses par catégorie
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Visualisation comparative des montants dépensés selon chaque catégorie.
        </p>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <SummaryCard label="Total des dépenses" value={`${total.toLocaleString('fr-FR')} Ar`} />
        <SummaryCard label="Transactions" value={expenses.length.toString()} />
        <SummaryCard label="Catégorie dominante" value={dominantCategory} />
        <SummaryCard label="Mis à jour le" value={new Date().toLocaleDateString('fr-FR')} />
      </div>

      {/* BarChart */}
      <div className="bg-gradient-to-br from-white via-yellow-50 to-white dark:from-black dark:via-yellow-950 dark:to-black p-6 rounded-3xl shadow-xl border border-yellow-200 dark:border-yellow-500 transition-all duration-300">
        <Bar data={data} options={options} />
      </div>

      {/* Légende subtile */}
      <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        Chaque barre représente une catégorie. Survolez pour voir les montants exacts.
      </div>
    </div>
  );
}

// ✅ Carte de résumé
function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-black p-4 rounded-xl shadow border border-yellow-300 hover:shadow-md transition-all duration-300">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-lg font-bold text-black dark:text-yellow-400 mt-1">{value}</div>
    </div>
  );
}
