import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register validation schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Họ tên là bắt buộc")
      .min(3, "Họ tên phải có ít nhất 3 ký tự"),
    email: z
      .string()
      .min(1, "Email là bắt buộc")
      .email("Email không hợp lệ"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9]{10,11}$/.test(val),
        "Số điện thoại không hợp lệ"
      ),
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải có chữ hoa, chữ thường và số"
      ),
    password_confirmation: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu không khớp",
    path: ["password_confirmation"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token không hợp lệ"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    password_confirmation: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu không khớp",
    path: ["password_confirmation"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Profile update validation schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Họ tên là bắt buộc")
    .min(3, "Họ tên phải có ít nhất 3 ký tự"),
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{10,11}$/.test(val),
      "Số điện thoại không hợp lệ"
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Change password validation schema
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
    password: z
      .string()
      .min(1, "Mật khẩu mới là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    password_confirmation: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu không khớp",
    path: ["password_confirmation"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

