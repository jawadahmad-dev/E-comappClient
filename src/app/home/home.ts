import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../Services/auth-service';
import { ResProduct } from '../Interfaces/res-product';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Shared } from '../Services/shared';
import { InputTextModule } from 'primeng/inputtext';
import { NgRatings } from 'ng-ratings';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-home',
  imports: [
    RatingModule,
    SelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TitleCasePipe,
    NgRatings,
    CardModule,
    ButtonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  authService = inject(AuthService);
  sharedService = inject(Shared);
  http = inject(HttpClient);
  toastService = inject(MessageService);
  orgProductsArr: ResProduct[] = [];
  filteredProductsArr: ResProduct[] = [];
  searchVal: string = '';
  pordNotFound: boolean = false;
  categoriesArr: string[] = [];
  selectedCategory: string = '';

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  getProducts() {
    this.http.get<ResProduct[]>(`${this.authService.url}/products/customer/getproducts`).subscribe({
      next: (res) => {
        this.orgProductsArr = res;
        this.filteredProductsArr = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchMethod() {
    this.pordNotFound = true;
    const query = this.searchVal.trim().toLowerCase();
    document.querySelectorAll('.all').forEach((element) => {
      const title = element.querySelector('.title')?.textContent.toLowerCase();
      const desc = element.querySelector('.desc')?.textContent.toLowerCase();

      if (title?.includes(query) || desc?.includes(query)) {
        (element as HTMLElement).style.display = 'block';
        this.pordNotFound = false;
      } else {
        (element as HTMLElement).style.display = 'none';
      }
    });
  }

  getCategories() {
    this.http.get<string[]>(`${this.authService.url}/products/getcategories`).subscribe({
      next: (res) => {
        this.categoriesArr = ['All', ...res];
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  filterByCategory() {
    const query = this.selectedCategory.toLowerCase();
    if (!query || query == 'all') {
      this.filteredProductsArr = this.orgProductsArr;
      return;
    }

    this.filteredProductsArr = this.orgProductsArr.filter(
      (find) => find.category.toLowerCase() === query,
    );
  }
}
