import { Component } from '@angular/core';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { Router } from '@angular/router';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { AuthService } from '../../services/authentication.service';
import { MaterialService } from '../../services/material.service';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { StatisticsService } from '../../services/statistics.service';
import { HomepageStatisticsDto } from '../../dtos/homepage-statistics-dto';
import { UserStatisticsDto } from '../../dtos/user-statistics-dto';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent {
  isLoggedIn: boolean = false
  userId: string | null = null
  stats: HomepageStatisticsDto | null = null
  userStats: UserStatisticsDto | null = null

  constructor(private router: Router, private authService: AuthService, private statService: StatisticsService) {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.userId = this.authService.getUserId()
    this.loadStats()
    this.loadUserStats(this.userId || '')

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

  loadUserStats(userId: string): void {
    if (userId) {
      this.statService.getUserStatistics(userId).subscribe({
        next: (data) => {
          this.userStats = data
        },
        error: (err) => {
          console.error(err)
        },
      })
    }
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

  showMaterials(): void {
    this.router.navigate(['/materials'])
  }
}
