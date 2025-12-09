import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FavMaterialService } from '../../../services/fav-material.service';
import { BanMonitorService } from '../../../services/ban-monitor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,FormsModule,RouterModule],
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private fav: FavMaterialService, private banMonitor: BanMonitorService) {}

  onLogin() {
    this.error = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const token = res?.token ?? res?.Token;
        if (!token) {
          this.error = 'Invalid response from server.';
          this.loading = false;
          return;
        }
        this.auth.saveToken(token);
        this.fav.getAll().subscribe();
        this.banMonitor.startMonitoring();
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? err?.message ?? 'Invalid email or password.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  
}
