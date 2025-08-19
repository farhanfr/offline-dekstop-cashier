import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"), // ESM preload
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Dev
  win.loadURL("http://localhost:5173/");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Products
ipcMain.handle("db:get-products", () => db.getProducts());
ipcMain.handle("db:add-product", (e, product) => db.addProduct(product));
ipcMain.handle("db:update-product", (e, product) => db.updateProduct(product));
ipcMain.handle("db:delete-product", (e, id) => db.deleteProduct(id));
ipcMain.handle("search-products", (e, keyword) => db.searchProducts(keyword));
ipcMain.handle("get-product-by-id", (e, id) => db.getProductsById(id));


// Sales
ipcMain.handle("db:add-sale", (event, sale) => db.addSale(sale));
ipcMain.handle("db:get-sales", () => db.getSales());
