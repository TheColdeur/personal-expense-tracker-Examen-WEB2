import React from 'react';
import ExpenseForm from './ExpensesForm';
import { useNavigate } from 'react-router-dom';
import visuelDecoratif from '../../assets/Ajouter-Icon.png';

export default function ExpensesFormPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white px-6 py-10 flex items-center justify-center overflow-hidden">
      {/* Fond SVG animé */}
      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-pulse">
          <path fill="#facc15" d="M43.4,-67.3C56.6,-58.6,67.3,-47.2,72.1,-33.9C76.9,-20.6,75.9,-5.3,72.5,9.9C69.1,25.1,63.3,40.2,52.3,50.9C41.3,61.6,25.1,67.9,8.2,66.7C-8.7,65.5,-17.4,56.9,-29.3,50.1C-41.2,43.3,-56.2,38.3,-63.9,28.1C-71.6,17.9,-72.1,2.6,-69.3,-12.3C-66.5,-27.2,-60.4,-41.7,-49.8,-51.7C-39.2,-61.7,-24.1,-67.2,-8.1,-61.9C7.9,-56.6,15.8,-40.5,43.4,-67.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 items-center max-w-[1100px] w-full animate-fade-in-up">
        {/* Colonne gauche : Formulaire */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-yellow-500 mb-6 tracking-tight animate-slide-in-left">
            Ajouter une dépense
          </h2>
          <ExpenseForm onAdd={() => navigate('/')} />
        </div>

        {/* Colonne droite : Visuel décoratif */}
        <div className="flex justify-center items-center h-full animate-slide-in-right">
          <img
            src={visuelDecoratif}
            alt="Visuel décoratif"
            className="w-full max-w-[500px] object-contain transition-transform duration-500 hover:scale-105 drop-shadow-xl"
          />
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

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }

          .animate-slide-in-left {
            animation: slide-in-left 0.6s ease-out forwards;
          }

          .animate-slide-in-right {
            animation: slide-in-right 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
