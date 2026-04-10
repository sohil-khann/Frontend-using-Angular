import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { AdminTaskItem, UpdateRoleRequest } from '../models/taskmodel';
import { AuthServices } from './auth.services';

@Injectable({
  providedIn: 'root',
})
export class AdminServices {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthServices,
  ) {}

  getAllTasks(): Observable<AdminTaskItem[]> {
    return this.http
      .get<AdminTaskItem[]>(`${this.apiUrl}/tasks`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateRole(userId: number, payload: UpdateRoleRequest): Observable<string> {
    return this.http
      .patch(`${this.apiUrl}/Set/${userId}`, payload, {
        headers: this.getAuthHeaders(),
        responseType: 'text',
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.token()}`,
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Something went wrong. Please try again later.';


    return throwError(() => new Error(message));
  }
}
