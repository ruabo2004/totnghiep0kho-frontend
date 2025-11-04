import api from "./api";
import type { Order } from "@/types/models.types";
import type { PaginationMeta } from "./productService";

export interface OrderListParams {
  page?: number;
  per_page?: number;
  status?: "pending" | "completed" | "cancelled";
}

export interface OrderListResponse {
  data: Order[];
  meta: PaginationMeta;
}

export const orderService = {
  getOrders: async (params?: OrderListParams): Promise<OrderListResponse> => {
    const response = await api.get("/customer/orders", { params });
    return response.data;
  },

  getOrder: async (orderId: number): Promise<Order> => {
    const response = await api.get(`/customer/orders/${orderId}`);
    return response.data.data;
  },

  cancelOrder: async (orderId: number): Promise<void> => {
    await api.post(`/customer/orders/${orderId}/cancel`);
  },

  downloadOrderItem: async (orderItemId: number): Promise<Blob> => {
    const response = await api.get(`/customer/order-items/${orderItemId}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

export default orderService;


