import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rating-comment-modal',
  standalone: false,
  templateUrl: './rating-comment-modal.component.html',
  styleUrl: './rating-comment-modal.component.sass'
})
export class RatingCommentModalComponent {
  @Input() open = false
  @Input() userName = ''
  @Input() comment = ''

  @Output() close = new EventEmitter<void>()

  onClose() {
    this.close.emit()
  }
}
