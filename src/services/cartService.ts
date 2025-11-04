import api from "./api";
import type { CartItem, Order, CustomerInfo } from "@/types/models.types";

export interface CheckoutData {
  customer_info: CustomerInfo;
  payment_method: "vnpay" | "cod";
}

export interface CheckoutResponse {
  order: Order;
  payment_url?: string; // For VNPay
}

export const cartService = {
  // Get user's cart items
  getCartItems: async (): Promise<CartItem[]> => {
    const response = await api.get("/cart");
    return response.data.data;
  },

  // Add product to cart
  addToCart: async (productId: number): Promise<CartItem> => {
    const response = await api.post("/cart", { product_id: productId });
    return response.data.data;
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: number): Promise<void> => {
    await api.delete(`/cart/${cartItemId}`);
  },

  // Clear all cart items
  clearCart: async (): Promise<void> => {
    await api.delete("/cart/clear");
  },

  // Get cart count
  getCartCount: async (): Promise<number> => {
    const response = await api.get("/cart/count");
    return response.data.data.count;
  },

  // Checkout
  checkout: async (data: CheckoutData): Promise<CheckoutResponse> => {
    const response = await api.post("/checkout", data);
    return response.data.data;
  },
};

export default cartService;

