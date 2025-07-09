import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss'],
  standalone: false,
})
export class RoleSelectionComponent implements OnInit {
  user$!: Observable<any>;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.currentUser$;
  }

  selectRole(role: 'farmer' | 'dev') {
    if (role === 'farmer') {
      this.router.navigate(['/farmer-dashboard']);
    } else {
      this.router.navigate(['/dev-dashboard']);
    }
  }
}
