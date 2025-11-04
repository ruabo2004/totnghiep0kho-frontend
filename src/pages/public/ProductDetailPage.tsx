import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  ShoppingCart,
  Star,
  Eye,
  Heart,
  User,
  Calendar,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductCard } from "@/components/product/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import type { Product, Review } from "@/types/models.types";

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch product
        const productData = await productService.getProduct(slug);
        setProduct(productData);
        setSelectedImage(productData.thumbnail);

        // Fetch related products
        const relatedData = await productService.getRelatedProducts(
          productData.id,
          4
        );
        setRelatedProducts(relatedData);

        // Fetch reviews
        const reviewsData = await productService.getProductReviews(productData.id);
        setReviews(reviewsData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không thể tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
      });
      navigate("/login");
      return;
    }

    if (!product) return;

    try {
      await cartService.addToCart(product.id);
      toast({
        title: "Đã thêm vào giỏ hàng!",
        description: `${product.name} đã được thêm vào giỏ hàng`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể thêm vào giỏ hàng",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Đã sao chép link!",
        description: "Link sản phẩm đã được sao chép vào clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertDescription>{error || "Không tìm thấy sản phẩm"}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  const images = [
    product.thumbnail,
    ...(product.images?.map((img) => img.image_path) || []),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
            <img
              src={selectedImage || "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === image
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={image || "/placeholder-product.png"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Status */}
          <div className="flex items-center gap-2">
            {product.category && (
              <Link
                to={`/categories/${product.category.slug}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            {product.status === "pending" && (
              <Badge variant="secondary">Đang chờ duyệt</Badge>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">
                {product.average_rating > 0
                  ? product.average_rating.toFixed(1)
                  : "Chưa có đánh giá"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{product.views_count} lượt xem</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              <span>{product.sales_count} đã bán</span>
            </div>
          </div>

          {/* Price */}
          <div className="py-4 border-y">
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Mô tả ngắn</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <Avatar>
                  <AvatarImage src={product.seller.avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{product.seller.name}</p>
                  <p className="text-sm text-muted-foreground">Người bán</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.status !== "active"}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button size="lg" variant="outline" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="mb-12">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="content">Chi tiết</TabsTrigger>
          <TabsTrigger value="reviews">
            Đánh giá ({reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.content }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá từ khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có đánh giá nào
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={review.user?.avatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{review.user?.name}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {formatDate(review.created_at)}
                        </p>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onAddToCart={async () => {
                  try {
                    await cartService.addToCart(relatedProduct.id);
                    toast({
                      title: "Đã thêm vào giỏ hàng!",
                      description: `${relatedProduct.name} đã được thêm vào giỏ hàng`,
                    });
                  } catch (error: any) {
                    toast({
                      variant: "destructive",
                      title: "Lỗi!",
                      description:
                        error.response?.data?.message || "Không thể thêm vào giỏ hàng",
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

