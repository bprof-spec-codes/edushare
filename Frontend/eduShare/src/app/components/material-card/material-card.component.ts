import { Component, Input } from '@angular/core';
import { Material } from '../../models/material';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-material-card',
  standalone: false,
  templateUrl: './material-card.component.html',
  styleUrl: './material-card.component.sass'
})
export class MaterialCardComponent {
  constructor(private router: Router) { }

  @Input() m!: MaterialShortViewDto[];

  openMaterial(material: MaterialShortViewDto){
    this.router.navigate(['/materials/' + material.id + '/view'])
  }
}
