import { Component } from '@angular/core';
import { AuthService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
