import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type Expense = {
  id: number;
  amount: number;
  category_id: number;
  date: string;
};

type Category = {
  id: number;
  name: string;
};

export default function PieChart() {
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
          weight: 'bold' as const,
          size: 12,
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
  <div className="relative max-w-6xl mx-auto mt-20 px-4 md:px-8">
  {/* Fond décoratif */}
  <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
    <svg viewBox="0 0 200 200" className="w-full h-full animate-pulse" preserveAspectRatio="xMidYMid slice">
      <path fill="#facc15" d="M43.4,-67.3C56.6,-58.6,67.3,-47.2,72.1,-33.9C76.9,-20.6,75.9,-5.3,72.5,9.9C69.1,25.1,63.3,40.2,52.3,50.9C41.3,61.6,25.1,67.9,8.2,66.7C-8.7,65.5,-17.4,56.9,-29.3,50.1C-41.2,43.3,-56.2,38.3,-63.9,28.1C-71.6,17.9,-72.1,2.6,-69.3,-12.3C-66.5,-27.2,-60.4,-41.7,-49.8,-51.7C-39.2,-61.7,-24.1,-67.2,-8.1,-61.9C7.9,-56.6,15.8,-40.5,43.4,-67.3Z" transform="translate(100 100)" />
    </svg>
  </div>

  {/* Titre */}
  <div className="text-center mb-10">
    <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 dark:text-yellow-400 tracking-tight">
      🥧 Répartition des dépenses
    </h1>
    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
      Visualisez comment vos dépenses sont réparties selon les catégories enregistrées.
    </p>
  </div>

  {/* Résumé */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
    <SummaryCard label="Total des dépenses" value={`${total.toLocaleString('fr-FR')} Ar`} />
    <SummaryCard label="Catégories utilisées" value={labels.length.toString()} />
    <SummaryCard label="Catégorie dominante" value={labels[values.indexOf(Math.max(...values))] || '—'} />
    <SummaryCard label="Dernière mise à jour" value={new Date().toLocaleDateString('fr-FR')} />
  </div>

  {/* Graphique */}
  <div className="bg-white dark:bg-black p-6 rounded-xl shadow-lg border border-yellow-300">
    <div className="max-w-md mx-auto">
      <Pie data={data} options={options} />
    </div>
  </div>

  {/* Légende */}
  <div className="mt-8 text-sm text-gray-600 dark:text-gray-400 text-center">
    Chaque segment représente une catégorie. Passez la souris pour voir les montants exacts.
  </div>
</div>
);
function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-black p-4 rounded-xl shadow border border-yellow-300 hover:shadow-md transition-all duration-300">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-lg font-bold text-black dark:text-yellow-400 mt-1">{value}</div>
    </div>
  );
}


}
