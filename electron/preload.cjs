// electron/preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getProducts: () => ipcRenderer.invoke("db:get-products"),
  addProduct: (product) => ipcRenderer.invoke("db:add-product", product),
  updateProduct: (product) => ipcRenderer.invoke("db:update-product", product),
  deleteProduct: (id) => ipcRenderer.invoke("db:delete-product", id),
  addSale: (sale) => ipcRenderer.invoke("db:add-sale", sale),

  // ✅ history
  getSales: () => ipcRenderer.invoke("db:get-sales"),

});
