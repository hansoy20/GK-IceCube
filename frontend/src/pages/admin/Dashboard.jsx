import { useEffect, useState } from "react";
import client from "../../api/client";

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <p className="text-sm font-500 text-slate-500">{label}</p>
      <p className={`mt-2 font-mono font-bold text-3xl ${accent || "text-slate-800"}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    client.get("/admin/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-slate-500">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="mt-1 text-slate-500">A snapshot of today's business.</p>

      <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
        <StatCard label="Pending orders" value={data.pendingOrders} accent="text-coral drop-shadow-sm" />
        <StatCard label="Orders today" value={data.todaysOrders} />
        <StatCard label="Revenue today" value={`₱${data.todayRevenue.toFixed(2)}`} />
        <StatCard label="Total customers" value={data.totalCustomers} />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <h2 className="font-display text-lg font-bold text-slate-800">Low stock alerts</h2>
          <span className="rounded-md bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-coral border border-red-100">
            {data.lowStockCount} item{data.lowStockCount === 1 ? "" : "s"}
          </span>
        </div>

        {data.lowStockItems.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">Everything is stocked above its threshold.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-slate-400 font-600">
              <tr>
                <th className="py-3">Product</th>
                <th className="py-3">On hand</th>
                <th className="py-3">Threshold</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStockItems.map((item) => (
                <tr key={item.productName} className="border-t border-slate-50">
                  <td className="py-3 font-bold text-slate-800">{item.productName}</td>
                  <td className="py-3 font-mono font-600 text-coral">{Number(item.stockKg)} kg</td>
                  <td className="py-3 font-mono font-500 text-slate-400">{Number(item.lowStockThresholdKg)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
