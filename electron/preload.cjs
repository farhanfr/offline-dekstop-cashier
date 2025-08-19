// electron/preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getProducts: () => ipcRenderer.invoke("db:get-products"),
  addProduct: (product) => ipcRenderer.invoke("db:add-product", product),
  updateProduct: (product) => ipcRenderer.invoke("db:update-product", product),
  deleteProduct: (id) => ipcRenderer.invoke("db:delete-product", id),
  searchProducts: (keyword) => ipcRenderer.invoke("search-products", keyword),
  addSale: (sale) => ipcRenderer.invoke("", sale),
  getProductById: (id) => ipcRenderer.invoke("get-product-by-id", id),

  // ✅ history
  getSales: () => ipcRenderer.invoke("db:get-sales"),

});
