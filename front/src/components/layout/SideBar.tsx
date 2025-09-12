// components/Sidebar.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiDollarSign, FiFile, FiUser, FiMenu } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/expenses', label: 'Expenses', icon: <FiDollarSign /> },
  { to: '/revenues', label: 'Revenus', icon: <FiFile /> }, // Revenus avec icône sûre
  { to: '/profile', label: 'Profil', icon: <FiUser /> },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Bouton toggle pour mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-yellow-400 text-black p-2 rounded-full shadow-lg"
      >
        <FiMenu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-[500px] mt-32 ml-5 rounded-xl w-64 bg-black text-white p-6 font-inter shadow-xl transform transition-transform duration-500 ease-in-out z-40 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-4 mt-10">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 ${
                  isActive
                    ? 'bg-yellow-400 text-black font-semibold shadow-inner border-l-4 border-white'
                    : 'text-yellow-400 hover:bg-yellow-500 hover:text-black'
                }`
              }
            >
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                {icon}
              </span>
              <span className="relative text-base tracking-wide">{label}</span>
            </NavLink>
          ))}
        </nav>

        <footer className="text-xs text-gray-500 mt-10">
          © 2025 CashFlow. All rights reserved.
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;
