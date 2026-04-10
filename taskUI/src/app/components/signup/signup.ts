import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthServices } from '../../services/auth.services';
@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private readonly authService = inject(AuthServices);

  form = {
    username: '',
    password: '',
    role: 'User',
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
      .register({
        username: this.form.username.trim(),
        password: this.form.password,
        role: this.form.role,
      })
      .subscribe({
        next: (response) => {
          this.successMessage = `${response.message} You can login now.`;
          this.isSubmitting = false;
          this.form.username = '';
          this.form.password = '';
          this.form.role = 'User';
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isSubmitting = false;
          console.error('Registration error:', error);
          this.cdr.detectChanges();
        },
      });
  }
}
