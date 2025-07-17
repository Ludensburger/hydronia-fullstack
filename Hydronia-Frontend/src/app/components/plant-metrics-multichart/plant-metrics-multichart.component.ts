import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { SensorData } from '../../types/hydronia';

@Component({
  selector: 'app-plant-metrics-multichart',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './plant-metrics-multichart.component.html',
  styleUrls: ['./plant-metrics-multichart.component.scss'],
})
export class PlantMetricsMultiChartComponent {
  @Input() data: SensorData[] = [];
  @Input() title: string = '';
  @Input() height: string = '260px';

  allMetrics = [
    { key: 'ph', label: 'pH', color: '#3b82f6' },
    { key: 'ec', label: 'EC', color: '#22c55e' },
    { key: 'temperature', label: 'Temperature', color: '#ef4444' },
    { key: 'humidity', label: 'Humidity', color: '#14b8a6' },
    { key: 'tph', label: 'TPH', color: '#eab308' },
  ];
  visibleMetrics = new Set(this.allMetrics.map((m) => m.key));

  toggleMetric(key: string) {
    if (this.visibleMetrics.has(key)) {
      this.visibleMetrics.delete(key);
    } else {
      this.visibleMetrics.add(key);
    }
  }

  getMultiChartSeries() {
    return this.allMetrics
      .filter((m) => this.visibleMetrics.has(m.key))
      .map((m) => ({
        name: m.label,
        data: (this.data || []).map((point) => ({
          x: point.timestamp,
          y: point[m.key as keyof SensorData] as number,
        })),
        color: m.color,
      }));
  }

  getVisibleMetricColors() {
    return this.allMetrics.filter((m) => this.visibleMetrics.has(m.key)).map((m) => m.color);
  }

  yAxisLabelFormatter(val: number): string {
    return val != null ? val.toFixed(2) : '';
  }
}
