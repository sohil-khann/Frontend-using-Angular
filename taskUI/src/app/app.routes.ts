import { Routes } from '@angular/router';
import { Admin } from './components/admin/admin';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Tasks } from './components/tasks/tasks';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'tasks', component: Tasks },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: 'login' },
];
