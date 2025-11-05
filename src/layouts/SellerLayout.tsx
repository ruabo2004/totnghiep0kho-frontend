import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Wallet,
  Store,
  BarChart3,
  User,
} from "lucide-react";

const sellerMenuItems = [
  {
    title: "Dashboard",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý sản phẩm",
    href: "/seller/products",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    href: "/seller/orders",
    icon: ShoppingBag,
  },
  {
    title: "Hoa hồng",
    href: "/seller/commissions",
    icon: DollarSign,
  },
  {
    title: "Rút tiền",
    href: "/seller/withdrawals",
    icon: Wallet,
  },
  {
    title: "Hồ sơ cửa hàng",
    href: "/seller/profile",
    icon: Store,
  },
];

export const SellerLayout = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "seller" && user?.role !== "admin") {
    return <Navigate to="/customer" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar items={sellerMenuItems} />
        <main className="flex-1 p-6 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


