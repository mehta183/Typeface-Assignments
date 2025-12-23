import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { ApiResponse, JwtResponse } from '../models/user.model';
import { LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}
  login(credentials: LoginRequest): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(response => {
        if (response.success && response.data) {
          this.storageService.saveToken(response.data.token);
          this.storageService.saveUser({ id: response.data.id, username: response.data.username, email: response.data.email });
        }
      }));
  }
  register(userData: RegisterRequest): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.apiUrl}/register`, userData)
      .pipe(tap(response => {
        if (response.success && response.data) {
          this.storageService.saveToken(response.data.token);
          this.storageService.saveUser({ id: response.data.id, username: response.data.username, email: response.data.email });
        }
      }));
  }
  logout(): void { this.storageService.clear(); }
  isLoggedIn(): boolean { return this.storageService.isLoggedIn(); }
  getCurrentUser(): any { return this.storageService.getUser(); }
}
