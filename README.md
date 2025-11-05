# 🎓 TotNghiep0Kho - Frontend

Platform Mua Bán Tài Liệu Học Tập - React Frontend Application

## 📋 Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Redux Toolkit
- **UI Framework:** TailwindCSS + Shadcn/ui
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=TotNghiep0Kho
VITE_APP_URL=http://localhost:5173
VITE_VNPAY_RETURN_URL=http://localhost:5173/payment/return
```

## 📊 Development Progress

### ✅ PHASE 1: Setup & Foundation (COMPLETED)
- [x] Project initialized with Vite + React + TypeScript
- [x] TailwindCSS configured
- [x] Shadcn/ui components installed
- [x] Folder structure created
- [x] API client configured
- [x] Redux store setup
- [x] Basic routing configured

### ✅ PHASE 2: Authentication (COMPLETED)
- [x] Auth Redux Slice (login, register, logout, fetchCurrentUser)
- [x] Auth Service functions
- [x] Login Page with validation
- [x] Register Page with validation
- [x] Forgot Password Page
- [x] Reset Password Page
- [x] Profile Page with avatar upload
- [x] Protected Route component
- [x] Guest Route component
- [x] Routing with role-based access control

### ✅ PHASE 3: Public Pages (COMPLETED)
- [x] Home Page với Hero section, Featured products
- [x] Products Page với filters, sorting, pagination
- [x] Product Detail Page với gallery, reviews
- [x] Categories Page
- [x] Category Detail Page
- [x] Product Service (API integration)

### ✅ PHASE 4: Customer Dashboard (COMPLETED)
- [x] Customer Dashboard với statistics
- [x] Shopping Cart
- [x] Checkout Page
- [x] Orders Page
- [x] Order Detail Page
- [x] Reviews Page
- [x] Favorites Page
- [x] Cart Service, Order Service, Review Service, Favorite Service

### ✅ PHASE 5: Seller Dashboard (COMPLETED)
- [x] Seller Dashboard với statistics cards
- [x] Products Management (list, create, edit, delete)
- [x] Product Form với file upload (images, documents, preview)
- [x] Seller Orders page
- [x] Commission History tracking
- [x] Withdrawals Management
- [x] Shop Profile page
- [x] Seller Service (API integration)

### ⏳ PHASE 6: Admin Dashboard (TODO)
- [ ] Admin Dashboard
- [ ] User Management
- [ ] Category Management
- [ ] Product Approvals
- [ ] Order Management

### ⏳ PHASE 7: Payment Integration (TODO)
- [ ] VNPay Integration
- [ ] Payment Flow

### ⏳ PHASE 8: Testing & Polish (TODO)
- [ ] Unit Tests
- [ ] Performance Optimization
- [ ] Responsive Design

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn/ui components
│   ├── common/          # Common components (ProtectedRoute, GuestRoute)
│   ├── layout/          # Layout components
│   └── product/         # Product-related components
├── pages/
│   ├── auth/            # ✅ Authentication pages (COMPLETED)
│   ├── public/          # ✅ Public pages (COMPLETED)
│   ├── customer/        # ✅ Customer dashboard pages (COMPLETED)
│   ├── seller/          # ✅ Seller dashboard pages (COMPLETED)
│   └── admin/           # Admin dashboard pages
├── services/
│   ├── api.ts           # ✅ Axios instance (COMPLETED)
│   ├── authService.ts   # ✅ Auth API calls (COMPLETED)
│   ├── productService.ts # ✅ Product & Category APIs (COMPLETED)
│   ├── cartService.ts   # ✅ Cart APIs (COMPLETED)
│   ├── orderService.ts  # ✅ Order APIs (COMPLETED)
│   ├── reviewService.ts # ✅ Review APIs (COMPLETED)
│   ├── favoriteService.ts # ✅ Favorite APIs (COMPLETED)
│   └── sellerService.ts # ✅ Seller APIs (COMPLETED)
├── store/
│   ├── index.ts         # ✅ Redux store (COMPLETED)
│   └── slices/
│       ├── authSlice.ts # ✅ Auth state (COMPLETED)
│       └── cartSlice.ts # Cart state
├── hooks/
│   ├── useAuth.ts       # ✅ Auth hook (COMPLETED)
│   └── useDebounce.ts   # Debounce hook
├── layouts/             # Layout wrappers
├── lib/
│   └── validations/
│       └── auth.ts      # ✅ Zod validation schemas (COMPLETED)
├── types/
│   └── models.types.ts  # ✅ TypeScript interfaces (COMPLETED)
└── utils/
    ├── cn.ts            # ✅ Class name utility (COMPLETED)
    ├── format.ts        # Format utilities
    └── constants.ts     # App constants
```

## 🔐 Authentication Features (COMPLETED)

### Pages
- **Login Page**: Email/password login with validation
- **Register Page**: User registration with strong password requirements
- **Forgot Password**: Request password reset email
- **Reset Password**: Set new password with token
- **Profile Page**: Update profile info and avatar, change password

### Security
- JWT token authentication
- Role-based access control (Admin, Seller, Customer)
- Protected routes
- Guest routes (redirect authenticated users)
- Auto logout on 401 response

### Validation
- Zod schema validation
- React Hook Form integration
- Real-time error messages
- Password strength requirements

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🔗 API Integration

The frontend connects to the Laravel backend API:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT Bearer Token
- **Auto token management**: Stored in localStorage
- **Auto logout**: On 401 unauthorized response

### Example API Call

```typescript
import api from '@/services/api';

// Login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// Get current user (auto adds Authorization header)
const user = await api.get('/auth/me');
```

## 🎨 UI Components (Shadcn/ui)

Pre-installed components:
- Button, Input, Label
- Card, Alert
- Avatar, Badge
- Tabs, Dialog
- Table, Dropdown
- Toast notifications

Add more components:
```bash
npx shadcn-ui@latest add [component-name]
```

## 🚧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling

### State Management
- Use Redux Toolkit for global state
- Use local state for component-specific data
- Use React Hook Form for form state

### Routing
- Protected routes for authenticated users
- Guest routes for non-authenticated users
- Role-based access control

## 📞 Backend Integration

Make sure the Laravel backend is running:

```bash
cd ../totnghiep0kho-backend
php artisan serve
```

Backend API will be available at `http://localhost:8000`

## 🎯 Next Steps

Đã hoàn thành 62.5% dự án! Các phase còn lại:

1. ~~**PHASE 1**: Setup & Foundation~~ ✅ COMPLETED
2. ~~**PHASE 2**: Authentication~~ ✅ COMPLETED
3. ~~**PHASE 3**: Public Pages~~ ✅ COMPLETED
4. ~~**PHASE 4**: Customer Dashboard~~ ✅ COMPLETED
5. ~~**PHASE 5**: Seller Dashboard~~ ✅ COMPLETED
6. **PHASE 6**: Admin Dashboard (TODO) - Cần làm tiếp
7. **PHASE 7**: Payment Integration (TODO) - Cần làm tiếp
8. **PHASE 8**: Testing & Optimization (TODO) - Cần làm tiếp

## 📝 Notes

- All authentication routes are protected with GuestRoute
- Customer/Seller/Admin routes use ProtectedRoute with role checking
- Avatar upload uses FormData for file handling
- Password reset requires email and token from query params

---

**Status**: Phase 1-5 ✅ COMPLETED | Phase 6-8 ⏳ TODO

**Progress**: 5/8 Phases (62.5%)

**Last Updated**: November 5, 2025
