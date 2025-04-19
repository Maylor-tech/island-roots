"use client";

import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

const mockOrders = [
  {
    id: 1,
    name: "John Doe",
    product: "Beet Vibes Juice",
    quantity: 2,
    date: "2024-03-15",
    status: "Pending"
  },
  {
    id: 2,
    name: "Jane Smith",
    product: "Golden Glow Juice",
    quantity: 1,
    date: "2024-03-15",
    status: "Completed"
  },
  {
    id: 3,
    name: "Mike Johnson",
    product: "Sorrel Splash",
    quantity: 3,
    date: "2024-03-14",
    status: "Pending"
  }
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({ product: "", status: "" });

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("islandRootsOrders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(mockOrders);
      localStorage.setItem("islandRootsOrders", JSON.stringify(mockOrders));
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("islandRootsOrders", JSON.stringify(orders));
  }, [orders]);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  const filteredOrders = orders.filter(order => {
    const matchesProduct = !filter.product || order.product === filter.product;
    const matchesStatus = !filter.status || order.status === filter.status;
    return matchesProduct && matchesStatus;
  });

  const csvData = filteredOrders.map(order => ({
    Name: order.name,
    Product: order.product,
    Quantity: order.quantity,
    Date: order.date,
    Status: order.status
  }));

  const uniqueProducts = [...new Set(orders.map(order => order.product))];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">📋 Order Management</h1>
          <div className="space-x-4">
            <CSVLink 
              data={csvData} 
              filename="island-roots-orders.csv"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </CSVLink>
            <button
              onClick={() => {
                setOrders(mockOrders);
                localStorage.setItem("islandRootsOrders", JSON.stringify(mockOrders));
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset Orders
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Product
              </label>
              <select
                value={filter.product}
                onChange={(e) => setFilter({ ...filter, product: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">All Products</option>
                {uniqueProducts.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`rounded-lg p-1 text-sm ${
                          order.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Future Integration Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Future Integration: This dashboard can be connected to Google Sheets or Supabase for persistent storage.
          </p>
        </div>
      </div>
    </div>
  );
} 