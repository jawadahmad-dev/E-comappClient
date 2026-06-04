import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { AuthService } from '../Services/auth-service';
import { Shared } from '../Services/shared';
import { CartItems } from '../Interfaces/cart-item';
import { Checkout } from '../checkout/checkout';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    DynamicDialogModule,
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  providers: [DialogService, MessageService],
})
export class Nav implements OnInit {
  // Angular 22 Signals for UI state
  isMobileMenuOpen = signal(false);
  isCartOpen = signal(false);

  mobileNavLinks = [
    { label: 'Home', route: '/', icon: 'pi pi-home' },
    { label: 'Shop', route: '/shop', icon: 'pi pi-shop' },
    { label: 'About', route: '/about', icon: 'pi pi-building' },
  ];

  ref: DynamicDialogRef | null = null;
  dialogService = inject(DialogService);
  sharedService = inject(Shared);
  toastService = inject(MessageService);
  authService = inject(AuthService);

  userCart: CartItems[] = [];

  show() {
    this.ref = this.dialogService.open(Checkout, {
      width: '70vw',
      data: { cartItems: this.userCart, total: this.sharedService.total() },
      closable: true,
    });
  }

  ngOnInit(): void {
    this.authService.loggedIn();
    this.authService.CheckRole();
    this.sharedService.getCart();
    this.sharedService.$ObsCart.subscribe({
      next: (res) => (this.userCart = res),
    });
  }
}
