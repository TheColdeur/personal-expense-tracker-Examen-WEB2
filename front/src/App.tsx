import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/SideBar';
import RevenuesPage from './components/income/RevenuesPage';
// Si tu as d'autres pages, importe-les aussi
import ExpensesPage from './components/expenses/ExpensesPages';
import DashboardPage from './components/dashboard/DashBoard';

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/revenues" element={<RevenuesPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            {/* Ajouter d'autres routes si nécessaire */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
