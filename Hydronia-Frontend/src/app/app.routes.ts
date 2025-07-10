import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'role-selection',
    loadComponent: () =>
      import('./pages/role-selection/role-selection.component').then(
        (m) => m.RoleSelectionComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'farmer-dashboard',
    loadComponent: () =>
      import('./pages/farmer-dashboard/farmer-dashboard.component').then(
        (m) => m.FarmerDashboardComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'farmer' },
  },
  {
    path: 'dev-dashboard',
    loadComponent: () =>
      import('./pages/dev-dashboard/dev-dashboard.component').then(
        (m) => m.DevDashboardComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'dev' },
  },
  {
    path: 'plant-gallery',
    loadComponent: () =>
      import('./pages/plant-gallery/plant-gallery.component').then(
        (m) => m.PlantGalleryComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./pages/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/login' },
];
