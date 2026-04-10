import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskItem } from '../../models/taskmodel';
import { AuthServices } from '../../services/auth.services';
import { TasksServices } from '../../services/tasks.services';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks implements OnInit {
  private readonly tasksService = inject(TasksServices);
  readonly authService = inject(AuthServices);

  tasks: TaskItem[] = [];
  isLoading = false;
  isCreating = false;
  isSaving = false;
  message = '';
  errorMessage = '';
  editingTaskId: number | null = null;



  createForm = {
    title: '',
    description: '',
  };

  editForm = {
    title: '',
    description: '',
    isCompleted: false,
  };

constructor(private cdr: ChangeDetectorRef) {


}


  ngOnInit(): void {
    this.loadTasks();


  }

  loadTasks(): void {
    if (!this.authService.isLoggedIn()) {
      this.tasks = [];
      return;
    }

    this.clearMessages();
    this.isLoading = true;

    this.tasksService.getMyTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  createTask(): void {
    if (this.isCreating) {
      return;
    }

    this.clearMessages();

    if (!this.createForm.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }

    this.isCreating = true;

    this.tasksService
      .createTask({
        title: this.createForm.title.trim(),
        description: this.createForm.description.trim(),
      })
      .subscribe({
        next: (createdTask) => {
          this.tasks = [createdTask, ...this.tasks];
          this.message = 'Task created successfully.';
          this.isCreating = false;
          this.createForm = {
            title: '',
            description: '',
          };
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isCreating = false;
        },
      });
  }

  startEdit(task: TaskItem): void {


    this.editingTaskId = task.id;
    this.editForm = {
      title: task.title,
      description: task.description ?? '',
      isCompleted: task.isCompleted,
    };
    this.cdr.detectChanges();
    this.clearMessages();
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.editForm = {
      title: '',
      description: '',
      isCompleted: false,
    };
    this.cdr.detectChanges();
  }

  saveTask(taskId: number): void {
    if (this.isSaving ) {
      return;
    }

    this.clearMessages();

    if (!this.editForm.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }

    this.isSaving = true;

    this.tasksService
      .updateTask(taskId, {
        title: this.editForm.title.trim(),
        description: this.editForm.description.trim(),
        isCompleted: this.editForm.isCompleted,
      })
      .subscribe({
        next: (updatedTask) => {
          this.tasks = this.tasks.map((task) => (task.id === taskId ? updatedTask : task));
          this.message = 'Task updated successfully.';
          this.isSaving = false;
          this.cancelEdit();
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isSaving = false;
          this.cdr.detectChanges();
        },
      });
  }

  markComplete(taskId: number): void {


    this.clearMessages();

    this.tasksService.completeTask(taskId).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map((task) => (task.id === taskId ? updatedTask : task));
        this.message = 'Task marked as completed.';
        this.cdr.detectChanges();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
      },
    });
  }

  deleteTask(taskId: number): void {


    this.clearMessages();

    this.tasksService.deleteTask(taskId).subscribe({
      next: (response) => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.message = response.message;

        if (this.editingTaskId === taskId) {
          this.cancelEdit();
        }
        this.cdr.detectChanges();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
      },
    });
  }



  private clearMessages(): void {
    this.message = '';
    this.errorMessage = '';
  }

}
