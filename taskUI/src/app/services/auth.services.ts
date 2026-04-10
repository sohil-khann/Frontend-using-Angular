import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import {
  AuthRequest,
  AuthUser,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../models/authmodel';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly tokenStorageKey = 'taskmanager_token';
  private readonly userStorageKey = 'taskmanager_user';

  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());
  readonly token = signal<string>(this.getStoredToken());

  constructor(private readonly http: HttpClient) {}

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/register`, payload)
      .pipe(catchError((error) => this.handleError(error)));
  }

  login(payload: AuthRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        const user: AuthUser = {
          id: response.id,
          username: response.username,
          role: response.role,
        };

        localStorage.setItem(this.tokenStorageKey, response.token);
        localStorage.setItem(this.userStorageKey, JSON.stringify(user));

        this.token.set(response.token);
        this.currentUser.set(user);
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userStorageKey);
    this.token.set('');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.token().trim().length > 0;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'Admin';
  }

  updateStoredUserRole(userId: number, role: string): void {
    const user = this.currentUser();

    if (!user || user.id !== userId) {
      return;
    }

    const updatedUser: AuthUser = {
      ...user,
      role,
    };

    localStorage.setItem(this.userStorageKey, JSON.stringify(updatedUser));
    this.currentUser.set(updatedUser);
  }

  private getStoredToken(): string {
    return localStorage.getItem(this.tokenStorageKey) ?? '';
  }

  private getStoredUser(): AuthUser | null {
    const storedUser = localStorage.getItem(this.userStorageKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem(this.userStorageKey);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Something went wrong. Please try again.';

    return throwError(() => new Error(message));
  }
}
