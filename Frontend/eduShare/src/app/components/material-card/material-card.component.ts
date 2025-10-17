import { Component, Input } from '@angular/core';
import { Material } from '../../models/material';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

@Component({
  selector: 'app-material-card',
  standalone: false,
  templateUrl: './material-card.component.html',
  styleUrl: './material-card.component.sass'
})
export class MaterialCardComponent {
  @Input() m!: MaterialShortViewDto[];

  
}
