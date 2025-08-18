import { useEffect, useState } from 'react';
import ProductManager from './components/ProductManager';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const addToCart = (p) => {
    setCart([...cart, { ...p, qty: 1 }]);
  };

  const checkout = async () => {
    for (let item of cart) {
       console.log("SALE ITEM", item)
      await window.api.addSale({
        product_id: item.id,
        quantity: item.qty,
        total: item.price * item.qty,
      });
    }
    alert("Sale recorded!");
    setCart([]);
  };



  return (
    <div className="p-4">
      <h1>testtt</h1>

      <ProductManager onProductsUpdated={setProducts} />

      <h2>Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - ${p.price.toFixed(2)}
            <button onClick={() => addToCart(p)}>Add</button>
          </li>
        ))}
      </ul>

      <h2>Cart</h2>
      <ul>
        {cart.map((c, i) => (
          <li key={i}>
            {c.name} x {c.qty} = ${c.price * c.qty}
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <button onClick={checkout}>Checkout</button>
      )}
    </div>
  );
}

export default App
