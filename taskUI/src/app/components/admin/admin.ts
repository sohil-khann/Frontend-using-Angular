import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminTaskItem } from '../../models/taskmodel';
import { AdminServices } from '../../services/admin.services';
import { AuthServices } from '../../services/auth.services';

interface AdminUserOption {
  userId: number;
  username: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private readonly adminService = inject(AdminServices);
  readonly authService = inject(AuthServices);

  tasks: AdminTaskItem[] = [];
  isLoading = false;
  isUpdatingRole = false;
  message = '';
  errorMessage = '';

  roleForm = {
    userId: 0,
    role: 'User',
  };
  constructor(private cdr : ChangeDetectorRef) {

  }

  loadAllTasks(): void {
    this.clearMessages();
    this.isLoading = true;

    this.adminService.getAllTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  selectUser(userId: number): void {
    this.roleForm.userId = userId;
  }

  updateRole(): void {
    if (this.isUpdatingRole) {
      return;
    }

    this.clearMessages();

    if (this.roleForm.userId <= 0) {
      this.errorMessage = 'Please enter a valid user id.';
      return;
    }

    this.isUpdatingRole = true;

    this.adminService
      .updateRole(this.roleForm.userId, {
        role: this.roleForm.role,
      })
      .subscribe({
        next: (response) => {
          this.message = response;
          this.isUpdatingRole = false;
          this.authService.updateStoredUserRole(this.roleForm.userId, this.roleForm.role);
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isUpdatingRole = false;
          this.cdr.detectChanges();
        },
      });
  }

  get userOptions(): AdminUserOption[] {
    const users = new Map<number, AdminUserOption>();

    for (const task of this.tasks) {
      if (!users.has(task.userId)) {
        users.set(task.userId, {
          userId: task.userId,
          username: task.username,
        });
      }
    }

    return Array.from(users.values());
  }

  private clearMessages(): void {
    this.message = '';
    this.errorMessage = '';
  }
}
