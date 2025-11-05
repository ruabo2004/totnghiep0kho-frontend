import api from './api';
import type { LoginCredentials, RegisterData, User } from '@/types/models.types';

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: File;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async updateProfile(data: UpdateProfileData) {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await api.post('/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async changePassword(data: ChangePasswordData) {
    const response = await api.post('/profile/change-password', data);
    return response.data;
  },
};

