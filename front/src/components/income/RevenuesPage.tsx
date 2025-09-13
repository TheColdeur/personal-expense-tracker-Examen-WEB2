import React, { useEffect, useState } from 'react';
import RevenueForm from './RevenueForm';
import type { Income } from './types';
import {
  getIncomes,
  createIncome,
  deleteIncome,
  updateIncome,
} from '../services/incomeService';

export default function RevenuesPage() {
  const [revenues, setRevenues] = useState<Income[]>([]);
  const [editingRevenue, setEditingRevenue] = useState<Income | null>(null);

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      const res = await getIncomes();
      setRevenues(res.data.revenues || []);
    } catch (err) {
      console.error('❌ Impossible de charger les revenus', err);
    }
  };

  const handleAddRevenue = async (data: Omit<Income, 'id' | 'create_at'>) => {
    try {
      const res = await createIncome(data);
      setRevenues(prev => [...prev, res.data.revenue]);
    } catch (err) {
      console.error('❌ Erreur lors de l’ajout', err);
    }
  };

  const handleDeleteRevenue = async (id: number) => {
    try {
      await deleteIncome(id);
      setRevenues(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('❌ Erreur lors de la suppression', err);
    }
  };

  const handleUpdateRevenue = async (
    id: number,
    data: Omit<Income, 'id' | 'create_at'>
  ) => {
    try {
      const res = await updateIncome(id, data);
      setRevenues(prev =>
        prev.map(r => (r.id === id ? res.data.revenue : r))
      );
      setEditingRevenue(null);
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-6 transition-all duration-500">
      <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up">
        {/* Liste des revenus */}
        <div className="flex-1 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {revenues.map(r => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-yellow-300/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold text-black group-hover:text-yellow-600 transition-colors duration-300">
                    {r.source}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Number(r.amount).toLocaleString('fr-FR')} Ar
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    📅 {new Date(r.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingRevenue(r)}
                  className="px-4 py-1 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 active:scale-95 transition-all duration-300 shadow-sm"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDeleteRevenue(r.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-300 shadow-sm"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="lg:w-1/3 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
            {editingRevenue ? '✏️ Modifier Revenu' : '➕ Ajouter un Revenu'}
          </h2>
          <RevenueForm
            revenue={editingRevenue}
            onSubmit={data => {
              if (editingRevenue) {
                handleUpdateRevenue(editingRevenue.id, data);
              } else {
                handleAddRevenue(data);
              }
            }}
            onCancel={() => setEditingRevenue(null)}
          />
        </div>
      </div>

      {/* Animation */}
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
