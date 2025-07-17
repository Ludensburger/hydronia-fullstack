import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlantMetricsChartComponent } from '../../components/plant-metrics-chart/plant-metrics-chart.component';

import type {
  SensorData,
  Alert,
  Prediction,
  PlantImage,
} from '../../types/hydronia';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, PlantMetricsChartComponent],
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss'],
})
export class FarmerDashboardComponent implements OnInit {
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

  constructor(
    private auth: AuthService,
    private router: Router,
    private api: ApiService
  ) {}

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
}
