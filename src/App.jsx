import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Pages
import ProductManagement from "./pages/ProductManagement";

import Checkout from "./pages/checkout";
import AddProduct from "./pages/ProductManagement/AddProduct";
import EditProduct from "./pages/ProductManagement/EditProduct";
import SalesHistory from "./pages/SalesHistory";

export default function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
          <h1 className="text-xl font-bold mb-6">Cashier App</h1>
          <nav className="space-y-2">
            <a href="/checkout" className="block hover:bg-gray-700 p-2 rounded">
              Checkout
            </a>
            <a
              href="/products"
              className="block hover:bg-gray-700 p-2 rounded"
            >
              Product Management
            </a>
            <a
              href="/history"
              className="block hover:bg-gray-700 p-2 rounded"
            >
              History Checkout
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/checkout" />} />

            <Route path="/checkout" element={<Checkout />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/history" element={<SalesHistory />} />

            {/* fallback */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
