import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensorData } from '../../types/hydronia';

@Component({
  selector: 'app-plant-metrics-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plant-metrics-chart.component.html',
  styleUrls: ['./plant-metrics-chart.component.scss'],
})
export class PlantMetricsChartComponent implements OnInit {
  @Input() data: SensorData[] = [];
  @Input() selectedMetric: string = 'pH';
  @Input() timeRange: string = '7d';
  @Input() height: string = '300px';
  @Input() title: string = 'Plant Metrics';

  metrics = [
    { key: 'pH', label: 'pH Level', color: 'blue', unit: '' },
    { key: 'ec', label: 'EC Level', color: 'green', unit: 'mS/cm' },
    { key: 'temperature', label: 'Temperature', color: 'orange', unit: '°C' },
    { key: 'humidity', label: 'Humidity', color: 'purple', unit: '%' },
    { key: 'tph', label: 'TPH', color: 'red', unit: '' },
  ];

  constructor() {}

  ngOnInit(): void {}

  get currentMetric() {
    return (
      this.metrics.find((m) => m.key === this.selectedMetric) || this.metrics[0]
    );
  }

  get chartData() {
    return this.data.map((point) => ({
      timestamp: point.timestamp,
      value: point[this.selectedMetric as keyof SensorData] as number,
    }));
  }

  get minValue() {
    return Math.min(...this.chartData.map((d) => d.value));
  }

  get maxValue() {
    return Math.max(...this.chartData.map((d) => d.value));
  }

  getPointPosition(value: number, index: number) {
    const range = this.maxValue - this.minValue;
    const normalizedValue = range === 0 ? 0 : (value - this.minValue) / range;
    const y = (1 - normalizedValue) * 80 + 10; // 10% padding top/bottom
    const x = (index / (this.chartData.length - 1)) * 90 + 5; // 5% padding left/right
    return { x, y };
  }

  formatValue(value: number): string {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return `${value.toFixed(1)}${this.currentMetric.unit}`;
  }

  getColorClass(metric: string): string {
    const colorMap: { [key: string]: string } = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      purple: 'text-purple-600',
      red: 'text-red-600',
    };
    return colorMap[metric] || 'text-gray-600';
  }

  getStrokeColor(metric: string): string {
    const colorMap: { [key: string]: string } = {
      blue: '#2563eb',
      green: '#16a34a',
      orange: '#ea580c',
      purple: '#9333ea',
      red: '#dc2626',
    };
    return colorMap[metric] || '#6b7280';
  }

  getLinePath(): string {
    if (this.chartData.length < 2) return '';

    const points = this.chartData.map((point, index) => {
      const pos = this.getPointPosition(point.value, index);
      return `${pos.x},${pos.y}`;
    });

    return `M ${points.join(' L ')}`;
  }
}
