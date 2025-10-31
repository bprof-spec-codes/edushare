import { booleanAttribute, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/authentication.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)

  const requiredRoles = route.data?.['roles'] as string[] | undefined

  if (!requiredRoles || requiredRoles.some(x=> auth.getRoles().includes(x))){
    return true
  }

  return router.navigate(['home'])
};
