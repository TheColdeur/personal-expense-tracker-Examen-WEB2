import React, { useEffect, useState } from 'react';
import { FiBell, FiUser } from 'react-icons/fi';
import { BsSun, BsMoon } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import cashflowLogo from '../../assets/Cashflow-Logo.png';

const Navbar = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[80px] bg-yellow-400 dark:bg-black text-black dark:text-yellow-400 px-6 shadow-md z-50 font-poppins flex items-center justify-between backdrop-blur-md transition-all duration-300">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 group">
        <img
          src={cashflowLogo}
          alt="CashFlow Logo"
          className="w-32 h-auto transition-transform duration-300 group-hover:scale-105"
        />
        <span className="text-xl font-bold tracking-wide group-hover:underline">CashFlow</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative group p-2 rounded-full hover:bg-black hover:text-yellow-400 transition"
        >
          <FiBell size={22} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="absolute -top-1 -right-2 bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black text-xs px-1 rounded-full animate-pulse">
            3
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-full hover:bg-black hover:text-yellow-400 transition"
        >
          {theme === 'light' ? (
            <BsMoon size={22} />
          ) : (
            <BsSun size={22} />
          )}
        </button>

        {/* Profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2 group p-2 rounded-full hover:bg-black hover:text-yellow-400 transition"
        >
          <FiUser size={22} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden md:inline text-sm font-medium">Profil</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
