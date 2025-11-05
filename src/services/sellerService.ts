import api from './api';
import type { Product } from '@/types/models.types';

export interface SellerStats {
  total_products: number;
  active_products: number;
  pending_products: number;
  total_revenue: number;
  total_orders: number;
  total_views: number;
  commission_balance: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  content: string;
  price: number;
  category_id: number;
  thumbnail?: File;
  images?: File[];
  product_file?: File;
  preview_file?: File;
}

export interface WithdrawalRequest {
  amount: number;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  note?: string;
}

export interface CommissionHistory {
  id: number;
  order_id: number;
  amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'paid';
  created_at: string;
  order?: {
    order_code: string;
    total_amount: number;
  };
}

export interface SellerWithdrawal {
  id: number;
  amount: number;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  created_at: string;
  updated_at?: string;
}

export const sellerService = {
  // Dashboard & Stats
  async getStats(): Promise<SellerStats> {
    const response = await api.get('/seller/stats');
    return response.data.data;
  },

  // Products Management
  async getMyProducts(params?: { page?: number; per_page?: number; status?: string; search?: string }) {
    const response = await api.get('/seller/products', { params });
    return response.data;
  },

  async getMyProduct(id: number): Promise<Product> {
    const response = await api.get(`/seller/products/${id}`);
    return response.data.data;
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('price', data.price.toString());
    formData.append('category_id', data.category_id.toString());
    
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    if (data.product_file) {
      formData.append('product_file', data.product_file);
    }
    
    if (data.preview_file) {
      formData.append('preview_file', data.preview_file);
    }

    const response = await api.post('/seller/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async updateProduct(id: number, data: ProductFormData): Promise<Product> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('price', data.price.toString());
    formData.append('category_id', data.category_id.toString());
    formData.append('_method', 'PUT');
    
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    if (data.product_file) {
      formData.append('product_file', data.product_file);
    }
    
    if (data.preview_file) {
      formData.append('preview_file', data.preview_file);
    }

    const response = await api.post(`/seller/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/seller/products/${id}`);
  },

  async deleteProductImage(productId: number, imageId: number): Promise<void> {
    await api.delete(`/seller/products/${productId}/images/${imageId}`);
  },

  // Orders
  async getMyOrders(params?: { page?: number; per_page?: number }) {
    const response = await api.get('/seller/orders', { params });
    return response.data;
  },

  // Commissions
  async getCommissions(params?: { page?: number; per_page?: number; status?: string }) {
    const response = await api.get('/seller/commissions', { params });
    return response.data;
  },

  async getCommissionBalance() {
    const response = await api.get('/seller/commissions/balance');
    return response.data.data;
  },

  // Withdrawals
  async getWithdrawals(params?: { page?: number; per_page?: number }) {
    const response = await api.get('/seller/withdrawals', { params });
    return response.data;
  },

  async createWithdrawal(data: WithdrawalRequest) {
    const response = await api.post('/seller/withdrawals', data);
    return response.data;
  },

  // Shop Profile
  async getShopProfile() {
    const response = await api.get('/seller/profile');
    return response.data.data;
  },

  async updateShopProfile(data: {
    shop_name?: string;
    shop_description?: string;
    bank_name?: string;
    bank_account_number?: string;
    bank_account_name?: string;
  }) {
    const response = await api.put('/seller/profile', data);
    return response.data;
  },
};

