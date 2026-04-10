import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../services/auth.services';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthServices);
  private readonly router = inject(Router);

  form = {
    username: '',
    password: '',
  };

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(private cdr:ChangeDetectorRef) {

  }
  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.username.trim() || !this.form.password.trim()) {
      this.errorMessage = 'Please enter username and password.';
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;

    this.authService
      .login({
        username: this.form.username.trim(),
        password: this.form.password,
      })
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.isSubmitting = false;
          this.router.navigateByUrl(response.role === 'Admin' ? '/admin' : '/tasks');
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isSubmitting = false;
          this.cdr.detectChanges();
        },
      });
  }

  get auth() {
    return this.authService;
  }
}
