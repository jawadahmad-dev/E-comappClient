import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-nav',
  imports: [RouterOutlet, RouterLink, AvatarModule, ButtonModule, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  authService = inject(AuthService);
  isMobileMenuOpen = false;
}
