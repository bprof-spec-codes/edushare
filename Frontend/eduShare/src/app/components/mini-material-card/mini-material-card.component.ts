import { Component, Input } from '@angular/core';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mini-material-card',
  standalone: false,
  templateUrl: './mini-material-card.component.html',
  styleUrl: './mini-material-card.component.sass'
})
export class MiniMaterialCardComponent {

  @Input({ required: true }) m!: MaterialShortViewDto

   constructor(private router: Router) {}

  onOpen() {
    this.router.navigate(['/materials/' + this.m.id + '/view']);
  
  }

}
