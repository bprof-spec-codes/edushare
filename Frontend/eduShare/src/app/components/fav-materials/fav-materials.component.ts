import { Component, OnInit } from '@angular/core';
import { FavMaterialService } from '../../services/fav-material.service';
import { Observable } from 'rxjs';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

@Component({
  selector: 'app-fav-materials',
  standalone: false,
  templateUrl: './fav-materials.component.html',
  styleUrls: ['./fav-materials.component.sass']
})
export class FavMaterialsComponent implements OnInit {
  public favMaterials$: Observable<MaterialShortViewDto[]> = new Observable<MaterialShortViewDto[]>()

  constructor(public favMatService: FavMaterialService) { }

  trackById = (_: number, m: MaterialShortViewDto) => m.id;

  ngOnInit(): void {
    this.favMatService.getAll().subscribe({
      next: () => {
        this.favMaterials$ = this.favMatService.favMaterials$
      },
      error: (error) => {
        console.error(error)
      }
    })
  }
}
