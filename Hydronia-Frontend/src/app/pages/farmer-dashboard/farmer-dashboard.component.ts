import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlantMetricsChartComponent } from '../../components/plant-metrics-chart/plant-metrics-chart.component';
import { PlantMetricsMultiChartComponent } from '../../components/plant-metrics-multichart/plant-metrics-multichart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import type {
  SensorData,
  Alert,
  Prediction,
  PlantImage,
} from '../../types/hydronia';
@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, PlantMetricsChartComponent, PlantMetricsMultiChartComponent, NgApexchartsModule],
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss'],
})
export class FarmerDashboardComponent implements OnInit {
  // Metric display options
  metricDisplayMode: 'latest' | 'average' | 'recent5' | 'recent10' | 'custom' = 'latest';
  customMetricCount: number = 5;
  // Get value for a metric based on display mode
  getMetricValue(metric: keyof SensorData): number | null {
    if (!this.historicalSensorData.length) return null;
    let data = this.historicalSensorData;
    let count = 0;
    if (this.metricDisplayMode === 'latest') {
      const val = data[data.length - 1]?.[metric];
      return typeof val === 'number' ? val : null;
    }
    if (this.metricDisplayMode === 'recent5') count = 5;
    else if (this.metricDisplayMode === 'recent10') count = 10;
    else if (this.metricDisplayMode === 'custom') count = this.customMetricCount;
    if (count > 0) data = data.slice(-count);
    const values = data.map(d => d[metric]).filter(v => typeof v === 'number');
    if (!values.length) return null;
    return values.reduce((a, b) => a + (b as number), 0) / values.length;
  }
  // Returns the color (as a CSS color string) for a given metric key, using the value from getMetricValue
getMetricColor(metric: keyof SensorData): string {
  const val = this.getMetricValue(metric);
  switch (metric) {
    case 'ph':
      return val == null ? '' : val < 6.0 ? '#eab308' : val > 6.5 ? '#8b5cf6' : '#16a34a';
    case 'ec':
      return val == null ? '' : val < 1.2 ? '#f97316' : val > 2.2 ? '#7c3aed' : '#16a34a';
    case 'tph':
      return val == null ? '' : val < 500 ? '#facc15' : val > 800 ? '#ec4899' : '#16a34a';
    case 'temperature':
      return val == null ? '' : val < 20 ? '#3b82f6' : val > 25 ? '#ef4444' : '#16a34a';
    case 'humidity':
      return val == null ? '' : val < 60 ? '#ef4444' : val > 70 ? '#3b82f6' : '#16a34a';
    default:
      return '';
  }
}
  // Returns the optimal/safe range label for a given metric key
  getMetricRangeLabel(metric: keyof SensorData): string {
    switch (metric) {
      case 'ph':
        return 'Optimal: 6.0-6.5';
      case 'temperature':
        return 'Optimal: 20-25°C';
      case 'humidity':
        return 'Optimal: 60-70%';
      case 'tph':
        return 'Safe: <0.1';
      case 'ec':
        return 'Optimal: 1.2-2.2 mS/cm';
      default:
        return '';
    }
  }
  // Color and icon helpers for each metric
  getPhColor(val: number|null): string {
    if (val == null) return '';
    if (val < 6.0) return 'text-yellow-400'; // 🍋 Yellow #eab308
    if (val > 6.5) return 'text-purple-500'; // 💜 Purple #8b5cf6
    return 'text-green-600'; // ✅ Green #16a34a
  }
  getPhIcon(val: number|null): 'down'|'up'|null {
    if (val == null) return null;
    if (val < 6.0) return 'down';
    if (val > 6.5) return 'up';
    return null;
  }
  // Temperature: blue for low, red for high
  getTempColor(val: number|null): string {
    if (val == null) return '';
    if (val < 20) return 'text-blue-600'; // Low temp = blue
    if (val > 25) return 'text-red-600'; // High temp = red
    return 'text-green-600';
  }
  getTempIcon(val: number|null): 'down'|'up'|null {
    if (val == null) return null;
    if (val < 20) return 'down'; // Down arrow for low
    if (val > 25) return 'up';   // Up arrow for high
    return null;
  }
  // Humidity: red for low, blue for high
  getHumidityColor(val: number|null): string {
    if (val == null) return '';
    if (val < 60) return 'text-red-600'; // Low humidity = red
    if (val > 70) return 'text-blue-600'; // High humidity = blue
    return 'text-green-600';
  }
  getHumidityIcon(val: number|null): 'down'|'up'|null {
    if (val == null) return null;
    if (val < 60) return 'down'; // Down arrow for low
    if (val > 70) return 'up';   // Up arrow for high
    return null;
  }
  // TPH (Total Particulate Hydrocarbons) - now using ppm, safe: 500–800 ppm
  getTphColor(val: number | null): string {
    if (val == null) return '';
    if (val < 500) return 'text-amber-400'; // 🟡 Amber #facc15
    if (val >= 500 && val <= 800) return 'text-green-600'; // ✅ Green #16a34a
    if (val > 800) return 'text-pink-400';  // 🩷 Pink #ec4899
    return '';
  }
  getTphIcon(val: number | null): 'down' | 'up' | null {
    if (val == null) return null;
    if (val < 500) return 'down'; // Down arrow for below safe
    if (val > 800) return 'up';   // Up arrow for above safe
    return null; // No icon if within safe range
  }
  getEcColor(val: number|null): string {
    if (val == null) return '';
    if (val < 1.2) return 'text-orange-500'; // 🧡 Orange #f97316
    if (val > 2.2) return 'text-violet-600'; // 🟪 Violet #7c3aed
    return 'text-green-600'; // ✅ Green #16a34a
  }
  getEcIcon(val: number|null): 'down'|'up'|null {
    if (val == null) return null;
    if (val < 1.2) return 'down';
    if (val > 2.2) return 'up';
    return null;
  }
  // For PlantMetricsChartComponent
  historicalSensorData: SensorData[] = [];
  selectedMetric: string = 'pH';
  public plantImages: PlantImage[] = [];
  public manualLogs: any[] = [];
  public loadingImages = false;
  public loadingLogs = false;
  user$!: Observable<any>;
  selectedRow = 'row-1';
  activeTab = 'monitoring';
  rows = ['Row 1', 'Row 2', 'Row 3', 'Row 4'];
  tabs = [
    { id: 'monitoring', label: 'Live Monitoring' },
    { id: 'images', label: 'Plant Images' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'predictions', label: 'Predictions' },
    { id: 'logs', label: 'Manual Logs' },
  ];
  sensorData: SensorData | null = null;
  alerts: Alert[] = [
    {
      id: '1',
      type: 'sensor',
      severity: 'medium',
      title: 'pH Level Alert',
      description: 'pH in Row 3 has dropped to 5.8. Optimal range is 6.0-6.5',
      timestamp: '10 minutes ago',
      acknowledged: false,
    },
    {
      id: '2',
      type: 'prediction',
      severity: 'low',
      title: 'Nutrient Depletion Forecast',
      description:
        'EC levels may drop below optimal in 3-4 days based on current trends',
      timestamp: '2 hours ago',
      acknowledged: false,
    },
  ];
  predictions: Prediction[] = [
    {
      type: 'nutrient_depletion',
      timeframe: '3-4 days',
      confidence: 78,
      description: 'Electrical conductivity may drop below optimal levels',
      recommendations: ['Prepare nutrient solution', 'Schedule system check'],
    },
    {
      type: 'fungal_risk',
      timeframe: '1 week',
      confidence: 23,
      description: 'Low risk of fungal development based on current conditions',
      recommendations: [
        'Continue current ventilation',
        'Monitor humidity levels',
      ],
    },
  ];
  // For multi-metric chart toggles
  allMetrics = [
    { key: 'ph', label: 'pH', color: '#3b82f6' },
    { key: 'ec', label: 'EC', color: '#22c55e' },
    { key: 'temperature', label: 'Temperature', color: '#ef4444' },
    { key: 'humidity', label: 'Humidity', color: '#14b8a6' },
    { key: 'tph', label: 'TPH', color: '#eab308' },
  ];
  visibleMetrics = new Set(this.allMetrics.map((m) => m.key));
  constructor(
    private auth: AuthService,
    private router: Router,
    private api: ApiService
  ) {}
  // Refresh button handler
  public refreshDashboard() {
    this.fetchAllData();
    this.fetchHistoricalSensorData();
  }
  ngOnInit() {
    this.user$ = this.auth.currentUser$;
    this.fetchAllData();
    this.fetchHistoricalSensorData();
  }
  fetchAllData() {
    const rowNum = this.getSelectedRowNumber();
    const cycleNum = 1; // Default cycle, adjust as needed
    // Sensor Data
    this.api.getSensorReadings(rowNum, cycleNum).subscribe({
      next: (data) => {
        this.sensorData = data && data.length > 0 ? data[0] : null;
      },
      error: (err) => {
        console.error('Failed to fetch sensor data', err);
        this.sensorData = null;
      },
    });
    // Plant Images
    this.loadingImages = true;
    this.api.getPlantImages(rowNum, cycleNum).subscribe({
      next: (data) => {
        this.plantImages = data || [];
        this.loadingImages = false;
      },
      error: (err) => {
        console.error('Failed to fetch plant images', err);
        this.plantImages = [];
        this.loadingImages = false;
      },
    });
    // Manual Logs
    this.loadingLogs = true;
    this.api.getManualLogs(rowNum, cycleNum).subscribe({
      next: (data) => {
        this.manualLogs = data || [];
        this.loadingLogs = false;
      },
      error: (err) => {
        console.error('Failed to fetch manual logs', err);
        this.manualLogs = [];
        this.loadingLogs = false;
      },
    });
    // Historical sensor data for chart
    this.fetchHistoricalSensorData();
  }
  fetchHistoricalSensorData() {
    const rowNum = this.getSelectedRowNumber();
    const cycleNum = 1; // Default cycle, adjust as needed
    console.log(
      '[fetchHistoricalSensorData] Selected row:',
      this.selectedRow,
      'Row number:',
      rowNum,
      'Cycle:',
      cycleNum
    );
    this.api.getSensorReadings(rowNum, cycleNum).subscribe({
      next: (data) => {
        console.log('[fetchHistoricalSensorData] Received sensor data:', data);
        this.historicalSensorData =
          data && data.length > 0
            ? [...data].sort((a, b) => {
                const ta = new Date(a.timestamp || '').getTime();
                const tb = new Date(b.timestamp || '').getTime();
                return ta - tb;
              })
            : [];
      },
      error: (err) => {
        console.error('Failed to fetch historical sensor data', err);
        this.historicalSensorData = [];
      },
    });
  }
  getSelectedRowNumber(): number {
    // Assumes selectedRow is like 'row-1', 'row-2', etc.
    const match = this.selectedRow.match(/row-(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
  setSelectedRow(row: string) {
    this.selectedRow = row;
    this.fetchAllData();
    this.fetchHistoricalSensorData();
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  getUnacknowledgedAlerts() {
    return this.alerts.filter((alert) => !alert.acknowledged).length;
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  switchToDevView() {
    this.router.navigate(['/dev-dashboard']);
  }
  navigateToPlantGallery() {
    this.router.navigate(['/plant-gallery']);
  }
  navigateToAnalytics() {
    this.router.navigate(['/analytics']);
  }
  toggleMetric(key: string) {
    if (this.visibleMetrics.has(key)) {
      this.visibleMetrics.delete(key);
    } else {
      this.visibleMetrics.add(key);
    }
  }
  // Helper methods for optimal/critical value coloring
  isPhOptimal(): boolean {
    return this.sensorData?.ph !== undefined && this.sensorData.ph >= 6.0 && this.sensorData.ph <= 6.5;
  }
  isPhCritical(): boolean {
    return this.sensorData?.ph !== undefined && (this.sensorData.ph < 6.0 || this.sensorData.ph > 6.5);
  }
  isTempOptimal(): boolean {
    return this.sensorData?.temperature !== undefined && this.sensorData.temperature >= 20 && this.sensorData.temperature <= 25;
  }
  isTempCritical(): boolean {
    return this.sensorData?.temperature !== undefined && (this.sensorData.temperature < 20 || this.sensorData.temperature > 25);
  }
  isHumidityOptimal(): boolean {
    return this.sensorData?.humidity !== undefined && this.sensorData.humidity >= 60 && this.sensorData.humidity <= 70;
  }
  isHumidityCritical(): boolean {
    return this.sensorData?.humidity !== undefined && (this.sensorData.humidity < 60 || this.sensorData.humidity > 70);
  }
  isTphOptimal(): boolean {
    return this.sensorData?.tph !== undefined && this.sensorData.tph >= 500 && this.sensorData.tph <= 800;
  }
  isTphCritical(): boolean {
    return this.sensorData?.tph !== undefined && (this.sensorData.tph < 500 || this.sensorData.tph > 800);
  }
  isEcOptimal(): boolean {
    return this.sensorData?.ec !== undefined && this.sensorData.ec >= 1.2 && this.sensorData.ec <= 2.2;
  }
  isEcCritical(): boolean {
    return this.sensorData?.ec !== undefined && (this.sensorData.ec < 1.2 || this.sensorData.ec > 2.2);
  }
}