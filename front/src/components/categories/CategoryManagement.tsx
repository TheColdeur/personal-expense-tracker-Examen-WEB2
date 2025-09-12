import { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

interface Props {
  onClose: () => void;
}

export default function CategoryManager({ onClose }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
  setIsClosing(true);
  setTimeout(() => {
    onClose(); // retire le composant après l’animation
    setIsClosing(false); // reset pour la prochaine ouverture
  }, 300); // durée de l’animation
};

  useEffect(() => {
    axios.get<Category[]>('http://localhost:4000/api/categories')
      .then(res => setCategories(res.data));
  }, []);

  const refresh = async () => {
    const res = await axios.get<Category[]>('http://localhost:4000/api/categories');
    setCategories(res.data);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await axios.post('http://localhost:4000/api/categories', { name: newName });
    setNewName('');
    refresh();
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/categories/${id}`);
      refresh();
    } catch (err) {
      console.error('Erreur suppression catégorie:', err);
      alert('Impossible de supprimer cette catégorie. Elle est peut-être utilisée dans une dépense.');
    }
  };

  const handleEdit = async () => {
    if (!editingName.trim() || editingId === null) return;
    await axios.put(`http://localhost:4000/api/categories/${editingId}`, { name: editingName });
    setEditingId(null);
    setEditingName('');
    refresh();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md transition-all duration-300 ${
        isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
      <div className="bg-white/80 backdrop-blur-md border border-yellow-300 shadow-2xl rounded-3xl p-6 w-[90%] max-w-md mx-4 animate-fade-in-up transition-all duration-500">
        <h2 className="text-xl font-bold text-yellow-500 mb-6 text-center">🎯 Gérer les catégories</h2>

        {/* Ajouter */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nouvelle catégorie"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ring-offset-1 transition-all duration-300 shadow-sm"
          />
          <button
            onClick={handleAdd}
            className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-500 active:scale-95 transition-all duration-300 shadow-md"
          >
            ➕ Ajouter
          </button>
        </div>

        {/* Liste */}
        <ul className="space-y-3">
          {categories.map(cat => (
            <li key={cat.id} className="flex justify-between items-center bg-white/90 border border-gray-200 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300">
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 transition"
                  />
                  <div className="flex gap-2 ml-2">
                    <button onClick={handleEdit} className="text-green-600 text-sm hover:text-green-700 transition">✔</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm hover:text-gray-700 transition">✖</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                      className="text-blue-500 hover:text-blue-600 text-sm transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500 hover:text-red-600 text-sm transition"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={handleClose}
          className="mt-6 text-xs text-gray-500 hover:text-gray-700 hover:underline transition"
          >
          ⬅️ Fermer
        </button>

      </div>
    </div>
  );
}
