import api from "./api";
import type { Product, Category, Review } from "@/types/models.types";

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ProductListParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: "newest" | "popular" | "price_asc" | "price_desc" | "rating";
}

export interface ProductListResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface CategoryWithProducts extends Category {
  products?: Product[];
}

export const productService = {
  getProducts: async (params?: ProductListParams): Promise<ProductListResponse> => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/${slug}`);
    return response.data.data;
  },

  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await api.get("/products/featured", {
      params: { limit },
    });
    return response.data.data;
  },

  getRelatedProducts: async (productId: number, limit: number = 4): Promise<Product[]> => {
    const response = await api.get(`/products/${productId}/related`, {
      params: { limit },
    });
    return response.data.data;
  },

  getProductReviews: async (productId: number): Promise<Review[]> => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data.data;
  },

  searchProducts: async (query: string, limit: number = 10): Promise<Product[]> => {
    const response = await api.get("/products/search", {
      params: { q: query, limit },
    });
    return response.data.data;
  },
};

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data.data;
  },

  getCategory: async (slug: string): Promise<CategoryWithProducts> => {
    const response = await api.get(`/categories/${slug}`);
    return response.data.data;
  },

  getCategoryProducts: async (
    categoryId: number,
    params?: ProductListParams
  ): Promise<ProductListResponse> => {
    const response = await api.get(`/categories/${categoryId}/products`, {
      params,
    });
    return response.data;
  },
};

export default { ...productService, ...categoryService };


