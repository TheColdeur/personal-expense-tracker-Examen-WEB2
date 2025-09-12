// components/layout/MainLayout.tsx
import React from 'react';
import Navbar from './NavBar';
import Sidebar from './SideBar';

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="bg-gray-100 min-h-screen text-black font-inter">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
