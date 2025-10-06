import { Component } from '@angular/core';
import { AuthService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'eduShare';
  constructor(public auth:AuthService) {}
}
