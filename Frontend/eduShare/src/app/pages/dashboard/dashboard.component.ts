import { Component } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
