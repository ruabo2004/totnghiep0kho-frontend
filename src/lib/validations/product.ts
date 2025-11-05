import { z } from 'zod';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const productSchema = z.object({
  name: z.string().min(5, 'Tên sản phẩm phải có ít nhất 5 ký tự'),
  description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự'),
  content: z.string().min(50, 'Nội dung phải có ít nhất 50 ký tự'),
  price: z.number().min(1000, 'Giá phải ít nhất 1,000đ'),
  category_id: z.number().min(1, 'Vui lòng chọn danh mục'),
  thumbnail: z.any().optional(),
  images: z.any().optional(),
  product_file: z.any().optional(),
  preview_file: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

