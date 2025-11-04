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
import { ProductsPage } from "./pages/public/ProductsPage";
import { ProductDetailPage } from "./pages/public/ProductDetailPage";
import { CategoriesPage } from "./pages/public/CategoriesPage";
import { CategoryDetailPage } from "./pages/public/CategoryDetailPage";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

// Customer Pages
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { ProfilePage } from "./pages/customer/ProfilePage";
import { CartPage } from "./pages/customer/CartPage";
import { CheckoutPage } from "./pages/customer/CheckoutPage";

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
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:slug" element={<CategoryDetailPage />} />
          </Route>

          {/* Auth Routes (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Customer Routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>

          {/* Checkout (outside customer layout) */}
          <Route path="/checkout" element={<CheckoutPage />} />

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
