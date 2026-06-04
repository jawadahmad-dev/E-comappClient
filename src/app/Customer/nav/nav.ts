import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-nav',
  imports: [RouterOutlet, RouterLink, AvatarModule, ButtonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  authService = inject(AuthService);
  mobileMenuOpen = false;
}
