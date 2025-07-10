import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const user = this.authService.getCurrentUser();

    console.log('Role Guard - Expected role:', expectedRole);
    console.log('Role Guard - Current user:', user);

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // For dev users, allow access to both farmer and dev views
    if (user.is_dev) {
      return true;
    }

    // For farmer users, only allow access to farmer views
    if (expectedRole === 'farmer' && user.is_farmer) {
      return true;
    }

    // If user doesn't have permission, redirect to role selection
    this.router.navigate(['/role-selection']);
    return false;
  }
}
