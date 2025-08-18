import { useEffect, useState } from "react";

export default function ProductManager({ onProductsUpdated }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", price: "" });

  const loadProducts = async () => {
    const data = await window.api.getProducts();
    setProducts(data);
    onProductsUpdated(data);
  };

  useEffect(() => {
    loadProducts();
    console.log("window.api = ", window.api);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Fill all fields");

    if (form.id) {
      await window.api.updateProduct(form);
    } else {
      await window.api.addProduct(form);
    }

    setForm({ id: null, name: "", price: "" });
    loadProducts();
  };

  const editProduct = (p) => {
    setForm(p);
  };

  const deleteProduct = async (id) => {
    if (confirm("Delete this product?")) {
      await window.api.deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="border p-4 my-4">
      <h2>Product Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
        />
        <button type="submit">{form.id ? "Update" : "Add"}</button>
        {form.id && (
          <button type="button" onClick={() => setForm({ id: null, name: "", price: "" })}>
            Cancel
          </button>
        )}
      </form>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price.toFixed(2)}
            <button onClick={() => editProduct(p)}>Edit</button>
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
