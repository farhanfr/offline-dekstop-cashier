import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const handleAdd = async () => {
    if (!form.name || !form.price) return;
    await window.api.addProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
    });
    navigate("/products"); // go back to product management page
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add Product</h1>

      <div className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => navigate("/products")}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
