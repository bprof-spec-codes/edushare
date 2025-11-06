import { Component } from '@angular/core';
import { FavMaterialService } from '../../services/fav-material.service';
import { Observable } from 'rxjs';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

@Component({
  selector: 'app-fav-materials',
  standalone: false,
  templateUrl: './fav-materials.component.html',
  styleUrl: './fav-materials.component.sass'
})
export class FavMaterialsComponent {
  public favMaterials$: Observable<MaterialShortViewDto[]> = new Observable<MaterialShortViewDto[]>()

  constructor(public favMatService: FavMaterialService) {
    this.favMatService.getAll().subscribe()
    this.favMaterials$ = this.favMatService.favMaterials$
   }


}
