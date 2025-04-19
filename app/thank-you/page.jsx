"use client";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          We've received your order/request and will get back to you soon.
        </p>
        <a
          href="/"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
} 