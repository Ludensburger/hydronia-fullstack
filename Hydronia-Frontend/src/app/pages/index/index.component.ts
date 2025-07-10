import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleSelectorComponent } from '../components/user-role-selector/user-role-selector.component';
import { FarmerDashboardComponent } from '../components/farmer-dashboard/farmer-dashboard.component';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    UserRoleSelectorComponent,
    FarmerDashboardComponent,
    AdminDashboardComponent,
  ],
  template: `
    <div class="relative">
      <!-- Role Switch Button -->
      <div class="fixed top-4 right-4 z-50" *ngIf="selectedRole">
        <button
          (click)="handleRoleChange()"
          class="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium shadow-md hover:bg-white transition-colors"
        >
          Switch Role
        </button>
      </div>

      <!-- Role Selector -->
      <app-user-role-selector
        *ngIf="!selectedRole"
        [currentRole]="selectedRole"
        (roleSelected)="handleRoleSelect($event)"
      ></app-user-role-selector>

      <!-- Farmer Dashboard -->
      <app-farmer-dashboard
        *ngIf="selectedRole === 'farmer'"
      ></app-farmer-dashboard>

      <!-- Admin Dashboard -->
      <app-admin-dashboard
        *ngIf="selectedRole === 'admin'"
      ></app-admin-dashboard>
    </div>
  `,
})
export class IndexComponent {
  selectedRole: 'farmer' | 'admin' | null = null;

  handleRoleSelect(role: 'farmer' | 'admin') {
    this.selectedRole = role;
  }

  handleRoleChange() {
    this.selectedRole = null;
  }
}
