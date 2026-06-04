import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ResProduct } from '../Interfaces/res-product';
import { AuthService } from '../Services/auth-service';
import { ButtonModule } from 'primeng/button';
import { Shared } from '../Services/shared';
import { CommonModule } from '@angular/common';
import { Review } from '../Interfaces/review';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { NgRatings } from 'ng-ratings';

@Component({
  selector: 'app-product-detail',
  imports: [
    RouterLink,
    AvatarModule,
    NgRatings,
    CardModule,
    RatingModule,
    ButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  activateRoute = inject(ActivatedRoute);
  http = inject(HttpClient);
  toastService = inject(MessageService);
  sharedService = inject(Shared);
  authService = inject(AuthService);
  reviewValue: number = 0;
  product: ResProduct | null = null;
  reviewData: Review[] = [];
  reviewDesc: string = '';
  productId: number = 0;

  ngOnInit(): void {
    this.getId();
    this.getProduct();
    this.getReview();
  }

  getProduct() {
    this.http
      .get<ResProduct>(`${this.authService.url}/products/customers/product/${this.productId}`)
      .subscribe({
        next: (res) => {
          this.product = res;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getId() {
    this.productId = Number(this.activateRoute.snapshot.paramMap.get('id'));
  }

  postReview() {
    if (!this.authService.getToken()) {
      this.toastService.add({
        severity: 'error',
        summary: 'Please Sign-In First',
      });
      return;
    }
    const review = {
      productId: this.productId,
      reviewValue: this.reviewValue,
      email: this.authService.Claims()?.email,
      userId: this.authService.Claims()?.id,
      reviewDescription: this.reviewDesc ? this.reviewDesc : '',
    };
    this.http.post(`${this.authService.url}/reviews/postreview`, review).subscribe({
      next: () => {
        this.reviewDesc = '';
        this.getReview();
      },
      error: (err) => {
        if (err.error == 'Already Reviewed') {
          this.toastService.add({
            severity: 'warn',
            summary: 'Already Reviewed',
          });
        }
        console.log(err);
      },
    });
  }

  getReview() {
    this.http
      .get<Review[]>(`${this.authService.url}/reviews/getproductreviews/${this.productId}`)
      .subscribe({
        next: (res) => {
          this.reviewData = this.reviewData = res.sort((a, b) => {
            if (a.userId === Number(this.authService.Claims()?.nameid)) return -1;
            if (b.userId === Number(this.authService.Claims()?.nameid)) return 1;
            return 0;
          });
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  editReview(review: Review) {
    this.http.patch(`${this.authService.url}/reviews/updatereview`, review).subscribe({
      next: () => {},
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteReview(id: number) {
    this.http.delete(`${this.authService.url}/reviews/deletereview/${id}`).subscribe({
      next: () => {
        this.toastService.add({
          severity: 'success',
          summary: 'Review Deleted Successfully',
        });
        this.getReview();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
