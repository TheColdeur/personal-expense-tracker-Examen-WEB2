import React from 'react';

export default function UserSetting() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50 pt-24 transition-all duration-500">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight transition-colors duration-300 hover:text-yellow-500">
          Paramètres Utilisateur
        </h1>

        <form className="grid gap-6">
          {/* Nom */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-1 group-hover:text-yellow-600 transition-colors duration-300">
              Nom complet
            </label>
            <input
              type="text"
              placeholder="Novah Anusha"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-1 group-hover:text-yellow-600 transition-colors duration-300">
              Adresse email
            </label>
            <input
              type="email"
              placeholder="novah@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            />
          </div>

          {/* Mot de passe */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-1 group-hover:text-yellow-600 transition-colors duration-300">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
