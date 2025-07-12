import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

export interface LoginCredentials {
  username: string;
  password: string;
}

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
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public user$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
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

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/token/`, credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.setAuthToken(response.access);
        
        // Get user profile to determine role and redirect appropriately
        this.loadUserProfile().subscribe(
          (profile) => {
            console.log('Login profile received:', profile);
            console.log('User role:', profile.user.role);
            console.log('User is_dev:', profile.user.is_dev);
            console.log('User is_farmer:', profile.user.is_farmer);
            
            this.currentUserSubject.next(profile.user);
            
            // Auto-redirect based on role - prioritize FARMER role
            if (profile.user.role === 'FARMER' && !profile.user.is_dev) {
              // Farmer-only users go directly to farmer dashboard
              console.log('Redirecting farmer to dashboard');
              this.router.navigate(['/farmer-dashboard']);
            } else if (profile.user.role === 'DEV' || profile.user.is_dev) {
              // Dev users go to role selection
              console.log('Redirecting dev to role selection');
              this.router.navigate(['/role-selection']);
            } else {
              // Default fallback for farmers
              console.log('Default fallback to farmer dashboard');
              this.router.navigate(['/farmer-dashboard']);
            }
          },
          (error) => {
            console.error('Error getting user profile:', error);
            // Fallback to farmer dashboard on error
            this.router.navigate(['/farmer-dashboard']);
          }
        );
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
    this.router.navigate(['/login']);
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

  private setAuthToken(token: string) {
    // This method can be used to set authorization headers globally if needed
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