import api from "./api";
import type { Favorite } from "@/types/models.types";

export const favoriteService = {
  getFavorites: async (): Promise<Favorite[]> => {
    const response = await api.get("/customer/favorites");
    return response.data.data;
  },

  addFavorite: async (productId: number): Promise<Favorite> => {
    const response = await api.post("/customer/favorites", {
      product_id: productId,
    });
    return response.data.data;
  },

  removeFavorite: async (favoriteId: number): Promise<void> => {
    await api.delete(`/customer/favorites/${favoriteId}`);
  },

  isFavorite: async (productId: number): Promise<boolean> => {
    try {
      const response = await api.get(`/customer/favorites/check/${productId}`);
      return response.data.data.is_favorite;
    } catch (error) {
      return false;
    }
  },
};

export default favoriteService;

