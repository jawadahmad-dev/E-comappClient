import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';

export const customerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.CheckRole() === 'customer') {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
