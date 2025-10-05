import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface LoginResult {
  Token?: string;
  token?: string;
  Expiration?: string;
  expiration?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:5000/api/User';
  private storageKey = 'edu_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.apiUrl}/Login`, { email, password });
  }

  saveToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodePayload(token);
    if (!payload) return false;
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      return now < payload.exp;
    }
    return true;
  }

  decodePayload(token: string): any | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = this.decodePayload(token);
    if (!payload) return [];

    if (payload.role) return Array.isArray(payload.role) ? payload.role : [payload.role];
    if (payload.roles) return Array.isArray(payload.roles) ? payload.roles : [payload.roles];

    const claimUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const claim = payload[claimUri];
    if (claim) return Array.isArray(claim) ? claim : [claim];

    return [];
  }
}
