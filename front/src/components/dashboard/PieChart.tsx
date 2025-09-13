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
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type Expense = {
  id: number;
  amount: number;
  category_id: number;
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
          'rgba(250, 204, 21, 0.8)',
          'rgba(96, 165, 250, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(167, 139, 250, 0.8)',
        ],
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 10, // ✅ bords arrondis
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#000',
          font: { family: 'Poppins', size: 13 },
          padding: 20,
        },
      },
      datalabels: {
        color: '#000',
        font: {
          weight: 'lighter' as const,
          size: 11,
        },
        padding: 6,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.7)',
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
    <div className="max-w-6xl mx-auto mt-20 px-4 md:px-8">
  <div className="flex flex-col md:flex-row items-center justify-between mb-10">
    <div>
      <h1 className="text-4xl font-bold text-yellow-500 dark:text-yellow-400 tracking-tight">
        📊 Analyse des dépenses
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
        Visualisez la répartition de vos dépenses par catégorie pour mieux comprendre vos habitudes.
      </p>
    </div>
    <Link
      to="/dashboard"
      className="mt-4 md:mt-0 bg-black text-white px-5 py-2 rounded-full hover:bg-gray-900 hover:text-yellow-400 transition-all duration-300 shadow-md"
    >
      ← Retour au tableau de bord
    </Link>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
    <SummaryCard label="Total des dépenses" value={`${total.toLocaleString('fr-FR')} Ar`} />
    <SummaryCard label="Transactions" value={expenses.length.toString()} />
    <SummaryCard label="Catégorie dominante" value={labels[values.indexOf(Math.max(...values))] || '—'} />
    <SummaryCard label="Mis à jour le" value={new Date().toLocaleDateString('fr-FR')} />
  </div>
  <div className="bg-gradient-to-br from-white via-yellow-50 to-white dark:from-black dark:via-yellow-950 dark:to-black p-6 rounded-3xl shadow-xl border border-yellow-200 dark:border-yellow-500 transition-all duration-300">
    <div className="relative max-w-sm mx-auto">
      <Pie data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-lg font-bold text-gray-700 dark:text-yellow-400">
          {total.toLocaleString('fr-FR')} Ar
        </div>
      </div>
    </div>
  </div>
  <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
    Chaque segment représente une catégorie. Survolez pour voir les détails.
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
