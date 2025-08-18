import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    window.api.getSales().then(setSales);
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sales History</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <>
                <tr key={sale.id} className="border-b">
                  <td className="p-3">{new Date(sale.created_at).toLocaleString()}</td>
                  <td className="p-3 font-semibold">Rp {sale.total.toLocaleString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleExpand(sale.id)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      {expanded[sale.id] ? (
                        <>
                          <ChevronDown size={16} /> Hide Items
                        </>
                      ) : (
                        <>
                          <ChevronRight size={16} /> View Items
                        </>
                      )}
                    </button>
                  </td>
                </tr>

                {expanded[sale.id] && (
                  <tr>
                    <td colSpan="3" className="p-3 bg-gray-50">
                      <table className="w-full border mt-2">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-2 text-left">Product</th>
                            <th className="p-2 text-left">Qty</th>
                            <th className="p-2 text-left">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sale.items.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.product_name}</td>
                              <td className="p-2">{item.qty}</td>
                              <td className="p-2">Rp {item.price.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
