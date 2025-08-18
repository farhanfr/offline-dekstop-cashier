import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file in project root (adjust path if needed)
const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

export default {
  // Products
  getProducts() {
    const stmt = db.prepare("SELECT * FROM products ORDER BY id DESC");
    return stmt.all();
  },
  addProduct(product) {
    const stmt = db.prepare(
      "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)"
    );
    const result = stmt.run(product.name, product.price, product.stock ?? 0);
    return { id: result.lastInsertRowid, ...product };
  },
  updateProduct(product) {
    const stmt = db.prepare(
      "UPDATE products SET name=?, price=?, stock=? WHERE id=?"
    );
    stmt.run(product.name, product.price, product.stock, product.id);
    return product;
  },
  deleteProduct(id) {
    const stmt = db.prepare("DELETE FROM products WHERE id=?");
    stmt.run(id);
    return { success: true };
  },

  // Sales
  addSale(sale) {
    console.log("SALE ITEM", sale)
    const stmt = db.prepare(
      "INSERT INTO sales (product_id, quantity, total) VALUES (?, ?, ?)"
    );
    const result = stmt.run(sale.product_id, sale.quantity, sale.total);

    // reduce stock
    db.prepare(
      "UPDATE products SET stock = stock - ? WHERE id=?"
    ).run(sale.quantity, sale.product_id);

    return { id: result.lastInsertRowid, ...sale };
  },
};
