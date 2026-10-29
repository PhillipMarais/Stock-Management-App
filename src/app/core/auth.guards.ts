import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** The stock dashboard needs a signed-in, verified user. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  if (auth.signedIn()) return true;
  return router.createUrlTree([auth.user() ? '/verify-email' : '/login']);
};

/** Sign-in pages send already signed-in users straight to the dashboard. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return auth.signedIn() ? router.createUrlTree(['/dashboard']) : true;
};
