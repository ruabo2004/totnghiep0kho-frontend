import api from "./api";
import type { Review } from "@/types/models.types";

export interface CreateReviewData {
  product_id: number;
  order_id: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export const reviewService = {
  getMyReviews: async (): Promise<Review[]> => {
    const response = await api.get("/customer/reviews");
    return response.data.data;
  },

  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await api.post("/customer/reviews", data);
    return response.data.data;
  },

  updateReview: async (reviewId: number, data: UpdateReviewData): Promise<Review> => {
    const response = await api.put(`/customer/reviews/${reviewId}`, data);
    return response.data.data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/customer/reviews/${reviewId}`);
  },

  canReview: async (productId: number): Promise<boolean> => {
    try {
      const response = await api.get(`/customer/reviews/can-review/${productId}`);
      return response.data.data.can_review;
    } catch (error) {
      return false;
    }
  },
};

export default reviewService;


