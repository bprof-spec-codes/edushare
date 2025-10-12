import { Component } from '@angular/core';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { MaterialService } from '../../services/material.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-list',
  standalone: false,
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.sass'
})
export class MaterialListComponent {
  materials: MaterialShortViewDto[] = []
  loading = false
  error?: string

  constructor(private materialService: MaterialService, private router: Router) { }
  ngOnInit(): void {
    this.loadMaterials()
  }

  loadMaterials(): void {
    this.loading = true
    this.materialService.loadAll().subscribe({
      next: (data) => {
        this.materials = data
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.error = 'Nem sikerült betölteni az anyagokat.'
        this.loading = false
      },
    })
  }

  openDetail(material: MaterialShortViewDto): void {
    this.router.navigate(['/materials/' + material.id + '/view'])
  }
}
