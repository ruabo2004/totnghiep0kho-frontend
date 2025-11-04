import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShoppingCart, CreditCard, Wallet, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cartService } from "@/services/cartService";
import type { CartItem } from "@/types/models.types";

const checkoutSchema = z.object({
  name: z.string().min(1, "Họ tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  address: z.string().optional(),
  payment_method: z.enum(["vnpay", "cod"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: "",
      payment_method: "vnpay",
    },
  });

  const paymentMethod = watch("payment_method");

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
    }
  }, [user, setValue]);

  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await cartService.getCartItems();
      if (data.length === 0) {
        toast({
          variant: "destructive",
          title: "Giỏ hàng trống!",
          description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán",
        });
        navigate("/products");
        return;
      }
      setCartItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      const response = await cartService.checkout({
        customer_info: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
        payment_method: data.payment_method,
      });

      if (response.payment_url) {
        window.location.href = response.payment_url;
        return;
      }

      toast({
        title: "Đặt hàng thành công!",
        description: "Đơn hàng của bạn đã được tạo thành công",
      });
      navigate(`/customer/orders/${response.order.id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể tạo đơn hàng",
      });
    } finally {
      setIsSubmitting(false);
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
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Thanh toán</h1>
          <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="0123456789"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ (không bắt buộc)</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setValue("payment_method", value as "vnpay" | "cod")
                  }
                  className="space-y-3"
                >
                  <div
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "vnpay"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setValue("payment_method", "vnpay")}
                  >
                    <RadioGroupItem value="vnpay" id="vnpay" />
                    <div className="flex-1">
                      <Label htmlFor="vnpay" className="cursor-pointer flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Thanh toán VNPay</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Thanh toán trực tuyến qua cổng VNPay (ATM, Visa, MasterCard, QR Code)
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setValue("payment_method", "cod")}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <div className="flex-1">
                      <Label htmlFor="cod" className="cursor-pointer flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Thanh toán sau</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Bạn sẽ thanh toán sau khi nhận được tài liệu
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Đơn hàng ({cartItems.length} sản phẩm)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product.thumbnail || "/placeholder-product.png"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-primary font-semibold mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
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

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Tài liệu sẽ được gửi đến email sau khi thanh toán thành công
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Xác nhận thanh toán
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};


