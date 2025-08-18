import { useEffect, useState } from "react";

export default function Checkout() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch products from DB (initial load or when searching)
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

  // Add product to cart
  const addToCart = (product) => {
    const existing = cart.find((c) => c.id === product.id);
    if (existing) {
      setCart(
        cart.map((c) =>{
          console.log(c)
          if (c.stock === 0 || c.stock < 0) {
            return alert("Product out of stock");
          }
          return  c.id === product.id ? { ...c, qty: c.qty + 1 } : c
        })
      );
    } else {
      if(product.stock === 0 || product.stock < 0) {
        return alert("Product out of stock");
      }
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Update quantity
  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart(cart.filter((c) => c.id !== id));
    } else {
      setCart(cart.map((c) => (c.id === id ? { ...c, qty } : c)));
    }
  };

  // Remove item
  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // create sale
    const saleId = await window.api.addSale({
      items: cart.map((c) => ({
        product_id: c.id,
        qty: c.qty,
        price: c.price,
      })),
      total,
    });

    setCart([]);
    alert(`Checkout successful! Sale ID: ${saleId}`);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Products List */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Products</h1>

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

        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg shadow p-4 bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-gray-600">Rp {p.price}</p>
              </div>
              <button
                onClick={() => addToCart(p)}
                className="mt-4 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <p className="col-span-2 text-gray-500 italic">
              No products found
            </p>
          )}
        </div>
      </div>

      {/* Cart */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        <div className="bg-white shadow rounded-lg p-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 italic">Cart is empty</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">Product</th>
                  <th className="px-2 py-1 text-center">Qty</th>
                  <th className="px-2 py-1 text-right">Price</th>
                  <th className="px-2 py-1 text-right">Subtotal</th>
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-2 py-1">{item.name}</td>
                    <td className="px-2 py-1 text-center">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item.id, Number(e.target.value))
                        }
                        className="w-16 border rounded text-center"
                      />
                    </td>
                    <td className="px-2 py-1 text-right">
                      Rp {item.price}
                    </td>
                    <td className="px-2 py-1 text-right">
                      Rp {item.price * item.qty}
                    </td>
                    <td className="px-2 py-1 text-right">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-semibold">
            Total: Rp {total}
          </span>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`px-4 py-2 rounded-lg ${
              cart.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
