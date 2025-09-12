import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/NavBar';
import Sidebar from './components/layout/SideBar';
import Dashboard from './components/dashboard/DashBoard';
import ExpensesPage from './components/expenses/ExpensesPages';
import PieChart from './components/dashboard/PieChart';
import ExpensesFormPage from './components/expenses/ExpenseFormPage';
import BarChart from './components/dashboard/BarChar';

function App() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="ml-72 mt-32 p-6">
        <Routes>
          <Route path="/" element={<ExpensesPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/ajouter" element={<ExpensesFormPage />} />
          <Route path="/piechart" element={<PieChart />} />
          <Route path="/barchart" element={<BarChart />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
