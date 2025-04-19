"use client";

import { useState, useEffect } from 'react';

export default function Auth({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('islandRootsAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      onAuthenticated(true);
    }
  }, [onAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'island2025') {
      setIsAuthenticated(true);
      localStorage.setItem('islandRootsAuth', 'true');
      onAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-700">Island Roots</h2>
          <p className="text-gray-600 mt-2">Admin Dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 