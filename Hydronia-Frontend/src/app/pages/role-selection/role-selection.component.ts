import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss'],
})
export class RoleSelectionComponent implements OnInit {
  user$!: Observable<any>;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.currentUser$;

    // If user is not logged in, redirect to login
    if (!this.auth.isLoggedIn()) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    // If user is logged in but profile is not loaded, load it
    if (!this.auth.getCurrentUser()) {
      console.log('User logged in but profile not loaded, loading profile');
      this.auth.loadUserProfile().subscribe({
        next: (profile) => {
          console.log('Profile loaded successfully:', profile);
        },
        error: (error) => {
          console.error('Failed to load profile:', error);
          this.router.navigate(['/login']);
        },
      });
    }
  }

  selectRole(role: 'farmer' | 'dev') {
    console.log('=== selectRole DEBUG ===');
    console.log('selectRole called with:', role);
    console.log('Auth service exists:', !!this.auth);
    console.log('Router exists:', !!this.router);
    console.log('Is logged in:', this.auth.isLoggedIn());

    const user = this.auth.getCurrentUser();
    console.log('Current user:', user);
    console.log('User profile from localStorage:', this.auth.getUserProfile());

    if (!user) {
      console.log('ERROR: No user found, cannot navigate');
      alert('No user data found. Please try logging in again.');
      return;
    }

    console.log(
      'User roles - is_farmer:',
      user.is_farmer,
      'is_dev:',
      user.is_dev
    );

    if (role === 'farmer') {
      console.log('Attempting to navigate to farmer dashboard');
      this.router
        .navigate(['/farmer-dashboard'])
        .then((success) => {
          console.log('Navigation to farmer dashboard result:', success);
          if (!success) {
            console.log('Navigation failed - check route guards');
          }
        })
        .catch((error) => {
          console.error('Navigation error:', error);
        });
    } else {
      console.log('Attempting to navigate to dev dashboard');
      this.router
        .navigate(['/dev-dashboard'])
        .then((success) => {
          console.log('Navigation to dev dashboard result:', success);
          if (!success) {
            console.log('Navigation failed - check route guards');
          }
        })
        .catch((error) => {
          console.error('Navigation error:', error);
        });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  testClick() {
    console.log('Test click works!');
    alert('Click detected!');
  }
}
