import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shared } from '../Services/shared';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { BadgeModule } from 'primeng/badge';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ResProduct } from '../Interfaces/res-product';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../Services/auth-service';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
  image: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonModule,
    CarouselModule,
    BadgeModule,
    RatingModule,
    InputTextModule,
    RippleModule,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  sharedService = inject(Shared);
  currentYear = new Date().getFullYear();
  ProductsArr = signal<ResProduct[]>([]);
  authService = inject(AuthService);
  http = inject(HttpClient);

  ngOnInit(): void {
    this.getProducts();
  }

  carouselResponsive = [
    { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 },
  ];

  footerLinks = signal([
    {
      title: 'Shop',
      links: [
        { label: 'All Products', route: '/products' },
        { label: 'New Arrivals', route: '/new' },
        { label: 'Deals', route: '/deals' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', route: '/faq' },
        { label: 'Shipping', route: '/shipping' },
        { label: 'Returns', route: '/returns' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', route: '/about' },
        { label: 'Careers', route: '/careers' },
        { label: 'Contact', route: '/contact' },
      ],
    },
  ]);

  getProducts() {
    this.http.get<ResProduct[]>(`${this.authService.url}/products/customer/getproducts`).subscribe({
      next: (res) => {
        this.ProductsArr.set(res);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
