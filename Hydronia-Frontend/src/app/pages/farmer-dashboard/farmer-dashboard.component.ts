import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss'],
  standalone: false,
})
export class FarmerDashboardComponent implements OnInit {
  user$!: Observable<any>;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.currentUser$;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  switchToDevView() {
    this.router.navigate(['/dev-dashboard']);
  }
}
