"use client";

import { useState, useEffect } from 'react';

const INITIAL_ORDERS = [
  {
    id: 1,
    name: "Test Customer",
    product: "Beet Vibes Juice",
    category: "Juices",
    quantity: 2,
    date: new Date().toLocaleDateString(),
    status: "Pending"
  }
];

const PRODUCT_CATEGORIES = {
  "Natural Juices": [
    { 
      name: "Beet Vibes Juice",
      price: 6,
      available: true,
      ingredients: "Beetroot, Carrot, Ginger, Citrus, Honey",
      benefits: "Blood Health - Energy - Detox",
      color: "Deep Red-Purple"
    },
    { 
      name: "Golden Glow Juice",
      price: 6,
      available: true,
      ingredients: "Pineapple, Turmeric, Ginger, Lime",
      benefits: "Anti-inflammatory - Immunity",
      color: "Bright Yellow"
    },
    { 
      name: "Sorrel Splash",
      price: 6,
      available: true,
      ingredients: "Sorrel (Hibiscus), Ginger, Orange Peel, Clove",
      benefits: "Antioxidants - Festive flavor",
      color: "Deep Red",
      seasonal: true
    },
    { 
      name: "Sunrise Citrus Juice",
      price: 6,
      available: true,
      ingredients: "Orange, Grapefruit, Lime, Turmeric",
      benefits: "Vitamin C - Wake Up Juice",
      color: "Orange"
    },
    { 
      name: "Coco Greens Juice",
      price: 6,
      available: true,
      ingredients: "Coconut Water, Callaloo/Kale, Pineapple, Cucumber",
      benefits: "Hydration - Green Power",
      color: "Light Green"
    },
    { 
      name: "Mint Lime Cooler",
      price: 6,
      available: true,
      ingredients: "Lime, Mint, Cane Sugar, Cucumber",
      benefits: "Hydration - Cooling - Digestion",
      color: "Pale Green"
    }
  ],
  "Pastries": [
    {
      name: "Coco Bread",
      price: 3,
      available: true,
      description: "Soft, slightly sweet bread enriched with coconut milk"
    },
    {
      name: "Banana Rum Bread",
      price: 4,
      available: true,
      description: "Moist banana bread with a touch of dark Jamaican rum"
    },
    {
      name: "Sweet Potato Pudding",
      price: 4,
      available: true,
      description: "Traditional Jamaican pudding with sweet potato and warming spices"
    },
    {
      name: "Guava Turnover",
      price: 3,
      available: true,
      description: "Flaky pastry filled with sweet guava jam"
    }
  ],
  "Special Offers": [
    {
      name: "Juice Tasting Box",
      price: 30,
      available: true,
      description: "Try All 6 Flavors (12 oz each)",
      isPackage: true
    },
    {
      name: "Pastry Tasting Box",
      price: 10,
      available: true,
      description: "Try All 4 Pastries",
      isPackage: true
    },
    {
      name: "Wellness Shot",
      price: 0,
      available: true,
      description: "Free with first 10 orders",
      isPromo: true
    }
  ],
  "Containers": [
    {
      name: "Glass Jar (16oz)",
      price: 2,
      available: true,
      isDeposit: true
    },
    {
      name: "Glass Bottle (32oz)",
      price: 3,
      available: true,
      isDeposit: true
    }
  ]
};

// Daily specials configuration
const DAILY_SPECIALS = {
  Monday: { name: "Monday Detox", discount: 2, description: "Start your week fresh! $2 off any juice" },
  Tuesday: { name: "Tasting Tuesday", discount: 5, description: "$5 off Juice Tasting Box" },
  Wednesday: { name: "Wellness Wednesday", discount: 1, description: "$1 off when adding a Wellness Shot" },
  Thursday: { name: "Thirsty Thursday", discount: 3, description: "$3 off when ordering 3+ juices" },
  Friday: { name: "Fresh Friday", discount: 2, description: "$2 off any Green juice" },
  Saturday: { name: "Sweet Saturday", discount: 2, description: "$2 off any Pastry Box" },
  Sunday: { name: "Sunday Special", discount: 4, description: "$4 off orders over $30" }
};

