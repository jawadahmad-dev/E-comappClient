import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Services/auth-service';
import { User } from '../../Interfaces/user';
import { DatePipe, NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-users',
  imports: [NgClass, DatePipe, TableModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  usersArr: User[] = [];
  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    this.http.get<User[]>(`${this.authService.url}/auth/getusers`).subscribe({
      next: (res) => {
        console.log(res);
        this.usersArr = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
