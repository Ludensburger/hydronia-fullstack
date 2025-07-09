import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RoleSelectionComponent } from './pages/role-selection/role-selection.component';
import { FarmerDashboardComponent } from './pages/farmer-dashboard/farmer-dashboard.component';
import { DevDashboardComponent } from './pages/dev-dashboard/dev-dashboard.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'role-selection', component: RoleSelectionComponent },
  { path: 'farmer-dashboard', component: FarmerDashboardComponent },
  { path: 'dev-dashboard', component: DevDashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }, // Wildcard route for 404s
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoleSelectionComponent,
    FarmerDashboardComponent,
    DevDashboardComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes), // add this!
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:8000'],
        disallowedRoutes: ['http://localhost:8000/api/token/'],
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
