import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../services/auth.services';

export const authGuard: CanActivateFn = () => {
  const authservice = inject(AuthServices);
  const router = inject(Router);

  if (authservice.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
