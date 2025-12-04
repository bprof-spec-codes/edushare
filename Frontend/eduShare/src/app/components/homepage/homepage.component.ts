import { Component } from '@angular/core';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { Router } from '@angular/router';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { AuthService } from '../../services/authentication.service';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent {
  isLoggedIn: boolean = false

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn()
  }

  typedStrings = [
    'share your notes.',
    'prepare for exams.',
    'learn together.',
    'teach and get feedback.'
  ]

  stats = {
    materials: 13,
    users: 10,
    subjects: 6
  }

  countupOptions = {
    enableScrollSpy: true,
    duration: 2
  }

  showMaterials(): void {
    this.router.navigate(['/materials'])
  }
}
