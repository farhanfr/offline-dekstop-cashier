import { useEffect, useState } from "react";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const fetchProducts = async (keyword = "") => {
    let data;
    if (keyword.trim()) {
      data = await window.api.searchProducts(keyword); // call DB search
    } else {
      data = await window.api.getProducts(); // load all if no search
    }
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.price) return;
    await window.api.addProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0
    });
    setForm({ name: "", price: "", stock: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await window.api.deleteProduct(id);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Product Management</h1>

      {/* Search Box */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border rounded-lg px-3 py-2 w-full"
          />
          <button
            onClick={() => fetchProducts(search)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>

      {/* Add Form */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded-lg px-3 py-2 w-28"
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border rounded-lg px-3 py-2 w-24"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Product List */}
      <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.price}</td>
              <td className="px-4 py-2">{p.stock}</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="text-center py-4 text-gray-500 italic"
              >
                No products yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
