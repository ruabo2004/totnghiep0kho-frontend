export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'seller' | 'customer';
  status: 'active' | 'locked';
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: string;
  price: number;
  thumbnail: string;
  category_id: number;
  seller_id: number;
  status: 'pending' | 'active' | 'rejected';
  views_count: number;
  sales_count: number;
  average_rating: number;
  category?: Category;
  seller?: User;
  images?: ProductImage[];
  created_at: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  products_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
  created_at: string;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  total_amount: number;
  payment_method: string;
  payment_status: 'unpaid' | 'paid';
  status: 'pending' | 'completed' | 'cancelled';
  customer_info: CustomerInfo;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  seller_id: number;
  commission_rate: number;
  product?: Product;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  order_id: number;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  user?: User;
  product?: Product;
  created_at: string;
  updated_at?: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  created_at: string;
}

export interface SellerRegistration {
  id: number;
  user_id: number;
  shop_name: string;
  shop_description?: string;
  tax_code?: string;
  identity_card: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  documents?: RegistrationDocument[];
  user?: User;
  created_at: string;
  updated_at?: string;
}

export interface RegistrationDocument {
  id: number;
  seller_registration_id: number;
  document_type: string;
  document_path: string;
  created_at: string;
}

export interface CommissionHistory {
  id: number;
  order_id: number;
  seller_id: number;
  amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'paid';
  order?: Order;
  seller?: User;
  created_at: string;
}

export interface SellerWithdrawal {
  id: number;
  seller_id: number;
  amount: number;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  seller?: User;
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: number;
  order_id: number;
  vnpay_transaction_no?: string;
  vnpay_bank_code?: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  payment_method: string;
  payment_info?: string;
  created_at: string;
  updated_at?: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

