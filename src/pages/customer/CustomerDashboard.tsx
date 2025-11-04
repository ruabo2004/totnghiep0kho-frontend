import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Package,
  Star,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { orderService } from "@/services/orderService";
import { favoriteService } from "@/services/favoriteService";
import { reviewService } from "@/services/reviewService";
import type { Order } from "@/types/models.types";

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, favoritesData, reviewsData] = await Promise.all([
        orderService.getOrders({ page: 1, per_page: 3 }),
        favoriteService.getFavorites(),
        reviewService.getMyReviews(),
      ]);

      setRecentOrders(ordersData.data);
      setFavoritesCount(favoritesData.length);
      setReviewsCount(reviewsData.length);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const stats = [
    {
      title: "Đơn hàng",
      value: recentOrders.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/customer/orders",
    },
    {
      title: "Yêu thích",
      value: favoritesCount,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      link: "/customer/favorites",
    },
    {
      title: "Đánh giá",
      value: reviewsCount,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      link: "/customer/reviews",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Xin chào, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Chào mừng bạn quay lại với TotNghiep0Kho
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div
                    className={`h-14 w-14 rounded-full ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Đơn hàng gần đây</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/customer/orders">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Đang tải...</p>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Chưa có đơn hàng</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/customer/orders/${order.id}`}
                    className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">
                          #{order.order_code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {order.status === "completed"
                          ? "Hoàn thành"
                          : order.status === "cancelled"
                          ? "Đã hủy"
                          : "Chờ xử lý"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} sản phẩm
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Truy cập nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/products">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Khám phá sản phẩm
              </Button>
            </Link>
            <Link to="/customer/cart">
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Giỏ hàng
              </Button>
            </Link>
            <Link to="/customer/favorites">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="mr-2 h-4 w-4" />
                Danh sách yêu thích ({favoritesCount})
              </Button>
            </Link>
            <Link to="/customer/reviews">
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Đánh giá của tôi ({reviewsCount})
              </Button>
            </Link>
            <Link to="/customer/profile">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Quản lý tài khoản
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


