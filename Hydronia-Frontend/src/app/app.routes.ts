import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RoleSelectionComponent } from './pages/role-selection/role-selection.component';
import { FarmerDashboardComponent } from './pages/farmer-dashboard/farmer-dashboard.component';
import { DevDashboardComponent } from './pages/dev-dashboard/dev-dashboard.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'role-selection',
    component: RoleSelectionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'multi-role' } // Only users with dev privileges can access this
  },
  {
    path: 'farmer-dashboard',
    component: FarmerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'farmer' }
  },
  {
    path: 'dev-dashboard',
    component: DevDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'dev' }
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'farmer' }
  },
  { path: '**', redirectTo: '/login' }
];