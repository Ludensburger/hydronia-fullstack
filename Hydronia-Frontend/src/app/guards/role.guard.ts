import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        const requiredRole = route.data?.['role'];
        
        if (!requiredRole) {
          return true;
        }

        // Handle multi-role access (role selection page)
        if (requiredRole === 'multi-role') {
          // Only users with dev privileges can access role selection
          if (user.role === 'DEV' || user.is_dev) {
            return true;
          } else {
            // Farmer-only users should go directly to farmer dashboard
            this.router.navigate(['/farmer-dashboard']);
            return false;
          }
        }

        // Check if user has required role
        if (requiredRole === 'farmer' && (user.role === 'FARMER' || user.is_dev)) {
          // Both farmers and devs can access farmer dashboard
          return true;
        }
        
        if (requiredRole === 'dev' && (user.role === 'DEV' || user.is_dev)) {
          return true;
        }

        // If user doesn't have required role, redirect appropriately
        if (user.role === 'FARMER' && !user.is_dev) {
          this.router.navigate(['/farmer-dashboard']);
        } else {
          this.router.navigate(['/role-selection']);
        }
        
        return false;
      })
    );
  }
}