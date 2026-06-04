import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Services/auth-service';
import { Pnl } from '../../Interfaces/pnl';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HighchartsChartComponent, CardModule, TableModule, TagModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  Highcharts: typeof Highcharts = Highcharts;

  salesArr: Pnl[] = [];
  isLoading = true;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;

  get totalSold(): string {
    return this.salesArr.reduce((sum, p) => sum + (p.sellItemsQty || 0), 0).toLocaleString();
  }
  get totalProfit(): string {
    return this.salesArr.reduce((sum, p) => sum + (p.profitnLoss || 0), 0).toLocaleString();
  }
  get topProduct(): string {
    return this.salesArr.length > 0 ? this.salesArr[0].resProduct?.title : 'N/A';
  }
  get avgProfitPerProduct(): string {
    return this.salesArr.length > 0
      ? Math.round(
          this.salesArr.reduce((sum, p) => sum + (p.profitnLoss || 0), 0) / this.salesArr.length,
        ).toLocaleString()
      : '0';
  }

  ngOnInit(): void {
    this.getSalesData();
  }

  getSalesData(): void {
    this.isLoading = true;
    this.http.get<Pnl[]>(`${this.authService.url}/orders/getpnldata`).subscribe({
      next: (res) => {
        console.log(res);
        this.salesArr = res;
        this.buildCharts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load PnL data:', err);
        this.isLoading = false;
      },
    });
  }

  private buildCharts(): void {
    if (this.salesArr.length === 0) {
      this.chartOptions = {
        chart: { type: 'column' },
        title: { text: 'No sales data available' },
        subtitle: { text: 'Data will appear once orders are processed' },
      };
      return;
    }

    const categories = this.salesArr.map((p) => p.resProduct?.title || `Product #${p.productId}`);
    const qtyData = this.salesArr.map((p) => p.sellItemsQty || 0);
    const profitData = this.salesArr.map((p) => p.profitnLoss || 0);

    this.chartOptions = {
      chart: { type: 'column' },
      title: { text: 'Product Performance Overview' },
      subtitle: { text: 'Sales quantity vs Profit/Loss per product' },
      xAxis: {
        categories,
        title: { text: 'Products' },
        labels: { rotation: -45, style: { fontSize: '11px' } },
      },
      yAxis: [
        { title: { text: 'Quantity Sold' }, min: 0 },
        { title: { text: 'Profit / Loss ($)' }, opposite: true, min: 0 },
      ],
      tooltip: { shared: true },
      legend: { enabled: true },
      series: [
        { name: 'Quantity Sold', type: 'column', data: qtyData, yAxis: 0, color: '#3b82f6' },
        {
          name: 'Profit / Loss',
          type: 'line',
          data: profitData,
          yAxis: 1,
          color: '#10b981',
          marker: { enabled: true, radius: 5 },
        },
      ] as Highcharts.SeriesOptionsType[],
    };

    // Force Highcharts to re-render
    this.updateFlag = true;
    setTimeout(() => (this.updateFlag = false), 0);
  }
}
