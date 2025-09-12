import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Expense } from './Expenses';
import { Link } from 'react-router-dom';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Erreur chargement :', error);
    }
  };

  useEffect(() => {
    loadExpenses();

    const handleScroll = () => {
      const offset = window.scrollY * 0.1;
      const svg = document.getElementById('svgFond');
      if (svg) {
        svg.style.transform = `translateY(${offset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:8000/api/expenses/${id}`);
      await loadExpenses();
    } catch (error) {
      console.error('Erreur suppression :', error);
    } finally {
      setDeletingId(null);
    }
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const fondOpacity = total > 1000000 ? 'opacity-50' : 'opacity-70';

  return (
    <div className="relative min-h-screen bg-white px-6 py-10 overflow-hidden z-10">
      {/* Fond SVG */}
      <div className={`absolute inset-0 z-0 pointer-events-none ${fondOpacity}`}>
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md">
          <svg
            id="svgFond"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[80%] h-[80%] animate-pulse transition-transform duration-700 ease-in-out rounded-[3rem] shadow-2xl"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path
              fill="#facc15"
              opacity="0.2"
                d="M400,400 C500,250 700,250 800,400 C900,550 700,650 500,600 C300,550 200,450 400,400 Z"
              transform="rotate(-30 400 400)"
            />
          </svg>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-col w-full max-w-2xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 animate-slide-in-left">
          <h2 className="text-3xl font-bold text-yellow-500 tracking-tight">Mes dépenses</h2>
          <Link
            to="/ajouter"
            className="bg-yellow-400 text-black font-semibold py-2 px-6 rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-md hover:shadow-yellow-500/50"
          >
            ➕ Ajouter
          </Link>
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6 transition-all duration-300 hover:shadow-lg animate-slide-in-right">
          <h4 className="text-lg font-semibold text-yellow-500 mb-2">Résumé du mois</h4>
          <p className="text-black">
            Total : <span className="font-bold">{total.toFixed(2)} Ar</span>
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${Math.min(total / 1000, 100)}%` }}
            />
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-4">
          {expenses.map(expense => (
            <div
              key={expense.id}
              className={`flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ${
                deletingId === expense.id ? 'animate-fade-out-left opacity-0' : 'hover:shadow-lg'
              }`}
            >
              <div>
                <p className="font-semibold text-black">{expense.title}</p>
                <p className="text-sm text-gray-500">{expense.amount} Ar</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  📅 {new Date(expense.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(expense.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition-all duration-300 shadow hover:shadow-red-500/50 active:scale-95"
              >
                🗑 Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-in-left {
            0% { opacity: 0; transform: translateX(-30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes slide-in-right {
            0% { opacity: 0; transform: translateX(30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes fade-out-left {
            0% { opacity: 1; transform: translateX(0); }
            100% { opacity: 0; transform: translateX(-40px); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          .animate-slide-in-left {
            animation: slide-in-left 0.6s ease-out forwards;
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.6s ease-out forwards;
          }
          .animate-fade-out-left {
            animation: fade-out-left 0.4s ease-in forwards;
          }
        `}
      </style>
    </div>
  );
}
