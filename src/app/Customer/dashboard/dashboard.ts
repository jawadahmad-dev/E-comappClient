import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Services/auth-service';
import { Order } from '../../Interfaces/order';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HighchartsChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  Highcharts: typeof Highcharts = Highcharts;
  orderArr: Order[] = [];
  chartOptions: Highcharts.Options = {};
  updateFlag = false;

  ngOnInit(): void {
    this.getUserData();
  }

  get uniqueProductCount(): number {
    const productIds = this.orderArr.flatMap(
      (order) => order.orderItems?.map((item) => item.productId) || [],
    );
    return new Set(productIds).size;
  }

  get totalSpent(): number {
    return this.orderArr.reduce((sum, order) => sum + (order.orderTotal || 0), 0);
  }

  getUserData() {
    this.http.get<Order[]>(`${this.authService.url}/orders/getordershistory`).subscribe({
      next: (res) => {
        console.log(res);
        this.orderArr = res;
        if (!res || res.length === 0) {
          this.chartOptions = {
            chart: { type: 'column' },
            title: { text: 'No orders yet' },
            subtitle: { text: 'Start shopping to see your history!' },
          };
          return;
        }

        const statusCounts = res.reduce(
          (acc, order) => {
            const status = order.status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const statusData = Object.entries(statusCounts).map(([name, y]) => ({ name, y }));

        const sortedOrders = [...res].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        const dateCategories = sortedOrders.map((o) => {
          const d = new Date(o.createdAt);
          return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        });
        const spendingData = sortedOrders.map((o) => o.orderTotal || 0);

        const productMap = new Map<string, number>();
        res.forEach((order) => {
          order.orderItems?.forEach((item) => {
            const title = item.resProduct?.title || `Product #${item.productId}`;
            productMap.set(title, (productMap.get(title) || 0) + (item.quantity || 1));
          });
        });
        const productCategories = Array.from(productMap.keys());
        const productQtyData = Array.from(productMap.values());

        this.chartOptions = {
          chart: { type: 'column' },
          title: { text: 'My Order History' },
          subtitle: { text: 'Personal dashboard' },

          xAxis: {
            categories: dateCategories,
            title: { text: 'Order Date' },
            labels: { rotation: -45, style: { fontSize: '10px' } },
          },
          yAxis: [
            {
              title: { text: 'Order Total ($)' },
              labels: { format: '${value}' },
            },
          ],
          tooltip: {
            shared: true,
            formatter: function () {
              return `<b>${this.x}</b><br/>
                      Order Total: $${this.points?.[0]?.y ?? 0}`;
            },
          },
          series: [
            {
              name: 'Spending',
              type: 'line',
              data: spendingData,
              marker: { enabled: true, radius: 4 },
              color: '#3b82f6',
            } as Highcharts.SeriesLineOptions,
          ],

          responsive: {
            rules: [
              {
                condition: { maxWidth: 700 },
                chartOptions: {
                  chart: { type: 'pie' },
                  title: { text: 'Order Status' },
                  series: [
                    {
                      name: 'Orders',
                      type: 'pie',
                      statusData,
                      dataLabels: { format: '{point.name}: {point.y}' },
                    } as Highcharts.SeriesPieOptions,
                  ],
                },
              },
            ],
          },
        };

        this.updateFlag = true;
        setTimeout(() => (this.updateFlag = false), 0);
      },
      error: (err) => console.error('Failed to load orders:', err),
    });
  }
}
