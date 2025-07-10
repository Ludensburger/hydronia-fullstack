import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SensorData, CropCycle } from '../../types/hydronia';
import { PlantMetricsChartComponent } from '../../components/plant-metrics-chart/plant-metrics-chart.component';
import { HealthStatusIndicatorComponent } from '../../components/health-status-indicator/health-status-indicator.component';
import { GrowthDataTableComponent } from '../../components/growth-data-table/growth-data-table.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PlantMetricsChartComponent,
    HealthStatusIndicatorComponent,
    GrowthDataTableComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  selectedTimeRange = '7d';
  selectedRow = 'all';

  timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  rows = [
    { value: 'all', label: 'All Rows' },
    { value: 'row-1', label: 'Row 1' },
    { value: 'row-2', label: 'Row 2' },
    { value: 'row-3', label: 'Row 3' },
    { value: 'row-4', label: 'Row 4' },
  ];

  // Mock sensor data for different time periods
  sensorHistory: SensorData[] = [
    {
      pH: 6.2,
      ec: 1.8,
      temperature: 24.5,
      humidity: 65,
      tph: 0.02,
      timestamp: new Date('2024-01-01T08:00:00'),
    },
    {
      pH: 6.1,
      ec: 1.7,
      temperature: 24.2,
      humidity: 63,
      tph: 0.021,
      timestamp: new Date('2024-01-01T12:00:00'),
    },
    {
      pH: 6.3,
      ec: 1.9,
      temperature: 24.8,
      humidity: 67,
      tph: 0.019,
      timestamp: new Date('2024-01-01T16:00:00'),
    },
    {
      pH: 6.0,
      ec: 1.6,
      temperature: 24.0,
      humidity: 62,
      tph: 0.022,
      timestamp: new Date('2024-01-01T20:00:00'),
    },
    {
      pH: 6.4,
      ec: 2.0,
      temperature: 25.0,
      humidity: 68,
      tph: 0.018,
      timestamp: new Date('2024-01-02T08:00:00'),
    },
    {
      pH: 6.2,
      ec: 1.8,
      temperature: 24.6,
      humidity: 66,
      tph: 0.02,
      timestamp: new Date('2024-01-02T12:00:00'),
    },
    {
      pH: 6.1,
      ec: 1.7,
      temperature: 24.3,
      humidity: 64,
      tph: 0.021,
      timestamp: new Date('2024-01-02T16:00:00'),
    },
    {
      pH: 6.3,
      ec: 1.9,
      temperature: 24.9,
      humidity: 67,
      tph: 0.019,
      timestamp: new Date('2024-01-02T20:00:00'),
    },
  ];

  cropCycles: CropCycle[] = [
    {
      id: '1',
      name: 'Buttercrunch Lettuce Batch #3',
      startDate: new Date('2024-01-01'),
      expectedHarvestDate: new Date('2024-01-31'),
      currentDay: 15,
      totalDays: 30,
      status: 'active',
    },
    {
      id: '2',
      name: 'Romaine Lettuce Batch #2',
      startDate: new Date('2023-12-15'),
      expectedHarvestDate: new Date('2024-01-15'),
      currentDay: 30,
      totalDays: 30,
      status: 'completed',
    },
    {
      id: '3',
      name: 'Iceberg Lettuce Batch #1',
      startDate: new Date('2023-11-01'),
      expectedHarvestDate: new Date('2023-12-01'),
      currentDay: 30,
      totalDays: 30,
      status: 'completed',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Component initialization
  }

  goBack() {
    this.router.navigate(['/farmer-dashboard']);
  }

  exportData() {
    // Implementation for exporting data
    console.log('Exporting data...');
  }

  updateTimeRange(range: string) {
    this.selectedTimeRange = range;
    // Update charts and data based on selected time range
  }

  updateRowSelection(row: string) {
    this.selectedRow = row;
    // Filter data based on selected row
  }

  // Calculate averages for the selected time period
  get averageMetrics() {
    const data = this.sensorHistory;
    if (data.length === 0) return null;

    const sum = data.reduce(
      (acc, curr) => ({
        pH: acc.pH + curr.pH,
        ec: acc.ec + curr.ec,
        temperature: acc.temperature + curr.temperature,
        humidity: acc.humidity + curr.humidity,
        tph: acc.tph + curr.tph,
      }),
      { pH: 0, ec: 0, temperature: 0, humidity: 0, tph: 0 }
    );

    return {
      pH: (sum.pH / data.length).toFixed(1),
      ec: (sum.ec / data.length).toFixed(1),
      temperature: (sum.temperature / data.length).toFixed(1),
      humidity: (sum.humidity / data.length).toFixed(1),
      tph: (sum.tph / data.length).toFixed(3),
    };
  }

  // Get trend direction for metrics
  getTrend(metric: keyof SensorData): string {
    const data = this.sensorHistory;
    if (data.length < 2) return 'stable';

    const latest = data[data.length - 1][metric] as number;
    const previous = data[data.length - 2][metric] as number;

    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'stable';
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }

  getProgressPercentage(cycle: CropCycle): number {
    return Math.round((cycle.currentDay / cycle.totalDays) * 100);
  }
}
