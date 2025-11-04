export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TotNghiep0Kho';

export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  CUSTOMER: 'customer',
} as const;

export const PRODUCT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  REJECTED: 'rejected',
} as const;

export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const WITHDRAWAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export const PAYMENT_METHODS = {
  VNPAY: 'vnpay',
} as const;

export const PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_PER_PAGE = 20;


