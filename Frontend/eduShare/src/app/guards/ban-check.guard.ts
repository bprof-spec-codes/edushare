import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/authentication.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class BanCheckGuard implements CanActivate {
  
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  canActivate(): Observable<boolean> {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      return of(true);
    }

    return this.profileService.getById(userId).pipe(
      map(profile => {
        if (profile.isBanned) {
          this.toast.show('Your account has been banned. You will be logged out.');
          this.authService.logout();
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        return of(true);
      })
    );
  }
}
