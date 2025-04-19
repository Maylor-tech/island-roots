"use client";

import { useState } from "react";
import Image from "next/image";

const juices = [
  {
    name: "Beet Vibes Juice",
    ingredients: "Beet, Carrot, Ginger, Citrus, Honey",
    price: "$6",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=1000&auto=format&fit=crop",
    alt: "Vibrant beet juice with carrot and ginger"
  },
  {
    name: "Golden Glow Juice",
    ingredients: "Pineapple, Turmeric, Ginger, Lime",
    price: "$6",
    image: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?q=80&w=1000&auto=format&fit=crop",
    alt: "Golden pineapple and turmeric juice"
  },
  {
    name: "Sorrel Splash (Seasonal)",
    ingredients: "Sorrel, Ginger, Orange Peel, Clove",
    price: "$6",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=1000&auto=format&fit=crop",
    alt: "Seasonal sorrel juice with spices"
  }
];

const comingSoonPastries = [
  {
    name: "Gizzada",
    description: "Traditional Jamaican coconut tart with a flaky crust",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop",
    alt: "Jamaican coconut tart"
  },
  {
    name: "Coconut Drops",
    description: "Sweet coconut treats with ginger and spices",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop",
    alt: "Coconut drops"
  },
  {
    name: "Healthy Treats",
    description: "Coming soon: Our special healthy versions of Jamaican favorites",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop",
    alt: "Healthy treats"
  }
];

export default function IslandRoots() {
  const [order, setOrder] = useState({ name: "", product: "", quantity: 1 });
  const [customRequest, setCustomRequest] = useState({ name: "", request: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    form.submit();
  };

  const handleCustomRequest = (e) => {
    e.preventDefault();
    const form = e.target;
    form.submit();
  };

  return (
    <div className="bg-amber-50 min-h-screen font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Island Roots</h1>
        <p className="text-lg md:text-xl">Natural Juices & Pastries from Newark, NJ 🇯🇲</p>
        <p className="mt-4 text-sm md:text-base max-w-2xl mx-auto">
          Experience the vibrant flavors of Jamaica with our handcrafted juices and pastries. 
          Each sip and bite is a journey to the islands, made with love and fresh ingredients.
        </p>
      </header>

      {/* Juice Menu Section */}
      <section className="p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Our Juices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {juices.map((juice) => (
            <div key={juice.name} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={juice.image}
                  alt={juice.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={juice.name === "Beet Vibes Juice"}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">{juice.name}</h3>
                <p className="text-gray-600 mb-2">{juice.ingredients}</p>
                <p className="text-orange-500 font-bold">{juice.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="p-8 max-w-6xl mx-auto bg-green-50 rounded-xl my-8">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Coming Soon: Jamaican Pastries & Desserts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comingSoonPastries.map((item) => (
            <div key={item.name} className="bg-white rounded-xl shadow-lg overflow-hidden p-6 text-center">
              <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-green-700 font-medium">
          Stay tuned for our authentic Jamaican pastries and healthy dessert options!
        </p>
      </section>

      {/* Custom Request Section */}
      <section className="p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Special Requests</h2>
        <form 
          action="https://formsubmit.co/alicia@islandroots.com" 
          method="POST"
          onSubmit={handleCustomRequest}
          className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="https://islandroots.com/thank-you" />
          <input type="hidden" name="_subject" value="Custom Request from Island Roots Website" />
          
          <div>
            <label htmlFor="custom-name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="custom-name"
              name="name"
              value={customRequest.name}
              onChange={(e) => setCustomRequest({ ...customRequest, name: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-1">
              Your Request
            </label>
            <textarea
              id="request"
              name="request"
              value={customRequest.request}
              onChange={(e) => setCustomRequest({ ...customRequest, request: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32"
              placeholder="Tell us what you'd like us to prepare for you..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
          >
            Send Request
          </button>
        </form>
      </section>

      {/* Order Form Section */}
      <section className="p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Order Now</h2>
        <form 
          action="https://formsubmit.co/alicia@islandroots.com" 
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="https://islandroots.com/thank-you" />
          <input type="hidden" name="_subject" value="New Order from Island Roots Website" />
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={order.name}
              onChange={(e) => setOrder({ ...order, name: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              id="product"
              name="product"
              value={order.product}
              onChange={(e) => setOrder({ ...order, product: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Select a product</option>
              {juices.map((juice) => (
                <option key={juice.name} value={juice.name}>
                  {juice.name} - {juice.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={order.quantity}
              onChange={(e) => setOrder({ ...order, quantity: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
          >
            Place Order
          </button>
        </form>
      </section>

      {/* WhatsApp Section */}
      <section className="p-8 max-w-2xl mx-auto text-center">
        <p className="text-lg mb-4">Prefer to order via WhatsApp?</p>
        <a
          href="https://wa.me/12017265216"
          className="inline-block bg-lime-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-lime-700 transition-colors duration-300"
        >
          Message Us on WhatsApp
        </a>
        <p className="mt-6 text-gray-600">
          Or send payment to Venmo @AliciaName with your name & order details.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-center p-6">
        <p>&copy; {new Date().getFullYear()} Island Roots. All rights reserved.</p>
      </footer>
    </div>
  );
} 