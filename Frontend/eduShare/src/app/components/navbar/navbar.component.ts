import { Component, OnChanges, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
import { MaterialService } from '../../services/material.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent implements OnChanges {
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService, private materialService: MaterialService) {
    this.isLoggedIn = this.auth.isLoggedIn();
    console.log('userid: ', auth.getUserId());
  }

  ngOnChanges() {
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
  }
}
