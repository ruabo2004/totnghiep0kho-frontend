import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "@/components/ui/toaster";

import { PublicLayout } from "./layouts/PublicLayout";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { SellerLayout } from "./layouts/SellerLayout";
import { AdminLayout } from "./layouts/AdminLayout";

import { HomePage } from "./pages/public/HomePage";
import { ProductsPage } from "./pages/public/ProductsPage";
import { ProductDetailPage } from "./pages/public/ProductDetailPage";
import { CategoriesPage } from "./pages/public/CategoriesPage";
import { CategoryDetailPage } from "./pages/public/CategoryDetailPage";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { ProfilePage } from "./pages/customer/ProfilePage";
import { CartPage } from "./pages/customer/CartPage";
import { CheckoutPage } from "./pages/customer/CheckoutPage";
import { OrdersPage } from "./pages/customer/OrdersPage";
import { OrderDetailPage } from "./pages/customer/OrderDetailPage";
import { FavoritesPage } from "./pages/customer/FavoritesPage";
import { ReviewsPage } from "./pages/customer/ReviewsPage";

import { SellerDashboard } from "./pages/seller/SellerDashboard";

import { AdminDashboard } from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:slug" element={<CategoryDetailPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
          </Route>

          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
