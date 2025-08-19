import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    await window.api.deleteProduct(id);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => navigate("/products/add")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

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
              <td className="px-4 py-2 text-right space-x-2">
                <button
                  onClick={() => navigate(`/products/edit/${p.id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
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
