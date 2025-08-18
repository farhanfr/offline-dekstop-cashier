import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// --- PRODUCT FUNCTIONS ---
function getProducts() {
  return db.prepare("SELECT * FROM products ORDER BY id DESC").all();
}

function addProduct(product) {
  const stmt = db.prepare(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)"
  );
  const result = stmt.run(product.name, product.price, product.stock ?? 0);
  return { id: result.lastInsertRowid, ...product };
}

function updateProduct(product) {
  db.prepare("UPDATE products SET name=?, price=?, stock=? WHERE id=?")
    .run(product.name, product.price, product.stock, product.id);
  return product;
}

function deleteProduct(id) {
  db.prepare("DELETE FROM products WHERE id=?").run(id);
  return { success: true };
}

function searchProducts(keyword) {
  return db
    .prepare("SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC")
    .all(`%${keyword}%`);
}

// --- SALES FUNCTIONS ---
function addSale({ items, total }) {
  const insertSale = db.prepare("INSERT INTO sales (total) VALUES (?)");
  const insertItem = db.prepare(
    "INSERT INTO sale_items (sale_id, product_id, qty, price) VALUES (?, ?, ?, ?)"
  );

  const transaction = db.transaction((items, total) => {
    const { lastInsertRowid: saleId } = insertSale.run(total);
    for (const item of items) {
      insertItem.run(saleId, item.product_id, item.qty, item.price);
      // reduce stock
      db.prepare("UPDATE products SET stock = stock - ? WHERE id=?")
        .run(item.qty, item.product_id);
    }
    return saleId;
  });

  return transaction(items, total);
}

// ✅ HISTORY: sales + items + product info
function getSales() {
  const sales = db.prepare("SELECT * FROM sales ORDER BY created_at DESC").all();

  const itemsStmt = db.prepare(`
    SELECT si.*, p.name as product_name
    FROM sale_items si
    JOIN products p ON si.product_id = p.id
    WHERE si.sale_id = ?
  `);

  return sales.map(sale => ({
    ...sale,
    items: itemsStmt.all(sale.id)
  }));
}

// ✅ Default export
export default {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addSale,
  getSales,
  searchProducts
};
