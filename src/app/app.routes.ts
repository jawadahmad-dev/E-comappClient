import { Routes } from '@angular/router';
import { adminGuard } from './Guards/admin-guard';
import { customerGuard } from './Guards/customer-guard';

export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup').then((x) => x.Signup),
  },
  {
    path: 'signin',
    loadComponent: () => import('./sigin/sigin').then((x) => x.Sigin),
  },

  {
    path: '',
    loadComponent: () => import('./nav/nav').then((x) => x.Nav),
    children: [
      {
        path: '',
        loadComponent: () => import('./main/main').then((x) => x.Main),
      },
      {
        path: 'shop',
        loadComponent: () => import('./home/home').then((x) => x.Home),
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about').then((x) => x.About),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then((x) => x.Profile),
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./product-detail/product-detail').then((x) => x.ProductDetail),
      },
      {
        path: 'checkout',
        loadComponent: () => import('./checkout/checkout').then((x) => x.Checkout),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./Admin/nav/nav').then((x) => x.Nav),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./Admin/dashboard/dashboard').then((x) => x.Dashboard),
      },
      {
        path: 'inventory',
        loadComponent: () => import('./Admin/add-product/add-product').then((x) => x.AddProduct),
      },
      {
        path: 'users',
        loadComponent: () => import('./Admin/users/users').then((x) => x.Users),
      },
      {
        path: 'orders',
        loadComponent: () => import('./Admin/orders/orders').then((x) => x.Orders),
      },
    ],
  },

  {
    path: 'customer',
    loadComponent: () => import('./Customer/nav/nav').then((x) => x.Nav),
    canActivate: [customerGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./Customer/dashboard/dashboard').then((x) => x.Dashboard),
      },
      {
        path: 'orders',
        loadComponent: () => import('./Customer/orders/orders').then((x) => x.Orders),
      },
    ],
  },
];
