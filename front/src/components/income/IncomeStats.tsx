import React, { useState, useEffect } from 'react';
import { getIncomeStats } from '../services/incomeService';
import type { IncomeStats } from './types';

const IncomeStats: React.FC = () => {
  const [stats, setStats] = useState<IncomeStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getIncomeStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Chargement des statistiques...</p>;

  return (
    <div className="p-4 border rounded shadow-md mt-4">
      <h2 className="text-lg font-bold">Statistiques des Revenus</h2>
      <p>Total: {stats.total} Ar</p>
      <ul>
        {stats.overTime.map((item) => (
          <li key={item.period}>
            {item.period}: {item.total} Ar
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeStats;
