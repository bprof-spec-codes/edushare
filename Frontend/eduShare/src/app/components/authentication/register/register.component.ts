import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../../services/register.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = false;

  constructor(private registerService: RegisterService, private router: Router) {}

  onRegister() {
    this.error = '';
    this.success = '';

    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Kérlek, töltsd ki az összes mezőt.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'A jelszavak nem egyeznek.';
      return;
    }

    this.loading = true;

    this.registerService
      .register(this.fullName, this.email, this.password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.success = 'Sikeres regisztráció! Most már bejelentkezhetsz.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err: any) => {
          console.error('Regisztrációs hiba:', err);
          if (err.status === 400) {
            this.error = err.error?.message ?? 'Az e-mail cím már használatban van.';
          } else if (err.status === 0) {
            this.error = 'Nem sikerült csatlakozni a szerverhez.';
          } else {
            this.error =
              err?.error?.message ??
              err?.message ??
              'Hiba történt a regisztráció során. Kérlek próbáld újra.';
          }
        },
      });
  }
}
