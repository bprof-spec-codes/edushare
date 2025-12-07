import { Component } from '@angular/core';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { MaterialService } from '../../services/material.service';
import { Router } from '@angular/router';
import { FavMaterialService } from '../../services/fav-material.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-material-list',
  standalone: false,
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.sass'
})
export class MaterialListComponent {
  materials: MaterialShortViewDto[] = []
  recommendedMaterials: MaterialShortViewDto[] = []
  nonRecommendedMaterials: MaterialShortViewDto[] = [];
  loading = false
  error?: string

  constructor(private materialService: MaterialService, private router: Router) { }
  ngOnInit(): void {
    this.loadMaterials()
  }

  trackById = (_: number, m: MaterialShortViewDto) => m.id;

  loadMaterials(): void {
    this.loading = true;
    this.materialService.materialsShort$.subscribe({
      next: (data) => {
        this.materials = data;
        this.recommendedMaterials = data.filter(m => m.isRecommended);
        this.nonRecommendedMaterials = data.filter(m => !m.isRecommended);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Nem sikerült betölteni az anyagokat.';
        this.loading = false;
      }
    });

    this.materialService.loadAll().subscribe();
  }


  openDetail(material: MaterialShortViewDto): void {
    this.router.navigate(['/materials/' + material.id + '/view'])
  }
  onChildDeleted(id: string): void {
  // minden listából kiszedjük
  this.materials = this.materials.filter(m => m.id !== id);
  this.recommendedMaterials = this.recommendedMaterials.filter(m => m.id !== id);
  this.nonRecommendedMaterials = this.nonRecommendedMaterials.filter(m => m.id !== id);
}
  
}
