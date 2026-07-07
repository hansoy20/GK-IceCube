import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RequireAuth, RequireAdmin } from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import OrderNow from "./pages/OrderNow";
import OrderConfirmation from "./pages/OrderConfirmation";

import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminInventory from "./pages/admin/Inventory";

function StorefrontLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Admin console — separate layout, no storefront navbar */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inventory" element={<AdminInventory />} />
      </Route>

      {/* Customer storefront */}
      <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
      <Route
        path="/order"
        element={
          <StorefrontLayout>
              <OrderNow />
          </StorefrontLayout>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <StorefrontLayout>
              <OrderConfirmation />
          </StorefrontLayout>
        }
      />
    </Routes>
  );
}
