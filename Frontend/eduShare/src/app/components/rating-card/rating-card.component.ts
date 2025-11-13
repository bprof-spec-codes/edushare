import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-card',
  standalone: false,
  templateUrl: './rating-card.component.html',
  styleUrl: './rating-card.component.sass'
})
export class RatingCardComponent {
  @Input() userName!: string
  @Input() rating!: number
  @Input() comment?: string
}
