import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import { User } from '../Interfaces/user';
import { HttpClient } from '@angular/common/http';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, TitleCasePipe, RouterLink, ButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  userdata: User | null = null;
  http = inject(HttpClient);
  authService = inject(AuthService);
  showDialoge: boolean = false;

  ngOnInit(): void {
    this.getProfile();
  }

  toggleDialoge() {
    this.showDialoge = !this.showDialoge;
  }
  getProfile() {
    this.http.get<User>(`${this.authService.url}/auth/getuser`).subscribe({
      next: (res) => {
        this.userdata = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  deleteUser() {
    this.http.patch(`${this.authService.url}/auth/deleteuser`, {}).subscribe({
      next: () => {
        this.getProfile();
        localStorage.removeItem('token');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
