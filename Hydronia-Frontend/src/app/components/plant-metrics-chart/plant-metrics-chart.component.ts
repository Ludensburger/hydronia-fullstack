import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensorData } from '../../types/hydronia';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexStroke, ApexTooltip } from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  colors: string[];
  tooltip: ApexTooltip;
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
  @Input() metrics: any[] = [
    { key: 'pH', label: 'pH Level', color: '#2563eb', unit: '' },
    { key: 'ec', label: 'EC Level', color: '#16a34a', unit: 'mS/cm' },
    { key: 'temperature', label: 'Temperature', color: '#ea580c', unit: '°C' },
    { key: 'humidity', label: 'Humidity', color: '#9333ea', unit: '%' },
    { key: 'tph', label: 'TPH', color: '#dc2626', unit: '' },
  ];

  chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false }
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false }
    },
    yaxis: {
      title: { text: '' }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#3b82f6'],
    tooltip: {
      x: { format: 'dd MMM yyyy HH:mm' }
    }
  };

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

  updateChart(): void {
    this.currentMetric = this.metrics.find((m) => m.key === this.selectedMetric) || this.metrics[0];
    // Map 'pH' to 'ph' for SensorData property access
    const metricKey = this.selectedMetric === 'pH' ? 'ph' : this.selectedMetric;
    const data = (this.data || [])
      .filter(point => point.timestamp)
      .map(point => ({
        x: new Date(String(point.timestamp)),
        y: point[metricKey as keyof SensorData] as number
      }));

    this.chartSeries = [
      {
        name: this.currentMetric?.label || '',
        data
      }
    ];

    this.chartOptions = {
      ...this.chartOptions,
      chart: {
        ...this.chartOptions.chart,
        height: this.height
      },
      yaxis: {
        ...this.chartOptions.yaxis,
        title: { text: this.currentMetric?.label || '' }
      },
      colors: [this.currentMetric?.color || '#3b82f6'],
      series: this.chartSeries
    };
  }

  hasInvalidYValues(): boolean {
    if (!this.chartSeries || this.chartSeries.length === 0) return false;
    const series = this.chartSeries[0];
    if (!series || !Array.isArray((series as any).data)) return false;
    return ((series as any).data as any[]).some((d) => d.y === null || d.y === undefined);
  }

  formatValue(value: number): string {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return `${value.toFixed(1)}${this.currentMetric.unit}`;
  }

  getStrokeColor(metricColor: string): string {
    return metricColor || '#3b82f6';
  }
}