// Confirmation Modal Component
function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filterProduct, setFilterProduct] = useState("All Products");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wellnessShotCount, setWellnessShotCount] = useState(0);
  const [seasonalAvailability, setSeasonalAvailability] = useState({
    "Sorrel Splash": false
  });
  const [newOrder, setNewOrder] = useState({
    name: "",
    category: "",
    product: "",
    quantity: 1
  });

  const [jarDeposits, setJarDeposits] = useState({
    available: { "16oz": 20, "32oz": 15 },
    outstanding: { "16oz": 0, "32oz": 0 },
    returned: { "16oz": 0, "32oz": 0 }
  });

  const [dailySpecial, setDailySpecial] = useState(null);
  const [popularItems, setPopularItems] = useState([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('islandRootsOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
    }

    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('islandRootsOrders', JSON.stringify(orders));
  }, [orders]);

  // Load daily special on component mount
  useEffect(() => {
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    setDailySpecial(DAILY_SPECIALS[today]);
  }, []);

  // Update popular items when orders change
  useEffect(() => {
    const itemCounts = orders.reduce((acc, order) => {
      acc[order.product] = (acc[order.product] || 0) + order.quantity;
      return acc;
    }, {});

    const sorted = Object.entries(itemCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    setPopularItems(sorted);
  }, [orders]);

  // Get product details for display
  const getProductDetails = (product) => {
    for (const category of Object.values(PRODUCT_CATEGORIES)) {
      const found = category.find(p => p.name === product);
      if (found) return found;
    }
    return null;
  };

  // Calculate total value of orders
  const calculateOrderValue = (order) => {
    const product = getProductDetails(order.product);
    if (!product) return 0;
    return product.price * order.quantity;
  };

  // Format price display
  const formatPrice = (price) => {
    return price === 0 ? 'FREE' : `$${price}`;
  };

  // Get product description
  const getProductDescription = (product) => {
    const details = getProductDetails(product);
    if (!details) return '';
    
    if (details.ingredients) {
      return `${details.ingredients} - ${details.benefits}`;
    }
    return details.description || '';
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    completed: orders.filter(o => o.status === "Completed").length,
    totalQuantity: orders.reduce((sum, o) => sum + o.quantity, 0),
    totalValue: orders.reduce((sum, o) => sum + calculateOrderValue(o), 0)
  };

  // Handle seasonal availability toggle
  const toggleSeasonalAvailability = (productName) => {
    setSeasonalAvailability(prev => ({
      ...prev,
      [productName]: !prev[productName]
    }));
  };

  // Check if product is available
  const isProductAvailable = (product) => {
    if (product.seasonal) {
      return seasonalAvailability[product.name] ?? false;
    }
    return product.available;
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    const orderProduct = getProductDetails(newOrder.product);
    
    // Create the new order
    const order = {
      id: orders.length + 1,
      ...newOrder,
      date: new Date().toLocaleDateString(),
      status: "Pending",
      value: calculateOrderValue(newOrder)
    };

    // Check if eligible for wellness shot
    if (orders.length < 10 && !orders.some(o => o.name === newOrder.name)) {
      setWellnessShotCount(prev => prev + 1);
      order.includesWellnessShot = true;
    }

    setOrders([order, ...orders]);
    setNewOrder({ name: "", category: "", product: "", quantity: 1 });
  };

  const resetOrders = () => {
    setShowModal(true);
  };

  const confirmReset = () => {
    setOrders([]);
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesProduct = filterProduct === "All Products" || order.product === filterProduct;
      const matchesCategory = filterCategory === "All Categories" || order.category === filterCategory;
      const matchesStatus = filterStatus === "All" || order.status === filterStatus;
      const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.product.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesProduct && matchesCategory && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        : b[sortConfig.key] > a[sortConfig.key] ? 1 : -1;
    });

  const handleExportCSV = () => {
    // Create CSV content with headers
    const headers = ['Name', 'Product', 'Quantity', 'Date', 'Status', 'Total'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => {
        const total = calculateOrderValue(order);
        return [
          order.name,
          order.product,
          order.quantity,
          order.date,
          order.status,
          `$${total}`
        ].join(',');
      })
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `island_roots_orders_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Island Roots - Kitchen Orders</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #15803d; text-align: center; }
            .order { border-bottom: 1px solid #ddd; padding: 10px 0; }
            .total { margin-top: 20px; font-weight: bold; }
            @media print {
              body { margin: 0; padding: 15px; }
            }
          </style>
        </head>
        <body>
          <h1>Island Roots - Kitchen Orders</h1>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          ${orders
            .filter(order => order.status === 'Pending')
            .map(order => `
              <div class="order">
                <strong>${order.quantity}x ${order.product}</strong><br>
                Customer: ${order.name}
              </div>
            `).join('')}
          <div class="total">
            Total Orders: ${orders.filter(order => order.status === 'Pending').length}
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  };

  // Handle jar deposit
  const handleJarDeposit = (size, action) => {
    setJarDeposits(prev => {
      const newState = { ...prev };
      if (action === 'take') {
        newState.available[size]--;
        newState.outstanding[size]++;
      } else if (action === 'return') {
        newState.outstanding[size]--;
        newState.returned[size]++;
        newState.available[size]++;
      }
      return newState;
    });
  };

  // Calculate daily special discount
  const calculateDiscount = (order) => {
    if (!dailySpecial) return 0;
    
    const { product, quantity } = order;
    const productDetails = getProductDetails(product);
    
    switch (new Date().toLocaleString('en-us', { weekday: 'long' })) {
      case 'Thursday':
        return quantity >= 3 ? dailySpecial.discount : 0;
      case 'Friday':
        return productDetails?.name.toLowerCase().includes('green') ? dailySpecial.discount : 0;
      case 'Sunday':
        return (productDetails?.price * quantity) > 30 ? dailySpecial.discount : 0;
      default:
        return dailySpecial.discount;
    }
  };

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  return (
    <div className={`p-4 max-w-7xl mx-auto ${isDarkMode ? 'dark' : ''}`}>
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmReset}
        message="Are you sure you want to clear all orders? This cannot be undone."
      />

      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-orange-600 text-3xl mr-2">📋</span>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-green-800'}`}>
            Order Management
          </h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
          >
            <span className="mr-2">📊</span> Export to CSV
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <span className="mr-2">🖨️</span> Print Orders
          </button>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-md ${
              isDarkMode 
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={resetOrders}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
          >
            <span className="mr-2">🔄</span> Reset Orders
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
            {orderStats.total}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <div className="text-sm text-gray-500">Pending</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {orderStats.pending}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <div className="text-sm text-gray-500">Completed</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            {orderStats.completed}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <div className="text-sm text-gray-500">Total Items</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            {orderStats.totalQuantity}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <div className="text-sm text-gray-500">Total Value</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
            ${orderStats.totalValue}
          </div>
        </div>
      </div>

      {/* Wellness Shot Progress */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 mb-6`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Wellness Shot Promotion
          </h3>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {wellnessShotCount}/10 Given
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(wellnessShotCount / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Seasonal Availability Controls */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 mb-6`}>
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
          Seasonal Items Availability
        </h3>
        <div className="space-y-2">
          {Object.entries(seasonalAvailability).map(([product, isAvailable]) => (
            <div key={product} className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>{product}</span>
              <button
                onClick={() => toggleSeasonalAvailability(product)}
                className={`px-4 py-2 rounded-md ${
                  isAvailable 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-400 text-white'
                }`}
              >
                {isAvailable ? 'Available' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Special Alert */}
      {dailySpecial && (
        <div className={`${
          isDarkMode ? 'bg-green-900' : 'bg-green-100'
        } rounded-lg p-4 mb-6 border-l-4 border-green-500`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="ml-3">
              <h3 className={`text-lg font-medium ${
                isDarkMode ? 'text-green-200' : 'text-green-800'
              }`}>
                {dailySpecial.name}
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>
                {dailySpecial.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Jar Deposit Management */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 mb-6`}>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
          Glass Jar Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(jarDeposits.available).map(([size, count]) => (
            <div key={size} className="space-y-2">
              <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {size} Jars
              </h4>
              <div className="flex space-x-4 text-sm">
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Available: {count}
                </div>
                <div className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  Out: {jarDeposits.outstanding[size]}
                </div>
                <div className={`${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                  Returned: {jarDeposits.returned[size]}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleJarDeposit(size, 'take')}
                  disabled={count === 0}
                  className={`px-3 py-1 rounded-md ${
                    count === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white text-sm`}
                >
                  Take Out
                </button>
                <button
                  onClick={() => handleJarDeposit(size, 'return')}
                  disabled={jarDeposits.outstanding[size] === 0}
                  className={`px-3 py-1 rounded-md ${
                    jarDeposits.outstanding[size] === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white text-sm`}
                >
                  Return
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Items Report */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 mb-6`}>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
          Popular Items
        </h3>
        <div className="space-y-3">
          {popularItems.map((item, index) => (
            <div 
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-2">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}
                </span>
                <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                  {item.name}
                </span>
              </div>
              <span className={`${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              } font-semibold`}>
                {item.count} orders
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 mb-6`}>
        {/* ... existing search and filters ... */}
      </div>

      {/* Orders Table */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        {/* ... existing orders table ... */}
      </div>
    </div>
  );
}