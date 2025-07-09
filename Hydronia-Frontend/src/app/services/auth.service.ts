import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'FARMER' | 'DEV';
  is_farmer: boolean;
  is_dev: boolean;
}

export interface UserProfile {
  user: User;
  permissions: {
    can_access_farmer_view: boolean;
    can_access_dev_view: boolean;
    needs_role_selection: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in and load profile
    if (this.isLoggedIn()) {
      this.loadUserProfile().subscribe();
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/token/`, { username, password })
      .pipe(
        tap((res: any) => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
        }),
        // After successful login, load user profile
        tap(() => {
          this.loadUserProfile().subscribe();
        })
      );
  }

  loadUserProfile(): Observable<UserProfile> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<UserProfile>(`${this.baseUrl}/user/profile/`, { headers })
      .pipe(
        tap((profile) => {
          this.currentUserSubject.next(profile.user);
          localStorage.setItem('user_profile', JSON.stringify(profile));
        })
      );
  }

  getUserProfile(): UserProfile | null {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Role-based methods
  isDevUser(): boolean {
    const user = this.getCurrentUser();
    return user?.is_dev || false;
  }

  isFarmerUser(): boolean {
    const user = this.getCurrentUser();
    return user?.is_farmer || false;
  }

  needsRoleSelection(): boolean {
    const profile = this.getUserProfile();
    return profile?.permissions.needs_role_selection || false;
  }

  canAccessDevView(): boolean {
    const profile = this.getUserProfile();
    return profile?.permissions.can_access_dev_view || false;
  }
}
