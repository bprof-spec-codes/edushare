import { Component, Input } from '@angular/core';
import { Material } from '../../models/material';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-material-card',
  standalone: false,
  templateUrl: './material-card.component.html',
  styleUrl: './material-card.component.sass'
})
export class MaterialCardComponent {
  constructor(private router: Router, private profileService: ProfileService) { }

  @Input() m!: MaterialShortViewDto[];

  openMaterial(material: MaterialShortViewDto){
    this.router.navigate(['/materials/' + material.id + '/view'])
  }

  openProfile(id: string) {
    this.router.navigate(['/profile-view', id])
  }
}
