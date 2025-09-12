import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/DashBoard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
    </Routes>
  );
}
