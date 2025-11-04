import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Package, Eye, X, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/models.types";
import type { PaginationMeta } from "@/services/productService";

export const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusFilter = (searchParams.get("status") as "pending" | "completed" | "cancelled") || undefined;
  const currentPage = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await orderService.getOrders({
        page: currentPage,
        per_page: 10,
        status: statusFilter,
      });
      setOrders(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      return;
    }

    setCancellingOrderId(orderId);

    try {
      await orderService.cancelOrder(orderId);
      toast({
        title: "Đã hủy đơn hàng!",
        description: "Đơn hàng đã được hủy thành công",
      });
      fetchOrders(); // Refresh list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể hủy đơn hàng",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams();
    if (status !== "all") {
      params.set("status", status);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: "secondary", label: "Chờ xử lý" },
      completed: { variant: "default", label: "Hoàn thành" },
      cancelled: { variant: "destructive", label: "Đã hủy" },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      unpaid: { variant: "secondary", label: "Chưa thanh toán" },
      paid: { variant: "default", label: "Đã thanh toán" },
    };

    const config = variants[status] || variants.unpaid;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">Quản lý đơn hàng và tải tài liệu</p>
        </div>
      </div>

      {/* Tabs Filter */}
      <Tabs
        value={statusFilter || "all"}
        onValueChange={handleStatusChange}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <Card className="py-16">
          <CardContent className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng</h3>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có đơn hàng nào
            </p>
            <Button asChild>
              <Link to="/products">Khám phá sản phẩm</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {!isLoading && !error && orders.length > 0 && (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1">
                        Đơn hàng #{order.order_code}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.payment_status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.product?.thumbnail && (
                          <img
                            src={item.product.thumbnail}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-primary">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        {order.payment_status === "paid" && (
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={`/api/customer/order-items/${item.id}/download`}
                              download
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Tải xuống
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Order Info */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phương thức thanh toán:</span>
                      <span className="font-medium">
                        {order.payment_method === "vnpay" ? "VNPay" : "Thanh toán sau"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Người nhận:</span>
                      <span className="font-medium">{order.customer_info.name}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Tổng tiền:</span>
                      <span className="text-primary">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/customer/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Chi tiết
                      </Link>
                    </Button>
                    {order.status === "pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                      >
                        {cancellingOrderId === order.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-2" />
                        )}
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trang trước
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === meta.last_page ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsis && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                disabled={currentPage === meta.last_page}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Trang sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};


