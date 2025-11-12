import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  standalone: false,
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.sass'
})
export class RatingStarsComponent {
  @Input() rating: number | null = 0
  @Input() size = 1.25

  get roundedToHalf(): number {
    const r = this.rating ?? 0
    return Math.round(r * 2) / 2
  }

  get fullStars(): number {
    return Math.floor(this.roundedToHalf)
  }

  get hasHalfStar(): boolean {
    return this.roundedToHalf - this.fullStars === 0.5
  }

  get emptyStars(): number {
    return 5 - this.fullStars - (this.hasHalfStar ? 1 : 0)
  }

  get ariaLabel(): string {
    const val = (this.rating ?? 0).toFixed(1)
    return `Rating: 5/${val}`
  }
}