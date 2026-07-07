import { useEffect, useState } from "react";
import client from "../../api/client";

const emptyForm = {
  name: "",
  description: "",
  category: "Cube Ice",
  sizeLabel: "",
  pricePerKg: "",
  imageUrl: "",
  initialStockKg: "",
  lowStockThresholdKg: "20",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    client.get("/admin/products").then((res) => setProducts(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      sizeLabel: product.sizeLabel,
      pricePerKg: product.pricePerKg,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      initialStockKg: product.stockKg ?? "",
      lowStockThresholdKg: product.lowStockThresholdKg ?? "20",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...form,
      pricePerKg: Number(form.pricePerKg),
      initialStockKg: Number(form.initialStockKg) || 0,
      lowStockThresholdKg: Number(form.lowStockThresholdKg) || 20,
    };

    try {
      if (editingId) {
        await client.put(`/admin/products/${editingId}`, payload);
      } else {
        await client.post("/admin/products", payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(id) {
    await client.patch(`/admin/products/${id}/toggle-active`);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await client.delete(`/admin/products/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">Products</h1>

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <h2 className="col-span-full font-display text-lg font-600 text-slate-800">
          {editingId ? "Edit product" : "Add a new product"}
        </h2>

        <div>
          <label className="text-sm font-500 text-slate-600">Name</label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="text-sm font-500 text-slate-600">Category</label>
          <input
            required
            value={form.category}
            onChange={update("category")}
            placeholder="Cube Ice, Block Ice, Dry Ice…"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="text-sm font-500 text-slate-600">Size / weight label</label>
          <input
            required
            value={form.sizeLabel}
            onChange={update("sizeLabel")}
            placeholder="5 kg bag"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="text-sm font-500 text-slate-600">Price per kg (USD)</label>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={form.pricePerKg}
            onChange={update("pricePerKg")}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
          />
        </div>

        {!editingId && (
          <div className="grid grid-cols-2 gap-4 col-span-full">
            <div>
              <label className="text-sm font-500 text-slate-600">Initial Stock (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={form.initialStockKg}
                onChange={update("initialStockKg")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
              />
            </div>
            <div>
              <label className="text-sm font-500 text-slate-600">Low Stock Alert (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={form.lowStockThresholdKg}
                onChange={update("lowStockThresholdKg")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
              />
            </div>
          </div>
        )}

        <div className="col-span-full">
          <label className="text-sm font-500 text-slate-600">Description</label>
          <textarea
            value={form.description}
            onChange={update("description")}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm text-slate-700"
          />
        </div>

        {error && <p className="col-span-full text-sm text-coral">{error}</p>}

        <div className="col-span-full flex gap-3 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-sky-500 px-6 py-2 text-sm font-600 text-white shadow-sm hover:bg-sky-600 focus:ring-2 focus:ring-sky-500/50 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Saving…" : editingId ? "Save changes" : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm font-500 text-slate-500 hover:text-slate-800 transition-colors px-4">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-left text-slate-500 font-600">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price/kg</th>
                <th className="px-6 py-4">Stock (kg)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-500 text-slate-700">{p.name}</td>
                  <td className="px-6 py-4 text-slate-500">{p.category}</td>
                  <td className="px-6 py-4 font-mono font-500 text-slate-700">₱{Number(p.pricePerKg).toFixed(2)}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{Number(p.stockKg) ?? 0} kg</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-500 ${
                        p.isActive ? "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20" : "bg-slate-100 text-slate-600 ring-1 ring-slate-500/10"
                      }`}
                    >
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3 text-sm">
                      <button onClick={() => startEdit(p)} className="font-500 text-sky-600 hover:text-sky-700">
                        Edit
                      </button>
                      <button onClick={() => toggleActive(p.id)} className="font-500 text-slate-500 hover:text-slate-700">
                        {p.isActive ? "Hide" : "Show"}
                      </button>
                      <button onClick={() => remove(p.id)} className="font-500 text-coral hover:text-red-600">
                        Delete
                      </button>
                    </div>
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
