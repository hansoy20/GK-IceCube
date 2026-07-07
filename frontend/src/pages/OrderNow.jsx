import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

const DELIVERY_FEE = 5.0;

export default function OrderNow() {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [quantityKg, setQuantityKg] = useState(1);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    deliveryLine1: "",
    deliveryLine2: "",
    deliveryCity: "",
    deliveryRegion: "",
    deliveryPostal: "",
    contactPhone: "",
    orderNotes: "",
    requestedDeliveryDate: "",
    paymentMethod: "COD",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    client.get("/products")
      .then(res => {
        if (res.data.length > 0) {
          setProduct(res.data[0]);
        } else {
          setError("No products available.");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoadingProduct(false));
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!product) return;
    if (quantityKg <= 0 || quantityKg > product.stockKg) {
      setError("Please select a valid quantity.");
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      const res = await client.post("/orders", {
        ...form,
        items: [{ productId: product.id, quantityKg }],
      });

      const order = res.data;

      if (form.paymentMethod === "CARD") {
        try {
          const session = await client.post(`/payments/checkout-session/${order.id}`);
          window.location.href = session.data.url;
          return;
        } catch (payErr) {
          navigate(`/orders/${order.id}`);
          return;
        }
      }

      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.message || "An error occurred during checkout.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingProduct) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14 text-center">
        <p className="text-lg font-bold text-slate-500">Loading order form...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-14 text-center">
        <p className="text-lg font-bold text-coral">{error}</p>
      </div>
    );
  }

  const subtotal = product.pricePerKg * quantityKg;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-2xl font-bold text-slate-800">Order Now</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          
          <div className="ice-tile p-6 mb-8 border border-primary/20 bg-primary/5">
            <h2 className="font-display text-lg font-bold text-primary mb-4">Ice Quantity</h2>
            <div>
              <label className="text-sm font-bold text-slate-700">How many kilograms of {product.name}?</label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  required
                  type="number"
                  min="0.5"
                  step="0.5"
                  max={product.stockKg}
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(parseFloat(e.target.value) || 0)}
                  className="w-32 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
                />
                <span className="text-sm font-bold text-slate-500">kg</span>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">Available stock: {product.stockKg} kg</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-500">Full name</label>
              <input
                required
                value={form.customerName}
                onChange={update("customerName")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
                placeholder="Juan Dela Cruz"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500">Email address</label>
              <input
                required
                type="email"
                value={form.customerEmail}
                onChange={update("customerEmail")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
                placeholder="juan@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500">Address line 1</label>
            <input
              required
              value={form.deliveryLine1}
              onChange={update("deliveryLine1")}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              placeholder="123 Frost Avenue"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500">Address line 2 (optional)</label>
            <input
              value={form.deliveryLine2}
              onChange={update("deliveryLine2")}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              placeholder="Unit, suite, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-500">City</label>
              <input
                required
                value={form.deliveryCity}
                onChange={update("deliveryCity")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500">Region / State</label>
              <input
                value={form.deliveryRegion}
                onChange={update("deliveryRegion")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-500">Postal code</label>
              <input
                value={form.deliveryPostal}
                onChange={update("deliveryPostal")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500">Contact phone</label>
              <input
                required
                value={form.contactPhone}
                onChange={update("contactPhone")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-500">Requested delivery date (optional)</label>
              <input
                type="date"
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                value={form.requestedDeliveryDate}
                onChange={update("requestedDeliveryDate")}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500">Delivery notes (optional)</label>
            <textarea
              value={form.orderNotes}
              onChange={update("orderNotes")}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              placeholder="Gate code, preferred time window, etc."
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500">Payment method</label>
            <div className="mt-2 flex gap-3">
              {["COD", "CARD"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, paymentMethod: method }))}
                  className={`rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition-colors ${
                    form.paymentMethod === method
                      ? "bg-slate-800 text-white"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {method === "COD" ? "Cash on delivery" : "Pay by card"}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 font-medium">{error}</p>}
        </div>

        <div className="ice-tile h-fit p-6">
          <h2 className="font-display text-lg font-bold text-slate-800">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between font-500 text-slate-500">
                <p className="text-sm font-bold text-slate-800">
                  {product.name} ({quantityKg} kg)
                </p>
                <span className="font-mono font-bold text-slate-700">₱{subtotal.toFixed(2)}</span>
              </div>
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm font-500">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-slate-700">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery</span>
              <span className="font-mono font-bold text-slate-700">₱{DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-slate-800">
              <span>Total</span>
              <span className="font-mono text-lg">₱{(subtotal + DELIVERY_FEE).toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-sky-500 py-3 font-bold text-white shadow-sm hover:bg-sky-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
}
