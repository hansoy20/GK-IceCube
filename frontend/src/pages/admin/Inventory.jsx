import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustments, setAdjustments] = useState({});
  const [error, setError] = useState("");

  function load() {
    client.get("/admin/inventory").then((res) => setInventory(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function setAdjustment(productId, field, value) {
    setAdjustments((a) => ({ ...a, [productId]: { ...a[productId], [field]: value } }));
  }

  async function submitAdjustment(productId) {
    const adj = adjustments[productId] || {};
    const change = Number(adj.change);
    if (!change) {
      setError("Enter a non-zero amount to adjust.");
      return;
    }
    setError("");
    try {
      await client.post(`/admin/inventory/${productId}/adjust`, {
        change,
        reason: adj.reason || "Manual adjustment",
      });
      setAdjustments((a) => ({ ...a, [productId]: { change: "", reason: "" } }));
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">Inventory</h1>
      <p className="mt-1 text-slate-500">
        Adjust stock for restocks, damage, or corrections. Positive numbers add stock, negative
        numbers remove it.
      </p>

      {error && <p className="mt-3 text-sm font-500 text-coral">{error}</p>}

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-left text-slate-500 font-600">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">On hand</th>
                <th className="px-6 py-4">Threshold</th>
                <th className="px-6 py-4">Adjust by</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors align-middle">
                  <td className="px-6 py-4">
                    <p className="font-500 text-slate-700">{item.productName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sizeLabel}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-500 ${
                        item.isLowStock ? "bg-coral/10 text-coral" : "bg-sky-50 text-sky-600"
                      }`}
                    >
                      {Number(item.stockKg)} kg
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-500 text-slate-400">{Number(item.lowStockThresholdKg)} kg</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      step="0.5"
                      value={adjustments[item.productId]?.change || ""}
                      onChange={(e) => setAdjustment(item.productId, "change", e.target.value)}
                      placeholder="±kg"
                      className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      value={adjustments[item.productId]?.reason || ""}
                      onChange={(e) => setAdjustment(item.productId, "reason", e.target.value)}
                      placeholder="Restock delivery"
                      className="w-40 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => submitAdjustment(item.productId)}
                      className="rounded-lg bg-sky-500 px-4 py-1.5 text-xs font-600 text-white shadow-sm hover:bg-sky-600 focus:ring-2 focus:ring-sky-500/50 transition-colors"
                    >
                      Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
