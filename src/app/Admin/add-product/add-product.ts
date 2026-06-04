import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Services/auth-service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { createProduct } from '../../Interfaces/createProduct';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { NgRatings } from 'ng-ratings';
import { RouterLink } from '@angular/router';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SelectModule } from 'primeng/select';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Loading } from '../../Services/loading';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-add-product',
  imports: [
    AsyncPipe,
    ButtonModule,
    SelectModule,
    TableModule,
    NgRatings,
    InputIconModule,
    ReactiveFormsModule,
    FileUploadModule,
    FloatLabelModule,
    InputTextModule,
    RatingModule,
    TagModule,
    TableModule,
    ButtonModule,
    FormsModule,
    CurrencyPipe,
    RouterLink,
    IconFieldModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct implements OnInit {
  loadingService = inject(Loading);
  AddProductForm!: FormGroup;
  toastService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  authService = inject(AuthService);
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  productsData = signal<createProduct[]>([]);
  temProductsData = signal<createProduct[]>([]);
  selectedFile: File | null = null;
  productId: number = 0;
  isEditingProduct: boolean = false;
  showForm: boolean = false;
  searchVal: string = '';
  pordNotFound: boolean = false;
  catgoriesList: string[] = [];
  selectedCategory: string = '';

  toggleForm() {
    this.showForm = !this.showForm;
  }
  ngOnInit(): void {
    this.formInit();
    this.getProducts();
    this.selectedFile = null;
    this.getCategoriesList();
  }

  formInit() {
    this.AddProductForm = this.fb.group(
      {
        title: ['', Validators.required],
        description: ['', Validators.required],
        imageUrl: [null, Validators.required],
        category: ['', Validators.required],
        price: ['', Validators.required],
        sellingPrice: ['', [Validators.required]],
        stock: ['', Validators.required],
      },
      {
        validators: this.sellNBuyPriceValidator,
      },
    );
  }

  sellNBuyPriceValidator(group: AbstractControl) {
    const buyPrice = Number(group.get('price')?.value);
    const sellingPrice = Number(group.get('sellingPrice')?.value);

    if (buyPrice > sellingPrice) {
      return { sellingPriceTooLow: true };
    } else {
      return null;
    }
  }

  getProducts() {
    this.http.get<createProduct[]>(`${this.authService.url}/products/admin/getproducts`).subscribe({
      next: (res) => {
        this.productsData.set(res);
        this.temProductsData.set(res);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  Edit(id: number) {
    console.log(id);
    this.productId = id;
    this.isEditingProduct = true;
    this.http.get<createProduct>(`${this.authService.url}/products/getproduct/${id}`).subscribe({
      next: (res) => {
        if (!res) return;
        this.patchValues(res);
        this.showForm = true;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  patchValues(productData: createProduct) {
    this.AddProductForm.patchValue({
      title: productData.title,
      description: productData.description,
      category: productData.category,
      imageUrl: productData.imageUrl,
      price: productData.price,
      stock: productData.stock,
      sellingPrice: productData.sellingPrice,
    });
  }

  Delete(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to Delete this Product?`,
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirm',
        severity: 'danger',
      },
      accept: () => {
        this.http.delete(`${this.authService.url}/products/delete/${event}`).subscribe({
          next: () => {
            this.getProducts();
          },

          error: (err) => {
            console.log(err);
          },
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

  onSubmit() {
    if (this.AddProductForm.invalid) return;

    const payload = new FormData();
    payload.append('title', this.AddProductForm.value.title);
    payload.append('description', this.AddProductForm.value.description);
    payload.append('category', this.AddProductForm.value.category);
    payload.append('stock', this.AddProductForm.value.stock);
    if (this.selectedFile) {
      payload.append('imageUrl', this.selectedFile);
    }
    payload.append('price', this.AddProductForm.value.price);
    payload.append('sellingPrice', this.AddProductForm.value.sellingPrice);

    if (this.isEditingProduct) {
      this.http
        .put(`${this.authService.url}/products/updateproduct/${this.productId}`, payload)
        .subscribe({
          next: () => {
            this.showForm = false;
            this.isEditingProduct = false;
            this.getProducts();
            this.AddProductForm.reset();
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.http.post(`${this.authService.url}/products/addproduct`, payload).subscribe({
        next: () => {
          this.showForm = false;
          this.getProducts();
          this.AddProductForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.AddProductForm.patchValue({ imageUrl: file });
    }
  }

  searchMethod() {
    this.pordNotFound = true;
    const query = this.searchVal.trim().toLowerCase();
    document.querySelectorAll('.all').forEach((element) => {
      const title = element.querySelector('.title')?.textContent.toLowerCase();
      const category = element.querySelector('.category')?.textContent.toLowerCase();

      if (title?.includes(query) || category?.includes(query)) {
        (element as HTMLElement).style.display = 'table-row';
        this.pordNotFound = false;
      } else {
        (element as HTMLElement).style.display = 'none';
      }
    });
  }

  getCategoriesList() {
    this.http.get<string[]>(`${this.authService.url}/products/getcategories`).subscribe({
      next: (res) => {
        this.catgoriesList = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  filterByCategory() {
    const query = this.selectedCategory.trim().toLowerCase();
    if (!query || query == 'all') {
      this.productsData.set(this.temProductsData());
      return;
    }

    this.productsData.set(
      this.temProductsData().filter((find) => find.category.trim().toLowerCase() === query),
    );
  }
}
