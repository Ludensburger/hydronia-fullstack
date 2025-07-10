import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-role-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 flex items-center justify-center"
    >
      <div class="max-w-4xl w-full space-y-6">
        <div class="text-center space-y-4">
          <div class="flex items-center justify-center gap-3">
            <svg
              class="h-12 w-12 text-primary"
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
            <h1 class="text-4xl font-bold text-primary">Hydronia</h1>
          </div>
          <p class="text-xl text-muted-foreground">
            IoT-Based Aquaponic Lettuce Monitoring System
          </p>
          <p class="text-sm text-muted-foreground max-w-2xl mx-auto">
            CNN-Driven Plant Growth Monitoring and Early Detection System for
            Fungal and Pest Infestations
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Farmer Dashboard Card -->
          <div
            class="bg-card border border-border rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-lg"
            [class.ring-2]="currentRole === 'farmer'"
            [class.ring-primary]="currentRole === 'farmer'"
          >
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold">Farmer Dashboard</h3>
              </div>

              <p class="text-muted-foreground mb-4">
                Monitor your crops, view real-time data, and receive alerts for
                optimal growing conditions.
              </p>

              <div class="space-y-2 mb-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >Real-time Monitoring</span
                >
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >Plant Health Tracking</span
                >
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >Alert Management</span
                >
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >Manual Logging</span
                >
              </div>

              <button
                (click)="onRoleSelect('farmer')"
                [class]="
                  currentRole === 'farmer'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-background'
                "
                class="w-full py-2 px-4 rounded-md text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Access Farmer Dashboard
              </button>
            </div>
          </div>

          <!-- Admin Dashboard Card -->
          <div
            class="bg-card border border-border rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-lg"
            [class.ring-2]="currentRole === 'admin'"
            [class.ring-primary]="currentRole === 'admin'"
          >
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold">System Administration</h3>
              </div>

              <p class="text-muted-foreground mb-4">
                Configure system settings, manage AI models, and monitor system
                health.
              </p>

              <div class="space-y-2 mb-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >System Configuration</span
                >
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >AI Model Management</span
                >
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >User Management</span
                >
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >Data Export</span
                >
              </div>

              <button
                (click)="onRoleSelect('admin')"
                [class]="
                  currentRole === 'admin'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-background'
                "
                class="w-full py-2 px-4 rounded-md text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Access Admin Panel
              </button>
            </div>
          </div>
        </div>

        <div class="text-center text-sm text-muted-foreground">
          <p>
            Developed by: Tan, Robien Lee • Mendoza, Ryu • Valencia, Percival
            Louis
          </p>
        </div>
      </div>
    </div>
  `,
})
export class UserRoleSelectorComponent {
  @Input() currentRole?: 'farmer' | 'admin';
  @Output() roleSelected = new EventEmitter<'farmer' | 'admin'>();

  onRoleSelect(role: 'farmer' | 'admin') {
    this.roleSelected.emit(role);
  }
}
