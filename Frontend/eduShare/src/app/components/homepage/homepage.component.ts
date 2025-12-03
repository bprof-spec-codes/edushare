import { Component } from '@angular/core';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { Router } from '@angular/router';
import { NgxTypedJsModule } from 'ngx-typed-js';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent {
  constructor(private router: Router) {

  }

  showMaterials(): void {
    this.router.navigate(['/materials'])
  }


}
