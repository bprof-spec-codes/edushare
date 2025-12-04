import { Component } from '@angular/core';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { Router } from '@angular/router';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { AuthService } from '../../services/authentication.service';
import { MaterialService } from '../../services/material.service';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { StatisticsService } from '../../services/statistics.service';
import { HomepageStatisticsDto } from '../../dtos/homepage-statistics-dto';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent {
  isLoggedIn: boolean = false
  stats: HomepageStatisticsDto | null = null

  constructor(private router: Router, private authService: AuthService, private statService: StatisticsService) {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.loadStats()
  }

  loadStats(): void {
    this.statService.getHomepageStatistics().subscribe({
      next: (data) => {
        this.stats = data
      },
      error: (err) => {
        console.error(err)
      },
    })
  }

  typedStrings = [
    'share your notes.',
    'prepare for exams.',
    'learn together.',
    'teach and get feedback.'
  ]

  countupOptions = {
    enableScrollSpy: true,
    duration: 2
  }

  userStats = {
    savedMaterials: 20,
    downloads: 44,
    ratingCount: 2,
    averageGivenRating: 4.5
  }

  showMaterials(): void {
    this.router.navigate(['/materials'])
  }
}
