import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SystemHealth, AIModel, User } from '../../types/hydronia';

@Component({
  selector: 'app-dev-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.scss'],
})
export class DevDashboardComponent implements OnInit {
  user$!: Observable<any>;
  activeTab = 'health';

  tabs = [
    { id: 'health', label: 'System Health' },
    { id: 'models', label: 'AI Models' },
    { id: 'users', label: 'User Management' },
    { id: 'export', label: 'Data Export' },
    { id: 'settings', label: 'Settings' },
  ];

  systemHealth: SystemHealth = {
    deviceConnectivity: {
      'sensor-unit-1': true,
      'sensor-unit-2': true,
      'camera-1': false,
      'camera-2': true,
    },
    dataIngestionRate: 150,
    lastDataReceived: new Date(),
    storageUsage: 67,
    apiStatus: 'healthy',
  };

  aiModels: AIModel[] = [
    {
      name: 'Fungal Detection CNN',
      version: '2.1.3',
      accuracy: 94.2,
      lastTrained: '2024-01-15',
      status: 'active',
    },
    {
      name: 'Pest Detection CNN',
      version: '1.8.7',
      accuracy: 87.5,
      lastTrained: '2024-01-10',
      status: 'active',
    },
    {
      name: 'Growth Prediction LSTM',
      version: '3.0.1',
      accuracy: 91.8,
      lastTrained: '2024-01-20',
      status: 'active',
    },
    {
      name: 'Insight Generation LLM',
      version: '1.2.0',
      accuracy: 89.3,
      lastTrained: '2024-01-18',
      status: 'training',
    },
  ];

  users: User[] = [
    {
      id: '1',
      name: 'John Farmer',
      email: 'john@farm.com',
      role: 'farmer',
      lastLogin: '2 hours ago',
      active: true,
    },
    {
      id: '2',
      name: 'Sarah Admin',
      email: 'sarah@admin.com',
      role: 'admin',
      lastLogin: '1 day ago',
      active: true,
    },
    {
      id: '3',
      name: 'Mike Grower',
      email: 'mike@farm.com',
      role: 'farmer',
      lastLogin: '3 days ago',
      active: false,
    },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.currentUser$;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getConnectedDevices(): number {
    return Object.values(this.systemHealth.deviceConnectivity).filter(Boolean)
      .length;
  }

  getTotalDevices(): number {
    return Object.keys(this.systemHealth.deviceConnectivity).length;
  }

  getMinutesAgo(): number {
    const now = new Date();
    const diff = now.getTime() - this.systemHealth.lastDataReceived.getTime();
    return Math.floor(diff / (1000 * 60));
  }

  getDevicesList() {
    return Object.entries(this.systemHealth.deviceConnectivity).map(
      ([name, connected]) => ({
        name: name.replace('-', ' ').toUpperCase(),
        connected,
      })
    );
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  switchToFarmerView() {
    this.router.navigate(['/farmer-dashboard']);
  }
}
