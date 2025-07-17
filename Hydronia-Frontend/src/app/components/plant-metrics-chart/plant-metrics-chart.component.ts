import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensorData } from '../../types/hydronia';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexStroke, ApexTooltip, ApexDataLabels } from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  colors: string[];
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-plant-metrics-chart',
  templateUrl: './plant-metrics-chart.component.html',
  styleUrls: ['./plant-metrics-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
})
export class PlantMetricsChartComponent implements OnInit, OnChanges {
  @Input() data: SensorData[] = [];
  @Input() selectedMetric: string = 'pH';
  @Input() timeRange: string = '7d';
  @Input() height: string = '300px';
  @Input() title: string = 'Plant Metrics';

  metrics = [
    { key: 'pH', label: 'pH Level', color: '#2563eb', unit: '' },
    { key: 'ec', label: 'EC Level', color: '#16a34a', unit: 'mS/cm' },
    { key: 'temperature', label: 'Temperature', color: '#ea580c', unit: '°C' },
    { key: 'humidity', label: 'Humidity', color: '#9333ea', unit: '%' },
    { key: 'tph', label: 'TPH', color: '#dc2626', unit: '' },
  ];

  chartOptions: Partial<ChartOptions> = {};
  chartSeries: ApexAxisChartSeries = [];
  currentMetric: any = this.metrics[0];

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMetric'] || changes['data']) {
      this.updateChart();
    }
  }

  updateChart() {
    this.currentMetric = this.metrics.find((m) => m.key === this.selectedMetric) || this.metrics[0];
    const data = (this.data || [])
      .filter(point => point.timestamp)
      .map(point => ({
        x: new Date(String(point.timestamp)),
        y: point[this.selectedMetric as keyof SensorData] as number
      }));

    this.chartSeries = [
      {
        name: this.currentMetric?.label || '',
        data
      }
    ];

    this.chartOptions = {
      chart: {
        type: 'line',
        height: this.height,
        toolbar: { show: false }
      },
      xaxis: {
        type: 'datetime',
        labels: { datetimeUTC: false }
      },
      yaxis: {
        title: { text: this.currentMetric?.label || '' }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: [this.currentMetric?.color || '#3b82f6'],
      tooltip: {
        x: { format: 'dd MMM yyyy HH:mm' }
      },
      dataLabels: { enabled: false }
    };
  }

  formatValue(value: number): string {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return `${value.toFixed(1)}${this.currentMetric.unit}`;
  }

  getStrokeColor(metricColor: string): string {
    return metricColor || '#3b82f6';
  }
}
