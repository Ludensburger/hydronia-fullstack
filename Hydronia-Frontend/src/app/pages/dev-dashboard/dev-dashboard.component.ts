import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dev-dashboard',
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.scss'],
  standalone: false,
})
export class DevDashboardComponent implements OnInit {
  user$!: Observable<any>;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.currentUser$;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  switchToFarmerView() {
    this.router.navigate(['/farmer-dashboard']);
  }
}
