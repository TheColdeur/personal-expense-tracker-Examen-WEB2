import React, { useState, useEffect } from 'react';
import type { Income, IncomeCreate } from './types';

interface RevenueFormProps {
  revenue?: Income | null;
  onSubmit: (data: IncomeCreate) => void;
  onCancel: () => void;
}

interface FormState {
  amount: number | '';
  source: string;
  description: string;
  date: string;
  receipt_upload?: string | null;
}

export default function RevenueForm({ revenue, onSubmit, onCancel }: RevenueFormProps) {
  const [form, setForm] = useState<FormState>({
    amount: revenue?.amount || '',
    source: revenue?.source || '',
    description: revenue?.description || '',
    date: revenue?.date || '',
    receipt_upload: revenue?.receipt_upload || null
  });

  useEffect(() => {
    if (revenue) {
      setForm({
        amount: revenue.amount,
        source: revenue.source,
        description: revenue.description,
        date: revenue.date,
        receipt_upload: revenue.receipt_upload || null
      });
    } else {
      setForm({ amount: '', source: '', description: '', date: '', receipt_upload: null });
    }
  }, [revenue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || form.amount <= 0) {
      alert('Montant invalide');
      return;
    }

    const submitData: IncomeCreate = {
      amount: Number(form.amount),
      source: form.source,
      description: form.description || '',
      date: form.date,
      receipt_upload: form.receipt_upload || null
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col gap-4">
      <div>
        <label>Montant</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Montant"
        />
      </div>
      <div>
        <label>Source</label>
        <input
          type="text"
          name="source"
          value={form.source}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Source"
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Description"
        />
      </div>
      <div>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
          {revenue ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {revenue && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
