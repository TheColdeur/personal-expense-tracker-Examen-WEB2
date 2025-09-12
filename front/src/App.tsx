import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/NavBar';
import Sidebar from './components/layout/SideBar';
import Dashboard from './components/dashboard/DashBoard';
import ExpensesPage from './components/expenses/ExpensesPages';
import ExpensesFormPage from './components/expenses/ExpenseFormPage';

function App() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="ml-72 mt-32 p-6">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/ajouter" element={<ExpensesFormPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
