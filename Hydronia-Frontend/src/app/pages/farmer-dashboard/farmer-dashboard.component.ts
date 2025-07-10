import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SensorData, Alert, Prediction } from '../../types/hydronia';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss'],
})
export class FarmerDashboardComponent implements OnInit {
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

  sensorData: SensorData = {
    pH: 6.2,
    ec: 1.8,
    temperature: 24.5,
    humidity: 65,
    tph: 0.02,
  };

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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.currentUser$;
  }

  setSelectedRow(row: string) {
    this.selectedRow = row;
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
