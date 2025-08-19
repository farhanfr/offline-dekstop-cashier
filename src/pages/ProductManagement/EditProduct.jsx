import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  useEffect(() => {
    const load = async () => {
      const product = await window.api.getProductById(Number(id));
      if (product) setForm(product);
    };
    load();
  }, [id]);

  const handleUpdate = async () => {
    await window.api.updateProduct({
      id: Number(id),
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
    navigate("/products");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <div className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />

        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Update
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
