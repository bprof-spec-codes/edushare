import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { AdminStatisticsDto } from '../../dtos/admin-statistics-dto';
import { Router } from '@angular/router';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

@Component({
  selector: 'app-admin-statistics',
  standalone: false,
  templateUrl: './admin-statistics.component.html',
  styleUrl: './admin-statistics.component.sass'
})
export class AdminStatisticsComponent implements OnInit {
  statistics: AdminStatisticsDto | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private statisticsService: StatisticsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.error = null;
    
    this.statisticsService.getAdminStatistics().subscribe({
      next: (data: AdminStatisticsDto) => {
        this.statistics = data;
        this.loading = false;
        console.log('Statistics loaded:', data);
      },
      error: (err: any) => {
        console.error('Error loading statistics:', err);
        this.error = 'Failed to load statistics. Please try again.';
        this.loading = false;
      }
    });
  }

  viewMaterial(materialId: string): void {
    this.router.navigate(['/materials', materialId, 'view']);
  }

  getMaterialImageSrc(material: MaterialShortViewDto): string {
    const file = material.uploader?.image?.file;
    if (!file) return 'assets/default-material.png';
    return file.startsWith('http') ? file : `data:image/*;base64,${file}`;
  }
}
