import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorData, Alert, Prediction } from '../../../types/hydronia';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6"
    >
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1
              class="text-3xl md:text-4xl font-bold text-primary flex items-center gap-3"
            >
              <svg
                class="h-8 w-8 md:h-10 md:w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Hydronia - Farmer Dashboard
            </h1>
            <p class="text-muted-foreground mt-2">
              Aquaponic Lettuce Monitoring & Management
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="border border-border bg-background px-3 py-1 rounded-md text-sm font-medium transition-colors hover:bg-secondary"
            >
              <svg
                class="h-4 w-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-5 5-5-5h5zm0 0V3"
                />
              </svg>
              Alerts ({{ getUnacknowledgedAlerts() }})
            </button>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <div
                class="h-2 w-2 bg-green-500 rounded-full animate-pulse"
              ></div>
              Live monitoring active
            </div>
          </div>
        </div>

        <!-- Cycle and Row Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-card border border-border rounded-lg shadow-sm">
            <div class="p-4 border-b border-border">
              <h3 class="text-lg font-semibold">Active Crop Cycle</h3>
            </div>
            <div class="p-4">
              <div class="space-y-2">
                <p class="font-medium">Winter Lettuce 2024-01</p>
                <p class="text-sm text-muted-foreground">
                  Started: Jan 15, 2024
                </p>
                <p class="text-sm text-muted-foreground">
                  Expected Harvest: Mar 15, 2024
                </p>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-800"
                  >Day 45 of 60</span
                >
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-lg shadow-sm">
            <div class="p-4 border-b border-border">
              <h3 class="text-lg font-semibold">Monitoring Row</h3>
            </div>
            <div class="p-4">
              <div class="flex gap-2 mb-2">
                <button
                  *ngFor="let row of rows; let i = index"
                  (click)="setSelectedRow('row-' + (i + 1))"
                  [class]="
                    selectedRow === 'row-' + (i + 1)
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background'
                  "
                  class="px-3 py-1 rounded-md text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {{ row }}
                </button>
              </div>
              <p class="text-sm text-muted-foreground">
                Currently viewing:
                {{ selectedRow.replace('-', ' ').toUpperCase() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Real-time Sensor Data -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="bg-card border border-border rounded-lg shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">
                    pH Level
                  </p>
                  <p class="text-2xl font-bold text-primary">
                    {{ sensorData.pH }}
                  </p>
                  <p class="text-xs text-green-600">Optimal range: 6.0-6.5</p>
                </div>
                <div
                  class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-lg shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">
                    EC (mS/cm)
                  </p>
                  <p class="text-2xl font-bold text-primary">
                    {{ sensorData.ec }}
                  </p>
                  <p class="text-xs text-green-600">Optimal range: 1.6-2.0</p>
                </div>
                <div
                  class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-lg shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">
                    Temperature
                  </p>
                  <p class="text-2xl font-bold text-primary">
                    {{ sensorData.temperature }}°C
                  </p>
                  <p class="text-xs text-green-600">Optimal: 20-25°C</p>
                </div>
                <div
                  class="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-lg shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">
                    Humidity
                  </p>
                  <p class="text-2xl font-bold text-primary">
                    {{ sensorData.humidity }}%
                  </p>
                  <p class="text-xs text-green-600">Optimal: 60-70%</p>
                </div>
                <div
                  class="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="h-6 w-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-lg shadow-sm">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">
                    TPH (ppm)
                  </p>
                  <p class="text-2xl font-bold text-primary">
                    {{ sensorData.tph }}
                  </p>
                  <p class="text-xs text-green-600">Safe: &lt;0.1</p>
                </div>
                <div
                  class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="h-6 w-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Tabs -->
        <div class="space-y-6">
          <!-- Tab Navigation -->
          <div class="border-b border-border">
            <nav class="flex space-x-8">
              <button
                *ngFor="let tab of tabs"
                (click)="setActiveTab(tab.id)"
                [class]="
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                "
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="space-y-6">
            <!-- Monitoring Tab -->
            <div
              *ngIf="activeTab === 'monitoring'"
              class="bg-card border border-border rounded-lg shadow-sm"
            >
              <div class="p-6 border-b border-border">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Historical Sensor Data - {{ selectedRow.toUpperCase() }}
                </h3>
              </div>
              <div class="p-6">
                <div
                  class="h-64 flex items-center justify-center text-muted-foreground"
                >
                  [Chart component would go here]
                </div>
              </div>
            </div>

            <!-- Images Tab -->
            <div
              *ngIf="activeTab === 'images'"
              class="grid lg:grid-cols-2 gap-6"
            >
              <div class="bg-card border border-border rounded-lg shadow-sm">
                <div class="p-6 border-b border-border">
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Daily Plant Images - {{ selectedRow.toUpperCase() }}
                  </h3>
                </div>
                <div class="p-6">
                  <div
                    class="h-64 flex items-center justify-center text-muted-foreground"
                  >
                    [Plant image viewer would go here]
                  </div>
                </div>
              </div>

              <div class="bg-card border border-border rounded-lg shadow-sm">
                <div class="p-6 border-b border-border">
                  <h3 class="text-lg font-semibold">AI Health Analysis</h3>
                </div>
                <div class="p-6 space-y-4">
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium"
                        >Overall Health Score</span
                      >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >92/100</span
                      >
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-green-600 h-2 rounded-full"
                        style="width: 92%"
                      ></div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <h4 class="font-medium text-sm">Detected Conditions:</h4>
                    <div class="space-y-1">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-green-600"
                        >Healthy Growth</span
                      >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-blue-600"
                        >Good Leaf Color</span
                      >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-yellow-600"
                        >Minor Nutrient Stress</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alerts Tab -->
            <div *ngIf="activeTab === 'alerts'" class="space-y-4">
              <div
                *ngFor="let alert of alerts"
                class="border-l-4 border-l-orange-500 bg-orange-50 p-4 rounded-r-lg"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <span class="font-medium">{{ alert.title }}</span>
                      <span
                        [class]="
                          alert.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        "
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ alert.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-700">{{ alert.description }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ alert.timestamp }}
                    </p>
                  </div>
                  <button
                    class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>

            <!-- Predictions Tab -->
            <div *ngIf="activeTab === 'predictions'" class="space-y-4">
              <div
                *ngFor="let prediction of predictions"
                class="bg-card border border-border rounded-lg shadow-sm"
              >
                <div class="p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h3 class="font-medium capitalize">
                        {{ prediction.type.replace('_', ' ') }}
                      </h3>
                      <p class="text-sm text-muted-foreground">
                        Expected in {{ prediction.timeframe }}
                      </p>
                    </div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                      >{{ prediction.confidence }}% confidence</span
                    >
                  </div>
                  <p class="text-sm mb-3">{{ prediction.description }}</p>
                  <div>
                    <h4 class="text-sm font-medium mb-2">Recommendations:</h4>
                    <ul class="text-sm text-muted-foreground space-y-1">
                      <li *ngFor="let rec of prediction.recommendations">
                        • {{ rec }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Logs Tab -->
            <div
              *ngIf="activeTab === 'logs'"
              class="bg-card border border-border rounded-lg shadow-sm"
            >
              <div class="p-6 border-b border-border">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Manual Logs & Observations
                </h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <button
                    class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                  >
                    Add New Log Entry
                  </button>
                  <div class="text-center text-muted-foreground py-8">
                    No manual logs recorded yet. Click above to add your first
                    observation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FarmerDashboardComponent {
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

  setSelectedRow(row: string) {
    this.selectedRow = row;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getUnacknowledgedAlerts() {
    return this.alerts.filter((alert) => !alert.acknowledged).length;
  }
}
