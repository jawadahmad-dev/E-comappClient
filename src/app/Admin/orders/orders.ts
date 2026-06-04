import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../Interfaces/order';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-orders',
  imports: [
    NgClass,
    SelectModule,
    IconFieldModule,
    FloatLabelModule,
    RippleModule,
    DatePipe,
    FormsModule,
    CurrencyPipe,
    ButtonModule,
    TagModule,
    TableModule,
    InputIconModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);
  toastService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  orderArr: Order[] = [];
  filterOrderArr: Order[] = [];
  searchValue: string = '';

  filterStatusOptions: string[] = ['All', 'Pending', 'Canceled', 'Rejected', 'Processing'];
  filterStatusValue: string = 'All';
  filterByOrderTimeOptions: string[] = ['All', 'Last 24H', 'Last 3D', 'Last 7D'];
  filterbyTimeValue: string = 'All';

  shownotfoundContent = signal<boolean>(false);
  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.http.get<Order[]>(`${this.authService.url}/orders/getallorders`).subscribe({
      next: (res) => {
        this.orderArr = res;
        this.filterOrderArr = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  UpdateOrder(event: any, status: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        status == 'Rejected'
          ? `Do you want to Reject this Order?`
          : `Do you want to Proceed this Order?`,
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
        severity: status == 'Rejected' ? 'danger' : 'success',
      },
      accept: () => {
        this.http
          .patch(`${this.authService.url}/orders/updatestatus/${event}`, {
            status: status,
          })
          .subscribe({
            next: () => {
              this.toastService.add({
                severity: status == 'Rejected' ? 'warn' : 'success',
                summary: `Order ${status}`,
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

  Search() {
    this.shownotfoundContent.set(true);
    const query = this.searchValue.trim().toLowerCase();

    document.querySelectorAll('.all').forEach((order) => {
      const orderId = order.querySelector('.orderId')?.textContent.toLowerCase();
      const email = order.querySelector('.email')?.textContent.toLowerCase();

      if (orderId?.includes(query) || email?.includes(query)) {
        (order as HTMLElement).style.display = 'table-row';
        this.shownotfoundContent.set(false);
      } else {
        (order as HTMLElement).style.display = 'none';
      }
    });
  }

  filterByStatus() {
    if (this.filterStatusValue.trim().toLowerCase() === 'all') {
      this.orderArr = this.filterOrderArr;
    } else {
      this.orderArr = this.filterOrderArr.filter((item) => {
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
      this.orderArr = this.filterOrderArr;
    } else if (query === 'Last 24H') {
      this.orderArr = this.filterOrderArr.filter((item) => {
        return new Date(item.createdAt).getTime() >= last24Hour;
      });
    } else if (query === 'Last 3D') {
      this.orderArr = this.filterOrderArr.filter((item) => {
        return new Date(item.createdAt).getTime() >= last3Days;
      });
    } else if (query === 'Last 7D') {
      this.orderArr = this.filterOrderArr.filter((item) => {
        return new Date(item.createdAt).getTime() >= last7Days;
      });
    }
  }
}
