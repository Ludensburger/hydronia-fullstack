import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;
  loginError = '';

  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  login() {
    if (!this.username || !this.password) {
      this.loginError = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Login successful');
        this.isLoading = false;

        // Hide this after Testing
        console.log('Access Token: ', localStorage.getItem('access_token'));

        // Handle role-based routing
        this.handlePostLoginRouting();
      },
      error: (err) => {
        console.error('Login failed', err);
        this.isLoading = false;
        this.loginError = 'Invalid username or password. Please try again.';
      },
    });
  }

  private handlePostLoginRouting() {
    // Wait a moment for user profile to load
    setTimeout(() => {
      const userProfile = this.auth.getUserProfile();

      if (!userProfile) {
        this.loginError = 'Failed to load user profile. Please try again.';
        return;
      }

      // If user is a developer, show role selection
      if (userProfile.permissions.needs_role_selection) {
        this.router.navigate(['/role-selection']);
      }
      // If user is a farmer, go directly to farmer dashboard
      else if (userProfile.user.is_farmer) {
        this.router.navigate(['/farmer-dashboard']);
      }
      // Fallback to farmer dashboard
      else {
        this.router.navigate(['/farmer-dashboard']);
      }
    }, 500);
  }
}
