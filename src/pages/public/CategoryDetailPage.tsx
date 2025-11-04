import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, FolderOpen, ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { categoryService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import type { Product, Category } from "@/types/models.types";

export const CategoryDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await categoryService.getCategory(slug);
        setCategory(data);
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không thể tải thông tin danh mục");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [slug]);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertDescription>{error || "Không tìm thấy danh mục"}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/categories">
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
        <Link to="/categories">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh mục
        </Link>
      </Button>

      {/* Category Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FolderOpen className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {products.length} sản phẩm
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Chưa có sản phẩm trong danh mục này
          </h3>
          <p className="text-muted-foreground mb-4">
            Các sản phẩm sẽ được cập nhật sớm
          </p>
          <Button asChild>
            <Link to="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

