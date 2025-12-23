import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `<div class="auth-container">
  <div class="auth-card">
    <h2>Login</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>Username</label>
        <input type="text" formControlName="username" class="form-control">
        <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="error"> Username is required </div>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" formControlName="password" class="form-control">
        <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error"> Password is required </div>
      </div>
      <div *ngIf="errorMessage" class="error-message"> {{ errorMessage }} </div>
      <button type="submit" [disabled]="loginForm.invalid || loading" class="btn-primary"> {{ loading ? 'Loading...' : 'Login' }} </button>
    </form>
    <div class="auth-footer"> Don't have an account? <a routerLink="/register">Register</a> </div>
  </div>
</div>`,
  styles: [`.auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); } .auth-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; } h2 { margin-bottom: 1.5rem; color: #333; text-align: center; } .form-group { margin-bottom: 1rem; } label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500; } .form-control { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; } .form-control:focus { outline: none; border-color: #667eea; } .btn-primary { width: 100%; padding: 0.75rem; background: #667eea; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; transition: background 0.3s; } .btn-primary:hover:not(:disabled) { background: #5568d3; } .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; } .error { color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem; } .error-message { background: #f8d7da; color: #721c24; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; } .auth-footer { text-align: center; margin-top: 1rem; color: #666; } .auth-footer a { color: #667eea; text-decoration: none; } .auth-footer a:hover { text-decoration: underline; }`]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({ username: ['', Validators.required], password: ['', Validators.required] });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({ next: () => { this.router.navigate(['/files']); }, error: (error) => { this.loading = false; this.errorMessage = error.error?.message || 'Login failed'; } });
    }
  }
}
