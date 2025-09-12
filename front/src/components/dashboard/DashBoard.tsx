import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { Expense } from '../expenses/Expenses';

type Category = {
  id: number;
  name: string;
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/api/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error('Erreur chargement dépenses :', err));

    axios.get('http://localhost:4000/api/categories')
      .then(res => setCategories(res.data as Category[]))
      .catch(err => console.error('Erreur chargement catégories :', err));
  }, []);

  const filtered = expenses.filter(e => {
    const matchCategory = categoryFilter ? e.category === categoryFilter : true;
    const matchDate = dateFilter ? e.date.startsWith(dateFilter) : true;
    return matchCategory && matchDate;
  });

  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);
  const average = filtered.length ? total / filtered.length : 0;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTotal = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="relative min-h-screen bg-white px-6 py-10 overflow-hidden z-10">
      {/* Fond SVG animé */}
      <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-pulse transition-transform duration-700 ease-in-out" preserveAspectRatio="xMidYMid slice" id="svgFond">
          <path fill="#facc15" d="M43.4,-67.3C56.6,-58.6,67.3,-47.2,72.1,-33.9C76.9,-20.6,75.9,-5.3,72.5,9.9C69.1,25.1,63.3,40.2,52.3,50.9C41.3,61.6,25.1,67.9,8.2,66.7C-8.7,65.5,-17.4,56.9,-29.3,50.1C-41.2,43.3,-56.2,38.3,-63.9,28.1C-71.6,17.9,-72.1,2.6,-69.3,-12.3C-66.5,-27.2,-60.4,-41.7,-49.8,-51.7C-39.2,-61.7,-24.1,-67.2,-8.1,-61.9C7.9,-56.6,15.8,-40.5,43.4,-67.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Header */}
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-6xl text-yellow-500 font-semibold tracking-tight">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Suivi clair de vos dépenses et catégories</p>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
        <StatCard icon="💰" label="Total filtré" value={`${total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar`} />
        <StatCard icon="📅" label="Ce mois" value={`${monthTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar`} />
        <StatCard icon="📦" label="Dépenses" value={filtered.length.toString()} />
        <StatCard icon="⚖️" label="Moyenne" value={`${average.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar`} />
      </div>

      {/* Filtres + Boutons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-8 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-300">
          <h2 className="text-xl font-bold text-black mb-4">🔍 Filtres</h2>
          <div className="flex flex-col gap-4">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-yellow-300 rounded-xl px-4 py-2 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <input
              type="month"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="border border-yellow-300 rounded-xl px-4 py-2 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {(categoryFilter || dateFilter) && (
            <p className="mt-4 text-sm text-gray-600">
              🎯 {filtered.length} dépenses trouvées pour <span className="font-semibold">{categoryFilter || 'toutes catégories'}</span> en <span className="font-semibold">{dateFilter || 'toutes périodes'}</span>
            </p>
          )}
        </div>
                {/* Boutons */}
        <div className="flex flex-col md:flex-row gap-4 justify-end items-start md:items-center">
          <Link
            to="/piechart"
            className="bg-black text-white font-semibold p-6 rounded-full hover:bg-gray-900 hover:text-yellow-400 transition-all duration-300 shadow-md hover:shadow-yellow-500/50"
          >
            🥧 Voir le camembert
          </Link>
          <Link
            to="/barchart"
            className="bg-black text-white font-semibold p-6 rounded-full hover:bg-gray-900 hover:text-yellow-400 transition-all duration-300 shadow-md hover:shadow-yellow-500/50"
          >
            📊 Voir le graphique en barres
          </Link>
        </div>
      </div>

      {/* Liste filtrée */}
      <div className="space-y-4 animate-fade-in-up">
        {filtered.map(e => (
          <div key={e.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-black">{e.title}</p>
                <p className="text-sm text-gray-500">{Number(e.amount).toLocaleString('fr-FR')} Ar</p>
                <p className="text-xs text-gray-400 mt-1">📅 {new Date(e.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-bold rounded-full shadow-sm">
                {e.category || 'Sans catégorie'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

// ✅ Carte de résumé
function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center hover:shadow-md transition-all duration-300">
      <div className="text-2xl">{icon}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
      <div className="text-lg font-bold text-black mt-1">{value}</div>
    </div>
  );
}

