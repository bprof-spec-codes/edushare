import { Component, Input } from '@angular/core';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';

@Component({
  selector: 'app-recommended-materials',
  standalone: false,
  templateUrl: './recommended-materials.component.html',
  styleUrl: './recommended-materials.component.sass'
})
export class RecommendedMaterialsComponent {
  
    @Input() materials: MaterialShortViewDto[] = [];

    onHorizontalScroll(event: WheelEvent) {
      const container = event.currentTarget as HTMLElement;

      if (event.deltaY !== 0) {
        event.preventDefault();
        container.scrollLeft += event.deltaY;
      }
    }



}
