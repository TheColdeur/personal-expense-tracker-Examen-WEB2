import React from 'react';
import ExpenseForm from './ExpensesForm';
import visuelDecoratif from '../../assets/Ajouter-Icon.png';

export default function ExpenseSection() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 items-center max-w-[1100px] w-full">
        {/* Formulaire à gauche */}
        <div>
          <ExpenseForm onAdd={(expense) => console.log('Ajouté:', expense)} />
        </div>

        {/* Visuel décoratif animé à droite */}
        <div className="flex justify-center items-center">
          <div className="rounded-xl p-6 animate-fade-in-up">
            <img
              src={visuelDecoratif}
              alt="Visuel décoratif animé"
              className="w-full max-w-sm object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>

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
