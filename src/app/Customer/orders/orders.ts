import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Services/auth-service';
import { Order } from '../../Interfaces/order';
import { TableModule } from 'primeng/table';
import { AsyncPipe, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { Loading } from '../../Services/loading';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-orders',
  imports: [
    AsyncPipe,
    TableModule,
    FormsModule,
    RouterLink,
    CurrencyPipe,
    DialogModule,
    ButtonModule,
    DatePipe,
    NgClass,
    FloatLabelModule,
    IconFieldModule,
    SelectModule,
    InputIconModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  loadingService = inject(Loading);
  authService = inject(AuthService);
  toastService = inject(MessageService);
  http = inject(HttpClient);
  ordersArr: Order[] = [];
  temOrdersArr: Order[] = [];
  dialogVisible: boolean = false;
  confirmDialog = inject(ConfirmationService);
  filterStatusOptions: string[] = ['All', 'Pending', 'Canceled', 'Rejected', 'Processing'];
  filterStatusValue: string = '';
  filterByOrderTimeOptions: string[] = ['All', 'Last 24H', 'Last 3D', 'Last 7D'];
  filterbyTimeValue: string = '';

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.http.get<Order[]>(`${this.authService.url}/orders/myorders`).subscribe({
      next: (res) => {
        this.ordersArr = res;
        this.temOrdersArr = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showDialog() {
    this.dialogVisible = true;
  }

  CancelOrder(event: any) {
    console.log(event);
    this.confirmDialog.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to Cancel this Order?',
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
        this.http
          .patch(`${this.authService.url}/orders/updatestatus/${event}`, {
            status: 'Canceled',
          })
          .subscribe({
            next: () => {
              this.toastService.add({
                severity: 'warn',
                summary: 'Order Canceled',
              });
              this.getOrders();
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

  filterByStatus() {
    if (this.filterStatusValue.trim().toLowerCase() === 'all') {
      this.ordersArr = this.temOrdersArr;
    } else {
      this.ordersArr = this.temOrdersArr.filter((item) => {
        return item.status.trim().toLowerCase() === this.filterStatusValue.trim().toLowerCase();
      });
    }
  }

  filterByTime() {
    const query = this.filterbyTimeValue;
    const currentTime = new Date().getTime();
    const last24Hour = new Date(currentTime - 24 * 60 * 60 * 1000).getTime();
    const last3Days = new Date(currentTime - 3 * 24 * 60 * 60 * 1000).getTime();
    const last7Days = new Date(currentTime - 7 * 24 * 60 * 60 * 1000).getTime();

    if (query === 'All') {
      this.ordersArr = this.temOrdersArr;
    } else if (query === 'Last 24H') {
      this.ordersArr = this.temOrdersArr.filter((item) => {
        return new Date(item.createdAt).getTime() >= last24Hour;
      });
    } else if (query === 'Last 3D') {
      this.ordersArr = this.temOrdersArr.filter((item) => {
        return new Date(item.createdAt).getTime() >= last3Days;
      });
    } else if (query === 'Last 7D') {
      this.ordersArr = this.temOrdersArr.filter((item) => {
        return new Date(item.createdAt).getTime() >= last7Days;
      });
    }
  }
  pordNotFound: boolean = false;
  searchVal: string = '';

  searchMethod() {
    this.pordNotFound = true;
    const query = this.searchVal.trim().toLowerCase();
    document.querySelectorAll('.all').forEach((element) => {
      const orderId = element.querySelector('.orderId')?.textContent.toLowerCase();

      if (orderId?.includes(query)) {
        (element as HTMLElement).style.display = 'table-row';
        this.pordNotFound = false;
      } else {
        (element as HTMLElement).style.display = 'none';
      }
    });
  }
}
