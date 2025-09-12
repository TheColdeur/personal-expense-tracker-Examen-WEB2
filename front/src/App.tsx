// front/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/SideBar';
import RevenuesPage from './components/income/RevenuesPage';
import ExpensesPage from './components/expenses/ExpensesPages';
import DashboardPage from './components/dashboard/DashBoard';
import UserSetting from './components/userSetting/UserSetting';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 p-6 ml-0 md:ml-64">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/revenues" element={<RevenuesPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/profile" element={<UserSetting />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
