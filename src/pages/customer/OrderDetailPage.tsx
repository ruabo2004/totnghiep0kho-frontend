import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Package,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Download,
  X,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast.ts";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/models.types";

export const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await orderService.getOrder(parseInt(orderId));
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      return;
    }

    setIsCancelling(true);

    try {
      await orderService.cancelOrder(order.id);
      toast({
        title: "Đã hủy đơn hàng!",
        description: "Đơn hàng đã được hủy thành công",
      });
      navigate("/customer/orders");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể hủy đơn hàng",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      pending: {
        variant: "secondary",
        label: "Chờ xử lý",
        icon: Package,
      },
      completed: {
        variant: "default",
        label: "Hoàn thành",
        icon: CheckCircle2,
      },
      cancelled: {
        variant: "destructive",
        label: "Đã hủy",
        icon: X,
      },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    return status === "paid" ? (
      <Badge variant="default" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Đã thanh toán
      </Badge>
    ) : (
      <Badge variant="secondary">Chưa thanh toán</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertDescription>{error || "Không tìm thấy đơn hàng"}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/customer/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/customer/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại đơn hàng
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Đơn hàng #{order.order_code}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(order.created_at)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(order.status)}
          {getPaymentStatusBadge(order.payment_status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  {item.product?.thumbnail && (
                    <Link to={`/products/${item.product.slug}`}>
                      <img
                        src={item.product.thumbnail}
                        alt={item.product_name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </Link>
                  )}
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product?.slug || "#"}`}
                      className="font-semibold hover:text-primary line-clamp-2"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      Người bán: {item.product?.seller?.name || "N/A"}
                    </p>
                    <p className="text-lg font-bold text-primary mt-2">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  {order.payment_status === "paid" && (
                    <div className="flex items-center">
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={`/api/customer/order-items/${item.id}/download`}
                          download
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Họ tên</p>
                  <p className="font-medium">{order.customer_info.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customer_info.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{order.customer_info.phone}</p>
                </div>
              </div>
              {order.customer_info.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">{order.customer_info.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Method */}
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                  <p className="font-medium">
                    {order.payment_method === "vnpay"
                      ? "VNPay"
                      : "Thanh toán sau"}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí xử lý</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(order.total_amount)}</span>
                </div>
              </div>

              {/* Actions */}
              {order.status === "pending" && (
                <div className="border-t pt-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang hủy...
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Hủy đơn hàng
                      </>
                    )}
                  </Button>
                </div>
              )}

              {order.payment_status === "paid" && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Tài liệu đã được gửi đến email của bạn và có thể tải xuống ở trên
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

