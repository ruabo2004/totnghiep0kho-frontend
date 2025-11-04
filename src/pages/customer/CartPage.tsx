import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ShoppingCart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cartService } from "@/services/cartService";
import type { CartItem } from "@/types/models.types";

export const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await cartService.getCartItems();
      setCartItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setRemovingItemId(itemId);

    try {
      await cartService.removeFromCart(itemId);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      toast({
        title: "Đã xóa khỏi giỏ hàng!",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể xóa sản phẩm",
      });
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
      return;
    }

    try {
      await cartService.clearCart();
      setCartItems([]);
      toast({
        title: "Đã xóa giỏ hàng!",
        description: "Tất cả sản phẩm đã được xóa khỏi giỏ hàng",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể xóa giỏ hàng",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
          <p className="text-muted-foreground">
            {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div>
      </div>

      {/* Empty State */}
      {cartItems.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Giỏ hàng trống</h3>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button asChild>
              <Link to="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Khám phá sản phẩm
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tất cả
              </Button>
            </div>

            {/* Items List */}
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.thumbnail || "/placeholder-product.png"}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product.slug}`}>
                        <h3 className="font-semibold line-clamp-2 hover:text-primary">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {item.product.description}
                      </p>
                      {item.product.category && (
                        <p className="text-xs text-primary mt-2">
                          {item.product.category.name}
                        </p>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(item.product.price)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItemId === item.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {removingItemId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Items */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí xử lý</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Note */}
                <Alert>
                  <AlertDescription className="text-xs">
                    Sau khi thanh toán, bạn sẽ nhận được tài liệu qua email và có thể
                    tải xuống trong tài khoản của mình.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  Tiến hành thanh toán
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

