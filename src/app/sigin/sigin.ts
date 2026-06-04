import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth-service';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-sigin',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './sigin.html',
  styleUrl: './sigin.scss',
})
export class Sigin implements OnInit {
  toastService = inject(MessageService);
  fb = inject(FormBuilder);
  router = inject(Router);
  http = inject(HttpClient);
  authService = inject(AuthService);
  SignInForm!: FormGroup;
  ngOnInit(): void {
    this.formInit();
  }
  formInit() {
    this.SignInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.http.post<any>(`${this.authService.url}/auth/signin`, this.SignInForm.value).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.SignInForm.reset();
        this.toastService.add({
          severity: 'success',
          summary: 'Sign-in Successfull',
          detail: 'Explore Products',
        });
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        if (err.error == 'User Account deleted') {
          this.toastService.add({
            severity: 'error',
            summary: 'Acount Is Deleted',
          });
        }
        if (err.error == 'Incorrect password')
          this.toastService.add({
            severity: 'error',
            summary: 'Signin-Failed',
            detail: 'please enter correct details',
          });
        console.log(err);
      },
    });
  }
}
