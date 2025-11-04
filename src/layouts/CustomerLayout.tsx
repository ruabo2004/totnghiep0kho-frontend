import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Star,
  Heart,
  User,
  Store,
} from "lucide-react";

const customerMenuItems = [
  {
    title: "Dashboard",
    href: "/customer",
    icon: LayoutDashboard,
  },
  {
    title: "Giỏ hàng",
    href: "/customer/cart",
    icon: ShoppingCart,
  },
  {
    title: "Đơn hàng",
    href: "/customer/orders",
    icon: Package,
  },
  {
    title: "Tài liệu đã mua",
    href: "/customer/purchased",
    icon: FileText,
  },
  {
    title: "Đánh giá",
    href: "/customer/reviews",
    icon: Star,
  },
  {
    title: "Yêu thích",
    href: "/customer/favorites",
    icon: Heart,
  },
  {
    title: "Hồ sơ",
    href: "/customer/profile",
    icon: User,
  },
  {
    title: "Đăng ký bán hàng",
    href: "/customer/seller-registration",
    icon: Store,
  },
];

export const CustomerLayout = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "seller") {
    return <Navigate to="/seller" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar items={customerMenuItems} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

