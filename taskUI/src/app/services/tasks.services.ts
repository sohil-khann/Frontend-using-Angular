import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthServices } from './auth.services';
import {
  CreateTaskRequest,
  DeleteTaskResponse,
  TaskItem,
  UpdateTaskRequest,
} from '../models/taskmodel';

@Injectable({
  providedIn: 'root',
})
export class TasksServices {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthServices,
  ) {}

  getMyTasks(): Observable<TaskItem[]> {
    return this.http
      .get<TaskItem[]>(this.apiUrl, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getTaskById(id: number): Observable<TaskItem> {
    return this.http
      .get<TaskItem>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  createTask(payload: CreateTaskRequest): Observable<TaskItem> {
    return this.http
      .post<TaskItem>(this.apiUrl, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateTask(id: number, payload: UpdateTaskRequest): Observable<TaskItem> {
    return this.http
      .put<TaskItem>(`${this.apiUrl}/${id}`, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  completeTask(id: number): Observable<TaskItem> {
    return this.http
      .patch<TaskItem>(`${this.apiUrl}/${id}/complete`, {}, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteTask(id: number): Observable<DeleteTaskResponse> {
    return this.http
      .delete<DeleteTaskResponse>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.token()}`,
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Something went wrong while working with tasks.';

    

    return throwError(() => new Error(message));
  }
}
