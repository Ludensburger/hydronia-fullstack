import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Login successful');

        // Hide this after Testing
        console.log('Access Token: ', localStorage.getItem('access_token'));
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}
