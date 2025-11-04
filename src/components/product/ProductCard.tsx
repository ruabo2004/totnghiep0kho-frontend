import { Link } from "react-router-dom";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/models.types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(product);
  };

  return (
    <Link to={`/products/${product.slug}`} className="block h-full">
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={product.thumbnail || "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Status Badge */}
          {product.status === "pending" && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2"
            >
              Đang chờ duyệt
            </Badge>
          )}

          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
          )}

          {/* Stats Overlay */}
          <div className="absolute bottom-2 left-2 right-2 flex gap-2 text-white text-xs">
            <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
              <Eye className="h-3 w-3" />
              <span>{product.views_count}</span>
            </div>
            {product.sales_count > 0 && (
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                <ShoppingCart className="h-3 w-3" />
                <span>{product.sales_count} đã bán</span>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          {product.category && (
            <Link
              to={`/categories/${product.category.slug}`}
              className="text-xs text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {product.category.name}
            </Link>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-base mt-1 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {product.average_rating > 0
                ? product.average_rating.toFixed(1)
                : "Chưa có"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          {/* Price */}
          <div>
            <p className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Add to Cart Button */}
          {onAddToCart && product.status === "active" && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Thêm vào giỏ</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

