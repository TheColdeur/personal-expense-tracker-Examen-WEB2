import React, { useEffect, useState } from 'react';
import { FiBell, FiUser } from 'react-icons/fi';
import { BsSun, BsMoon } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import './layout.css';
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
    <header className="bg-yellow-400 dark:bg-black h-[100px] text-black dark:text-yellow-400 px-6 py-4 shadow-md relative z-50 font-poppins flex items-center justify-between animate-fade-in">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 group">
        <img
          src={cashflowLogo}
          alt="CashFlow Logo"
          className="w-52 h-48 transition-transform duration-300 group-hover:scale-110"
        />
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="relative group">
          <FiBell size={20} className="transition-transform duration-300 group-hover:scale-125" />
          <span className="absolute -top-1 -right-2 bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black text-xs px-1 rounded-full">3</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-black hover:text-yellow-400 transition ease-in"
        >
          {theme === 'light' ? (
            <BsMoon size={25} className="text-black " />
          ) : (
            <BsSun size={25} className="text-black" />
          )}
        </button>

        <Link to="/profile" className="flex items-center gap-2 group hover:bg-black rounded-3xl hover:text-yellow-400 transition ease-in p-3">
          <FiUser size={25} className="transition-transform duration-300 group-hover:scale-110" />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
