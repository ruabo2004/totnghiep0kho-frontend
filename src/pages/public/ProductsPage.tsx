import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters, type FilterValues } from "@/components/product/ProductFilters";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { productService, categoryService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import type { Product, Category } from "@/types/models.types";
import type { PaginationMeta } from "@/services/productService";

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterValues>({
    category_id: searchParams.get("category_id")
      ? parseInt(searchParams.get("category_id")!)
      : undefined,
    min_price: searchParams.get("min_price")
      ? parseInt(searchParams.get("min_price")!)
      : undefined,
    max_price: searchParams.get("max_price")
      ? parseInt(searchParams.get("max_price")!)
      : undefined,
    sort_by: (searchParams.get("sort_by") as FilterValues["sort_by"]) || undefined,
  });

  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productService.getProducts({
          page: currentPage,
          per_page: 12,
          ...filters,
        });
        setProducts(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không thể tải danh sách sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    const params = new URLSearchParams();

    if (newFilters.category_id) {
      params.set("category_id", newFilters.category_id.toString());
    }
    if (newFilters.min_price) {
      params.set("min_price", newFilters.min_price.toString());
    }
    if (newFilters.max_price) {
      params.set("max_price", newFilters.max_price.toString());
    }
    if (newFilters.sort_by) {
      params.set("sort_by", newFilters.sort_by);
    }
    params.set("page", "1");

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Tài liệu học tập</h1>
          <p className="text-muted-foreground">
            Khám phá hàng ngàn tài liệu chất lượng cao
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="sticky top-4">
            <ProductFilters
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        <main className="lg:col-span-3">
          {meta && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Hiển thị {meta.from} - {meta.to} trong tổng số {meta.total} sản phẩm
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-muted-foreground mb-4">
                Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
              <Button onClick={handleResetFilters}>Xóa bộ lọc</Button>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {meta && meta.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
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
        </main>
      </div>
    </div>
  );
};


