// components/RevenuesPage.tsx
import React from 'react';
import RevenueForm from './RevenueForm'; // <-- corrigé : RevenueForm est dans le même dossier
import type { Income } from './types';    // <-- types.ts est dans le même dossier
import { getIncomes, createIncome, deleteIncome, updateIncome } from '../services/incomeService'; // <-- services un niveau au-dessus

export default function RevenuesPage() {
  const [revenues, setRevenues] = React.useState<Income[]>([]);
  const [editingRevenue, setEditingRevenue] = React.useState<Income | null>(null);

  const fetchRevenues = async () => {
    try {
      const res = await getIncomes();
      setRevenues(res.data.revenues || []);
    } catch (err) {
      console.error('Impossible de charger les revenus', err);
    }
  };

  React.useEffect(() => {
    fetchRevenues();
  }, []);

  const handleAddRevenue = async (revenueData: Omit<Income, 'id' | 'create_at'>) => {
    try {
      const res = await createIncome(revenueData);
      // Ajoute le revenu créé dans la liste
      setRevenues(prev => [...prev, res.data.revenue]);
    } catch (err) {
      console.error('Erreur lors de l’ajout', err);
    }
  };

  const handleDeleteRevenue = async (id: number) => {
    try {
      await deleteIncome(id);
      setRevenues(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression', err);
    }
  };

  const handleUpdateRevenue = async (id: number, revenueData: Omit<Income, 'id' | 'create_at'>) => {
    try {
      const res = await updateIncome(id, revenueData);
      setRevenues(prev => prev.map(r => (r.id === id ? res.data.revenue : r)));
      setEditingRevenue(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour', err);
    }
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Liste des revenus */}
      <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {revenues.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-black">{r.source}</p>
                <p className="text-sm text-gray-500">{Number(r.amount).toLocaleString('fr-FR')} Ar</p>
                <p className="text-xs text-gray-400 mt-1">📅 {new Date(r.date).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditingRevenue(r)} className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition">
                Modifier
              </button>
              <button onClick={() => handleDeleteRevenue(r.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire de création / modification */}
      <div className="w-1/3">
        <h2 className="text-xl font-bold mb-4">{editingRevenue ? 'Modifier Revenu' : 'Ajouter un Revenu'}</h2>
        <RevenueForm
          revenue={editingRevenue}
          onSubmit={(data) => {
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
  );
}
