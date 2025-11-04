import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, TrendingUp, BookOpen, Users, ShoppingBag, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { productService, categoryService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import type { Product, Category } from "@/types/models.types";

export const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getFeaturedProducts(8),
          categoryService.getCategories(),
        ]);
        setFeaturedProducts(productsData);
        setCategories(categoriesData.slice(0, 6)); // Limit to 6 categories
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddToCart = async (product: Product) => {
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

  const stats = [
    { icon: BookOpen, label: "Tài liệu chất lượng", value: "10,000+" },
    { icon: Users, label: "Người dùng", value: "5,000+" },
    { icon: ShoppingBag, label: "Giao dịch", value: "50,000+" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Nền tảng mua bán tài liệu học tập
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Khám phá hàng ngàn tài liệu chất lượng cao từ cộng đồng
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Tìm kiếm
              </Button>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Danh mục phổ biến</h2>
              <p className="text-muted-foreground">
                Khám phá tài liệu theo chủ đề
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/categories">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {category.name}
                    </h3>
                    {category.products_count !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        {category.products_count} SP
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                Sản phẩm nổi bật
              </h2>
              <p className="text-muted-foreground">
                Những tài liệu được yêu thích nhất
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/products">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="h-96 animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bắt đầu bán tài liệu của bạn
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Chia sẻ kiến thức và kiếm thêm thu nhập từ tài liệu của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">Đăng ký ngay</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/products">Khám phá tài liệu</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};


