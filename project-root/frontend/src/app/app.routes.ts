import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { FileListComponent } from './features/files/file-list/file-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/files', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'files', component: FileListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/files' }
];
