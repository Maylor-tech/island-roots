"use client";

import { useState, useEffect } from 'react';
import Auth from '../components/Auth';
import OrderManagement from '../components/OrderManagement';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication on load
    const auth = localStorage.getItem('islandRootsAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('islandRootsAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">Island Roots Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <OrderManagement />
      </main>
    </div>
  );
} 