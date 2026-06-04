import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResProduct } from '../Interfaces/res-product';
import { AuthService } from './auth-service';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { CartItems } from '../Interfaces/cart-item';
import { Review } from '../Interfaces/review';

@Injectable({
  providedIn: 'root',
})
export class Shared {
  http = inject(HttpClient);
  toastService = inject(MessageService);
  authService = inject(AuthService);
  private cart = new BehaviorSubject<CartItems[]>([]);
  public $ObsCart = this.cart.asObservable();
  total = signal(0);

  addtoCart(data: ResProduct) {
    this.http.post(`${this.authService.url}/cart/addtocart`, data).subscribe({
      next: () => {
        console.log('items added to cart Successfully');
        this.getCart();
      },
      error: (err) => {
        if (err.error == 'Add to Cart Failed') {
          this.toastService.add({
            severity: 'error',
            summary: 'ServerError',
          });
        }
      },
    });
  }

  getCart() {
    this.http.get<CartItems[]>(`${this.authService.url}/cart/usercart`).subscribe({
      next: (res) => {
        this.cart.next(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeItem(id: number) {
    this.http.delete(`${this.authService.url}/cart/removeproduct/${id}`).subscribe({
      next: (res) => {
        console.log(res);
        this.getCart();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateCart(prodId: number) {
    this.http.patch(`${this.authService.url}/cart/updateproduct/${prodId}`, {}).subscribe({
      next: () => {
        console.log('updated successfully');
        this.getCart();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  clearCart() {
    this.http.delete(`${this.authService.url}/cart/clearcart`).subscribe({
      next: () => {
        this.getCart();
        this.toastService.add({
          severity: 'warn',
          summary: 'Cart cleared',
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ReuduceQtyPrice(prodid: number) {
    this.http.patch(`${this.authService.url}/cart/reduceqtyprice/${prodid}`, {}).subscribe({
      next: () => {
        console.log('product updated successfull');
        this.getCart();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  constructor() {
    this.cart.subscribe((items) => {
      const sum = items.reduce(
        (total, item) => total + item.resProduct.sellingPrice * item.quantity,
        0,
      );

      this.total.set(sum);
    });
  }
}
