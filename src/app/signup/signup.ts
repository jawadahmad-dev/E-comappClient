import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {
  fb = inject(FormBuilder);
  toastService = inject(MessageService);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  SignUpForm!: FormGroup;
  ngOnInit(): void {
    this.formInit();
  }
  formInit() {
    this.SignUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  onSubmit() {
    this.http.post(`${this.authService.url}/auth/signup`, this.SignUpForm.value).subscribe({
      next: () => {
        this.SignUpForm.reset();
        this.toastService.add({
          severity: 'success',
          summary: 'Account Created Successfully',
          detail: 'continue to sign-in and explore products',
        });
        this.router.navigate(['/signin']);
      },
      error: (err: any) => {
        if (err.error === 'Email already exists') {
          this.toastService.add({
            severity: 'error',
            summary: 'Signup Failed',
            detail: 'user with this email already exists',
          });
        }
        console.log(err);
      },
    });
  }
}
