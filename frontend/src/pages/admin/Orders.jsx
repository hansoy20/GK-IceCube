import { useEffect, useState } from "react";
import client from "../../api/client";

import { Link } from "react-router-dom";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    client
      .get("/admin/orders", { params: filter ? { status: filter } : {} })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function updateStatus(id, status) {
    await client.patch(`/admin/orders/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-800">Orders</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm transition-all text-slate-600"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-slate-500">No orders match this filter.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-left text-slate-500 font-600">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors align-middle">
                  <td className="px-6 py-4">
                    <Link to={`/admin/orders/${order.id}`} className="font-mono font-600 text-sky-600 hover:text-sky-700 hover:underline">
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    <p className="font-500">{order.user?.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{order.user?.phone}</p>
                  </td>
                  <td className="px-6 py-4 font-mono font-600 text-slate-700">₱{Number(order.total).toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-500 mr-2">{order.paymentMethod}</span> 
                    <span className="text-xs">{order.paymentStatus}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer hover:border-slate-300"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
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
