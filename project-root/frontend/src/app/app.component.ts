import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<div class="app">
  <nav class="navbar" *ngIf="isLoggedIn()">
    <div class="nav-container">
      <h1>File Share</h1>
      <div class="nav-actions">
        <span>{{ getCurrentUser()?.username }}</span>
        <button (click)="logout()">Logout</button>
      </div>
    </div>
  </nav>
  <div *ngIf="loading$ | async" class="global-loader">
    <div class="spinner"></div>
  </div>
  <main>
    <router-outlet></router-outlet>
  </main>
</div>`,
  styles: [`.app { min-height: 100vh; background: #f5f6fa; } .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; } .nav-container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; } .navbar h1 { margin: 0; color: #667eea; font-size: 1.5rem; } .nav-actions { display: flex; align-items: center; gap: 1rem; } .nav-actions span { color: #666; } .nav-actions button { padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; } .nav-actions button:hover { background: #5568d3; } .global-loader { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; z-index: 9999; } .spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } main { min-height: calc(100vh - 72px); }`]
})
export class AppComponent {
  loading$ = this.loadingService.loading$;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}
  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  getCurrentUser(): any { return this.authService.getCurrentUser(); }
  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
}
