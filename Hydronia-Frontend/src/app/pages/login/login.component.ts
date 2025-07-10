import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    // Wait for user profile to load, then redirect
    this.auth.loadUserProfile().subscribe({
      next: (profile) => {
        console.log('User profile loaded:', profile);
        this.router.navigate(['/role-selection']);
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
        this.loginError = 'Failed to load user profile. Please try again.';
        this.auth.logout(); // Clear invalid session
      },
    });
  }
}
