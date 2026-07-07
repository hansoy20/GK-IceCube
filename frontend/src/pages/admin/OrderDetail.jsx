import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../../api/client";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-slate-500">Loading order details...</div>;
  if (!order) return <div className="text-slate-500">Order not found.</div>;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">
            Order Number #{order.orderNumber}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-600 mr-2">Order Created</span> 
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Customer, Delivery, Items) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-800">Customer Details</h2>
                <div className="bg-sky-50 text-sky-600 p-1.5 rounded-md">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-500">Name</span>
                  <span className="font-600 text-slate-700">{order.user?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-500">Email</span>
                  <span className="font-600 text-sky-600">{order.user?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-600 text-slate-700">{order.contactPhone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-800">Delivery Address</h2>
                <div className="bg-sky-50 text-sky-600 p-1.5 rounded-md">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-500">Address Line</span>
                  <span className="font-600 text-slate-700 text-right">{order.deliveryLine1}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-500">Flat / Building Name</span>
                  <span className="font-600 text-slate-700 text-right">{order.deliveryLine2 || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-3">
                  <span className="text-slate-500">City / Region</span>
                  <span className="font-600 text-slate-700 text-right">{order.deliveryCity}, {order.deliveryRegion}</span>
                </div>
                <div className={`flex justify-between ${(order.requestedDeliveryDate || order.orderNotes) ? 'border-b border-slate-50 pb-3' : 'pb-1'}`}>
                  <span className="text-slate-500">Postcode</span>
                  <span className="font-600 text-slate-700 text-right">{order.deliveryPostal || "-"}</span>
                </div>
                {order.requestedDeliveryDate && (
                  <div className={`flex justify-between ${order.orderNotes ? 'border-b border-slate-50 pb-3' : 'pb-1'}`}>
                    <span className="text-slate-500">Requested Date</span>
                    <span className="font-600 text-sky-600 text-right">
                      {new Date(order.requestedDeliveryDate).toLocaleDateString("en-US", { 
                        timeZone: "UTC", 
                        month: "short", 
                        day: "numeric", 
                        year: "numeric" 
                      })}
                    </span>
                  </div>
                )}
                {order.orderNotes && (
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500 shrink-0 mr-4">Notes</span>
                    <span className="font-600 text-slate-700 text-right">{order.orderNotes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Item Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="grid grid-cols-12 mb-4 text-sm font-bold text-slate-800">
              <div className="col-span-6">Item Summary</div>
              <div className="col-span-2 text-center">QTY</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total Price</div>
            </div>
            
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center text-sm py-4 border-t border-slate-50">
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-600 text-slate-700">{item.productName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Purified Ice</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center font-500 text-slate-500">{Number(item.quantityKg)} kg</div>
                  <div className="col-span-2 text-right font-500 text-slate-500">₱{Number(item.unitPrice).toFixed(2)}</div>
                  <div className="col-span-2 text-right font-600 text-slate-700">₱{Number(item.lineTotal).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (History, Summary) */}
        <div className="space-y-6">
          {/* Order History */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-6">Order History</h2>
            <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
              {["PENDING", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED"].map((status, idx) => {
                const isActive = order.status === status;
                // Just a mock display for history timeline based on current status
                const isPast = ["PENDING", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED"].indexOf(order.status) >= idx;
                
                return (
                  <div key={status} className="relative pl-6">
                    <span className={`absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full ${isPast ? 'bg-sky-500 ring-4 ring-sky-50' : 'bg-slate-200'}`}></span>
                    <p className={`text-sm font-600 ${isPast ? 'text-sky-600' : 'text-slate-400'}`}>
                      {status.replace(/_/g, ' ')}
                    </p>
                    {isActive && <p className="text-xs text-slate-400 mt-1">Current Status</p>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Payment</span>
                <span className="font-600 text-slate-700">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-600 text-slate-700">₱{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Delivery Fee</span>
                <span className="font-600 text-slate-700">₱{Number(order.deliveryFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold text-slate-800 text-base">Total</span>
                <span className="font-bold text-slate-800 text-base">₱{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
