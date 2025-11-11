import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FavMaterialService } from '../../../services/fav-material.service';

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

  constructor(private auth: AuthService, private router: Router, private fav: FavMaterialService) {}

  onLogin() {
    this.error = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const token = res?.token ?? res?.Token;
        if (!token) {
          this.error = 'Hibás válasz a szervertől.';
          this.loading = false;
          return;
        }
        this.auth.saveToken(token);
        this.fav.getAll().subscribe()
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? err?.message ?? 'Hibás email vagy jelszó.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  
}
