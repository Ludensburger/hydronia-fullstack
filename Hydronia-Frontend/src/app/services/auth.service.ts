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
    // Clear any invalid tokens first
    this.clearInvalidTokens();

    // Check if user is already logged in and load profile
    if (this.isLoggedIn()) {
      this.loadUserProfile().subscribe({
        next: (profile) => {
          console.log('User profile loaded successfully', profile);
        },
        error: (error) => {
          console.log(
            'Failed to load user profile, token might be expired',
            error
          );
          // Clear invalid token
          this.logout();
        },
      });
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
    console.log('Loading user profile...');
    const headers = this.getAuthHeaders();
    return this.http
      .get<UserProfile>(`${this.baseUrl}/user/profile/`, { headers })
      .pipe(
        tap((profile) => {
          console.log('Raw profile response:', profile);
          console.log('Profile user:', profile.user);
          console.log('Profile permissions:', profile.permissions);
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
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      // Basic token validation - check if it's not expired
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      if (tokenPayload.exp < currentTime) {
        console.log('Token is expired, logging out');
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.log('Invalid token format, logging out');
      this.logout();
      return false;
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private clearInvalidTokens() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (tokenPayload.exp < currentTime) {
          console.log('Found expired token, clearing');
          this.logout();
        }
      } catch (error) {
        console.log('Found invalid token, clearing');
        this.logout();
      }
    }
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
