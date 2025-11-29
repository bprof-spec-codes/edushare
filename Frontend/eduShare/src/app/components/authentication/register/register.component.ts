import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService } from '../../../services/register.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';

  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private registerService: RegisterService, private router: Router) {}

  onRegister() {
    this.error = null;
    this.success = null;

    if (!this.email || !this.firstName || !this.lastName || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.registerService.register(this.firstName, this.lastName, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful!';
        this.clearForm();
        setTimeout(() => {
          this.router.navigate(["/login"])
        }, 3000)
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error || 'Registration failed. Please try again.';
      },
    });
  }

  clearForm() {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
