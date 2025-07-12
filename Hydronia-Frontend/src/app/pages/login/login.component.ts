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

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        console.log('Login successful');
        this.isLoading = false;
        // Note: Auth service handles the redirect automatically based on role
      },
      error: (err) => {
        console.error('Login failed', err);
        this.isLoading = false;
        this.loginError = 'Invalid username or password. Please try again.';
      },
    });
  }
}
