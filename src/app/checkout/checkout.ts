import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Shared } from '../Services/shared';
import { User } from '../Interfaces/user';
import { CartItems } from '../Interfaces/cart-item';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    RadioButtonModule,
    DividerModule,
    TagModule,
    FormsModule,
    DynamicDialogModule,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  dialogService = inject(DialogService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  sharedService = inject(Shared);
  checkOutForm!: FormGroup;
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  http = inject(HttpClient);
  toastService = inject(MessageService);
  userdata: User | null = null;

  cartItems: CartItems[] = this.config.data.cartItems;
  total = this.config.data.total;

  ngOnInit(): void {
    this.formInit();
    this.getProfile();
  }

  formInit() {
    this.checkOutForm = this.fb.group({
      name: [
        this.userdata?.customerDetails?.name ? this.userdata?.customerDetails?.name : '',
        Validators.required,
      ],
      phone: [
        this.userdata?.customerDetails?.phone ? this.userdata?.customerDetails?.phone : '',
        [Validators.required, Validators.minLength(10)],
      ],
      email: [this.authService.Claims().email, Validators.required],
      address: [
        this.userdata?.customerDetails?.address ? this.userdata?.customerDetails?.address : '',
        Validators.required,
      ],
      city: [
        this.userdata?.customerDetails?.city ? this.userdata?.customerDetails?.city : '',
        Validators.required,
      ],
      postalCode: [
        this.userdata?.customerDetails?.postalCode
          ? this.userdata?.customerDetails?.postalCode
          : '',
        Validators.required,
      ],
    });
  }

  onSubmit() {
    if (this.checkOutForm.invalid) return;
    this.http.post(`${this.authService.url}/orders/neworder`, this.cartItems).subscribe({
      next: () => {
        this.http
          .post(`${this.authService.url}/orders/customerDetails`, this.checkOutForm.value)
          .subscribe({
            next: () => {
              this.sharedService.clearCart();
              this.toastService.add({
                severity: 'success',
                summary: 'CheckOut Successfull',
              });
              this.ref?.close();
            },
            error: (err) => {
              if (err.error == 'Insufficent Stock') {
                this.toastService.add({
                  severity: 'warn',
                  summary: 'Insufficent Stock',
                });
              }
              console.log(err);
            },
          });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProfile() {
    this.http.get<User>(`${this.authService.url}/auth/getuser`).subscribe({
      next: (res) => {
        this.userdata = res;
        this.checkOutForm.patchValue({
          name: res.customerDetails?.name || '',
          phone: res.customerDetails?.phone || '',
          email: res.email || '',
          address: res.customerDetails?.address || '',
          city: res.customerDetails?.city || '',
          postalCode: res.customerDetails?.postalCode || '',
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
