import { Injectable, signal, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  toastService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  public url = 'https://localhost:7211/api';
  public baseUrl = 'https://localhost:7211';
  router = inject(Router);
  isLoggedIn = signal(false);

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  public decodedToken(): any | null {
    const getToken = this.getToken();
    if (!getToken) return null;

    return jwtDecode(getToken);
  }

  public CheckRole(): string {
    const decoded = this.decodedToken();
    return decoded?.role;
  }
  public Claims() {
    return this.decodedToken();
  }

  logout() {
    this.confirmationService.confirm({
      message: 'A you sure to Logout',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Logout',
        severity: 'danger',
      },
      accept: () => {
        localStorage.removeItem('token');
        this.isLoggedIn.set(false);
        this.router.navigate(['/']);

        this.toastService.add({
          severity: 'success',
          summary: 'Logout',
          detail: 'You are loggedOut Successfully',
        });
      },
      reject: () => {
        this.toastService.add({
          severity: 'warn',
          summary: 'Canceled',
          detail: 'Operation Canceled',
        });
      },
    });
  }

  loggedIn() {
    if (localStorage.getItem('token')) {
      this.isLoggedIn.set(true);
    } else {
      this.isLoggedIn.set(false);
    }
  }
}
