import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Log in · Stock Management',
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    title: 'Register · Stock Management',
    loadComponent: () => import('./features/auth/register').then((m) => m.Register),
  },
  {
    path: 'forgot-password',
    title: 'Reset password · Stock Management',
    loadComponent: () => import('./features/auth/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'verify-email',
    title: 'Verify your email · Stock Management',
    loadComponent: () => import('./features/auth/verify-email').then((m) => m.VerifyEmail),
  },
  // Old misspelt address from the previous version
  { path: 'varify-email', redirectTo: 'verify-email' },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    title: 'Stock · Stock Management',
    loadComponent: () => import('./features/stock/stock-page').then((m) => m.StockPage),
  },
  { path: '**', redirectTo: 'login' },
];
