import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BanMonitorService {
  private checkSubscription?: Subscription;
  private readonly CHECK_INTERVAL = 60000;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  startMonitoring(): void {
    if (this.checkSubscription) {
      return;
    }

    this.checkBanStatus();

    this.checkSubscription = interval(this.CHECK_INTERVAL).subscribe(() => {
      this.checkBanStatus();
    });
  }

  stopMonitoring(): void {
    if (this.checkSubscription) {
      this.checkSubscription.unsubscribe();
      this.checkSubscription = undefined;
    }
  }

  private checkBanStatus(): void {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      return;
    }

    this.profileService.getById(userId).subscribe({
      next: (profile) => {
        if (profile.isBanned) {
          this.handleBannedUser();
        }
      },
      error: (err) => {
        console.error('Error checking ban status:', err);
      }
    });
  }

  private handleBannedUser(): void {
    this.stopMonitoring();
    alert('Your account has been banned. You will be logged out.');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
