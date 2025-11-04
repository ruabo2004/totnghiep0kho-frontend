import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderTree,
  Package,
  ShoppingBag,
  Wallet,
  Star,
  Settings,
  BarChart3,
  FileText,
} from "lucide-react";

const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Duyệt Seller",
    href: "/admin/seller-registrations",
    icon: UserCheck,
  },
  {
    title: "Quản lý danh mục",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Quản lý sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Quản lý đơn hàng",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Yêu cầu rút tiền",
    href: "/admin/withdrawals",
    icon: Wallet,
  },
  {
    title: "Quản lý đánh giá",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Báo cáo",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Hoạt động hệ thống",
    href: "/admin/activities",
    icon: FileText,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export const AdminLayout = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/customer" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar items={adminMenuItems} />
        <main className="flex-1 p-6 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

