import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "@/components/ui/toaster";

// Layouts
import { PublicLayout } from "./layouts/PublicLayout";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { SellerLayout } from "./layouts/SellerLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Public Pages
import { HomePage } from "./pages/public/HomePage";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// Customer Pages
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";

// Seller Pages
import { SellerDashboard } from "./pages/seller/SellerDashboard";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            {/* More public routes will be added in Phase 3 */}
          </Route>

          {/* Auth Routes (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            {/* More customer routes will be added in Phase 4 */}
          </Route>

          {/* Seller Routes */}
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            {/* More seller routes will be added in Phase 5 */}
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* More admin routes will be added in Phase 6 */}
          </Route>

          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
