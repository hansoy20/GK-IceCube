import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import client from "../api/client";
import OrderStatusStepper from "../components/OrderStatusStepper";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message));
  }, [id]);

  const paidFlag = searchParams.get("paid");

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-coral">{error}</p>
        <Link to="/orders" className="mt-4 inline-block text-glacier">
          Back to my orders
        </Link>
      </div>
    );
  }

  if (!order) return <div className="px-6 py-16 text-center text-ink/60">Loading…</div>;

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-sm font-bold text-sky-600">Order placed</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-slate-800">{order.orderNumber}</h1>

      {paidFlag === "1" && (
        <p className="mt-3 rounded-lg bg-sky-50 px-4 py-3 text-sm font-bold text-sky-600 border border-sky-100">
          Payment received — thank you!
        </p>
      )}
      {paidFlag === "0" && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-coral border border-red-100">
          Payment was not completed. Your order is saved as unpaid — you can retry from here.
        </p>
      )}

      <div className="ice-tile mt-6 p-6">
        <OrderStatusStepper status={order.status} />
      </div>

      <div className="ice-tile mt-6 p-6">
        <h2 className="font-display text-lg font-bold text-slate-800">Items</h2>
        <div className="mt-4 space-y-2 text-sm font-500">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between font-500 text-slate-600">
              <span>
                {item.productName} ({Number(item.quantityKg)} kg)
              </span>
              <span className="font-mono font-bold text-slate-800">₱{Number(item.lineTotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4 text-sm font-500">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-mono font-bold text-slate-700">₱{Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Delivery</span>
            <span className="font-mono font-bold text-slate-700">₱{Number(order.deliveryFee).toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 font-bold text-slate-800">
            <span>Total</span>
            <span className="font-mono text-lg">₱{Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="ice-tile mt-6 p-6">
        <h2 className="font-display text-lg font-bold text-slate-800">Delivering to</h2>
        <p className="mt-2 text-sm font-500 text-slate-500">
          {order.deliveryLine1}
          {order.deliveryLine2 ? `, ${order.deliveryLine2}` : ""}, {order.deliveryCity}
          {order.deliveryRegion ? `, ${order.deliveryRegion}` : ""} {order.deliveryPostal || ""}
        </p>
        <p className="mt-1 text-sm font-500 text-slate-500">Contact: <span className="font-bold text-slate-700">{order.contactPhone}</span></p>
        <p className="mt-3 text-sm font-500 text-slate-400">
          Payment: {order.paymentMethod === "COD" ? "Cash on delivery" : "Card"} ·{" "}
          <span className="font-bold text-slate-600">{order.paymentStatus}</span>
        </p>
      </div>

      <Link to="/orders" className="mt-6 inline-block font-bold text-sky-600 hover:text-sky-700 transition-colors">
        ← Back to my orders
      </Link>
    </div>
  );
}
