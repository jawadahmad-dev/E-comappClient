# 🛒 Ecommerce Frontend — Angular

A modern, responsive ecommerce web application built with Angular, PrimeNG, and Tailwind CSS.
Consumes a RESTful ASP.NET Core Web API backend with JWT-based authentication.

> 🔗 Backend Repo: https://github.com/jawadahmad-dev/E-comappBackend

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 17+ |
| UI Library | PrimeNG |
| Styling | Tailwind CSS |
| Language | TypeScript |
| HTTP Client | Angular HttpClient |
| Auth | JWT Bearer Token |
| State | Angular Services + RxJS |
| Forms | Reactive Forms |

---

App Home Ui
<img width="3840" height="2160" alt="Screenshot 2026-06-04 225910" src="https://github.com/user-attachments/assets/95df1e03-0573-4305-abd8-7275b4a16650" />


## ✨ Features

### 🔐 Authentication
- User Register & Login pages
- JWT token stored and attached to every request via HTTP Interceptor
- Route guards protecting authenticated & admin routes
- Auto redirect on token expiry

### 🛍️ Product Listing & Search
- Browse all products with grid layout
- Search by name and filter by category
- Responsive product cards with Cloudinary images

### 📄 Product Detail Page
- Full product info with image
- Add to cart directly from detail page

### 🛒 Shopping Cart
- Add, update quantity, and remove items
- Real-time subtotal calculation
- Persistent cart per logged-in user

### 💳 Checkout Page
- Order summary before placing
- Shipping details form with validation
- Place order and clear cart on success

### 📦 Order History
- View all past orders per user
- Order status tracking (Pending, Processing, Shipped, Delivered)

### 👑 Admin Dashboard
- Manage products (Create, Edit, Delete)
- Image upload via Cloudinary
- View and update all orders and their statuses
- Admin-only routes protected by role-based guard

Admin-panel UI
<img width="3840" height="2160" alt="Screenshot 2026-06-04 225659" src="https://github.com/user-attachments/assets/ed6ecbe8-b23a-4396-8014-467370c262d4" />


### 📱 Responsive Design
- Fully responsive across mobile, tablet, and desktop
- PrimeNG components + Tailwind utility classes

---



---

## ⚙️ Getting Started

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [Angular CLI](https://angular.io/cli)
```bash
npm install -g @angular/cli
```

### 1. Clone the repo
```bash
git clone https://github.com/jawadahmad-dev/E-comappClient.git
cd ecommerce-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Fill in your API URL:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

### 4. Run the app
```bash
ng serve
```

App runs on `http://localhost:4200`

---

## 🔐 Route Structure

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home / Product listing |
| `/products/:id` | Public | Product detail page |
| `/auth/login` | Public | Login page |
| `/auth/register` | Public | Register page |
| `/cart` | Auth | Shopping cart |
| `/checkout` | Auth | Checkout page |
| `/orders` | Auth | Order history |
| `/admin` | Admin only | Admin dashboard |
| `/admin/products` | Admin only | Product management |

---

## 🧱 Key Implementation Details

### HTTP Interceptor
Automatically attaches JWT token to every outgoing request:
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

### Auth Guard
Protects routes from unauthenticated access:
```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/auth/login']);
};
```

---

## 📸 Screenshots

| Page | Preview |
|------|---------|
| Home / Products | ![home](screenshots/home.png) |
| Product Detail | ![detail](screenshots/detail.png) |
| Shopping Cart | ![cart](screenshots/cart.png) |
| Checkout | ![checkout](screenshots/checkout.png) |
| Order History | ![orders](screenshots/orders.png) |
| Admin Dashboard | ![admin](screenshots/admin.png) |

> Add your screenshots inside a `/screenshots` folder in the root of the repo.

---

## 👤 Author

**Jawad Ahmad**  
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/jawadahmad-dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/jawadahmad-dev)
