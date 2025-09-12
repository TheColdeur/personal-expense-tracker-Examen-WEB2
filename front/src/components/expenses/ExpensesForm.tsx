import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Listbox } from '@headlessui/react';
import type { Expense } from './Expenses';
import CategoryManager from '../categories/CategoryManagement';

interface ExpenseFormProps {
  onAdd: (expense: Expense) => void;
}

type Category = {
  id: number;
  name: string;
};

export default function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [form, setForm] = useState<{
    title: string;
    amount: string;
    category: number | '';
    type: 'one-time' | 'recurring';
    date: string;
    start_date: string;
    end_date: string;
    description: string;
    receipt: File | null;
  }>({
    title: '',
    amount: '',
    category: '',
    type: 'one-time',
    date: '',
    start_date: '',
    end_date: '',
    description: '',
    receipt: null
  });

  const [showCategoryManager, setShowCategoryManager] = useState<boolean>(false);


  const [categories, setCategories] = useState<Category[]>([]);
  const [, setErrors] = useState({
    title: false,
    amount: false,
    category: false,
    date: false,
    start_date: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showCheck, setShowCheck] = useState(false);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleCategoryChange = (value: number) => {
    setForm(prev => ({ ...prev, category: value }));
    setErrors(prev => ({ ...prev, category: false }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, receipt: file }));
  };

  const handleReset = () => {
    setForm({
      title: '',
      amount: '',
      category: '',
      type: 'one-time',
      date: '',
      start_date: '',
      end_date: '',
      description: '',
      receipt: null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: form.title.trim() === '',
      amount: form.amount.trim() === '',
      category: form.category === '',
      date: form.type === 'one-time' ? form.date.trim() === '' : false,
      start_date: form.type === 'recurring' ? form.start_date.trim() === '' : false
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('amount', form.amount);
      formData.append('category', String(form.category));
      formData.append('type', form.type);
      formData.append('description', form.description);
      if (form.receipt) formData.append('receipt', form.receipt);
      if (form.type === 'one-time') {
        formData.append('date', form.date);
      } else {
        formData.append('start_date', form.start_date);
        if (form.end_date) formData.append('end_date', form.end_date);
      }

      const res = await axios.post('http://localhost:4000/api/expenses', formData);
      onAdd(res.data);
      handleReset();
      setShowCheck(true);
      setShowToast(true);
      setTimeout(() => setShowCheck(false), 1500);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Erreur lors de l’ajout :', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Erreur chargement catégories :', err);
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  className="bg-white p-8 rounded-3xl shadow-xl border border-yellow-300 max-w-full animate-fade-in-up transition-all duration-500"
>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Titre */}
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-2 block">Titre</label>
      <input
        name="title"
        type="text"
        value={form.title}
        onChange={handleChange}
        placeholder="Ex: Spotify"
        className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md"
      />
    </div>

    {/* Montant */}
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-2 block">Montant</label>
      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="Ex: 9.99"
        className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md"
      />
    </div>

    {/* Type */}
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-2 block">Type</label>
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <option value="one-time">Ponctuelle</option>
        <option value="recurring">Récurrente</option>
      </select>
    </div>

    {/* Catégorie */}
    <div className="col-span-1 md:col-span-2 lg:col-span-1">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">Catégorie</label>
      <Listbox value={form.category} onChange={handleCategoryChange}>
        <div className="relative">
          <Listbox.Button className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md">
            {form.category
              ? categories.find(c => c.id === form.category)?.name
              : 'Choisir une catégorie'}
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full bg-white rounded-xl shadow-lg z-10 border border-yellow-300 text-sm transition-opacity duration-200">
            {categories.map(cat => (
              <Listbox.Option
                key={cat.id}
                value={cat.id}
                className="px-4 py-2 cursor-pointer hover:bg-yellow-100 hover:scale-[1.02] transition-all duration-200"
              >
                {cat.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      <button
        type="button"
        onClick={() => setShowCategoryManager(true)}
        className="mt-3 text-xs text-white bg-black hover:bg-yellow-400 hover:text-black font-bold py-1.5 px-4 rounded-full transition-all duration-300 shadow-md active:scale-95"
      >
        Gérer les catégories
      </button>
    </div>

    {/* Dates */}
    {form.type === 'one-time' ? (
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Date</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md"
        />
      </div>
    ) : (
      <>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Début</label>
          <input
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Fin (optionnelle)</label>
          <input
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>
      </>
    )}

    {/* Description */}
    <div className="col-span-1 md:col-span-2 lg:col-span-3">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Notes, détails, etc."
        className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm resize-none placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md"
      />
    </div>

    {/* Reçu */}
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-2 block">Reçu</label>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100 transition-all duration-300 shadow-sm file:font-semibold file:bg-yellow-400 file:text-black file:rounded-full file:px-4 file:py-2 file:transition file:duration-300 hover:file:bg-yellow-500"
      />
    </div>
  </div>

  {/* Boutons */}
  <div className="mt-8 flex flex-col md:flex-row gap-4">
    <button
      type="submit"
      disabled={isSubmitting}
      className={`flex-1 font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg active:scale-95 ${
        isSubmitting
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
          : 'bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black'
      }`}
    >
      {isSubmitting ? 'Ajout en cours...' : 'Ajouter la dépense'}
    </button>
    <button
      type="button"
      onClick={handleReset}
      className="flex-1 bg-yellow-400 text-black font-bold py-3 px-6 rounded-full hover:bg-black hover:text-yellow-400 active:scale-95 transition-all duration-300 shadow-md"
    >
      Réinitialiser
    </button>
  </div>

  {/* Modale & Toast */}
  {showCategoryManager && (
    <CategoryManager onClose={() => setShowCategoryManager(false)} />
  )}
  {showToast && (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-yellow-400 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-fade-in-up"
    >
      {showCheck ? (
        <span className="text-2xl">✅</span>
      ) : (
        <span className="loader border-t-yellow-400 animate-pulse"></span>
      )}
      <span className="font-medium">
        {showCheck ? 'Dépense ajoutée !' : 'Ajout en cours...'}
      </span>
    </div>
  )}
</form>
  );
}
