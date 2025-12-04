import { Component } from '@angular/core';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { Router } from '@angular/router';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { AuthService } from '../../services/authentication.service';
import { MaterialService } from '../../services/material.service';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent {
  isLoggedIn: boolean = false
  materials: MaterialShortViewDto[] = []

  constructor(private router: Router, private authService: AuthService, private materialService: MaterialService) {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.loadMaterials()
  }

  loadMaterials(): void {
    this.materialService.loadAll().subscribe({
      next: (data) => {
        this.materials = data
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

  stats = {
    materials: 13,
    users: 10,
    subjects: 6
  }

  countupOptions = {
    enableScrollSpy: true,
    duration: 2
  }

  latestUploads: string[] = [
    'Web Development — Exam Cheat Sheet.pdf',
    'Discrete Mathematics — Summary.pptx',
    'Object-Oriented Programming — Design Patterns Mindmap.png'
  ]


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
