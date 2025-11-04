import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/types/models.types";

export interface FilterValues {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: "newest" | "popular" | "price_asc" | "price_desc" | "rating";
}

interface ProductFiltersProps {
  categories: Category[];
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onReset: () => void;
}

export const ProductFilters = ({
  categories,
  filters,
  onFilterChange,
  onReset,
}: ProductFiltersProps) => {
  const [minPrice, setMinPrice] = useState(filters.min_price?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.max_price?.toString() || "");

  const handleCategoryChange = (categoryId: number) => {
    onFilterChange({
      ...filters,
      category_id: categoryId === filters.category_id ? undefined : categoryId,
    });
  };

  const handleSortChange = (
    sortBy: "newest" | "popular" | "price_asc" | "price_desc" | "rating"
  ) => {
    onFilterChange({ ...filters, sort_by: sortBy });
  };

  const handlePriceFilter = () => {
    onFilterChange({
      ...filters,
      min_price: minPrice ? parseInt(minPrice) : undefined,
      max_price: maxPrice ? parseInt(maxPrice) : undefined,
    });
  };

  const hasActiveFilters =
    filters.category_id ||
    filters.min_price ||
    filters.max_price ||
    filters.sort_by;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Bộ lọc</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Sort By */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sắp xếp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { value: "newest", label: "Mới nhất" },
            { value: "popular", label: "Phổ biến nhất" },
            { value: "price_asc", label: "Giá thấp đến cao" },
            { value: "price_desc", label: "Giá cao đến thấp" },
            { value: "rating", label: "Đánh giá cao nhất" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                handleSortChange(
                  option.value as FilterValues["sort_by"]
                )
              }
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                filters.sort_by === option.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {option.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Danh mục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                filters.category_id === category.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <span>{category.name}</span>
              {category.products_count !== undefined && (
                <span className="text-xs opacity-70">
                  ({category.products_count})
                </span>
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Khoảng giá</CardTitle>
          <CardDescription className="text-xs">
            Nhập giá (VNĐ)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="min-price" className="text-xs">
              Giá tối thiểu
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-price" className="text-xs">
              Giá tối đa
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="1000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>
          <Button
            onClick={handlePriceFilter}
            className="w-full"
            size="sm"
          >
            Áp dụng
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


