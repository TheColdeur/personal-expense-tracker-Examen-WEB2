import React from 'react';
import type { Expense } from './Expenses';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <p className="text-gray-500 mt-4">Aucune dépense enregistrée.</p>;
  }

  return (
    <ul className="mt-6 space-y-3">
      {expenses.map((exp) => (
        <li
          key={exp.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-black">{exp.title}</p>
            <p className="text-sm text-gray-500">
              {exp.category} — {exp.amount} Ar
            </p>
          </div>
          <button
            onClick={() => onDelete(exp.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}
