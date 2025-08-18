import { useEffect, useState } from 'react';

import ProductManagement from './pages/ProductManagement';
import Checkout from './pages/checkout';
import SalesHistory from './pages/SalesHistory';

export default function App() {
  const [activeMenu, setActiveMenu] = useState("checkout");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Cashier App
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <button
            onClick={() => setActiveMenu("checkout")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeMenu === "checkout"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            Checkout
          </button>
          <button
            onClick={() => setActiveMenu("products")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeMenu === "products"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            Product Management
          </button>
          <button
            onClick={() => setActiveMenu("history")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeMenu === "history"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            History Checkout
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          © 2025
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {activeMenu === "checkout" && <Checkout />}
        {activeMenu === "products" && <ProductManagement />}
        {activeMenu === "history" && <SalesHistory/>}
      </main>
    </div>
  );
}
