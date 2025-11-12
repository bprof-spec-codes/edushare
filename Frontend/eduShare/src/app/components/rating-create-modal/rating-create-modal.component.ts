import { Component, EventEmitter, Input, input, OnChanges, OnInit, Output, output } from '@angular/core';
import { RatingCreateDto } from '../../dtos/rating-create-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rating-create-modal',
  standalone: false,
  templateUrl: './rating-create-modal.component.html',
  styleUrl: './rating-create-modal.component.sass'
})
export class RatingCreateModalComponent implements OnInit, OnChanges {
  @Input() materialid: string | undefined
  @Input() open = false
  @Input() loading = false
  @Input() error: string | null = null

  @Output() save = new EventEmitter<RatingCreateDto>()
  @Output() close = new EventEmitter<void>()


  stars = [1, 2, 3, 4, 5]
  hover = 0
  createForm!: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      rate: [0, [Validators.required, Validators.max(5), Validators.min(1)]],
      comment: ['', [Validators.maxLength(1000)]]
    })
  }

  ngOnChanges(): void {
    if (this.open) {
      this.createForm.reset({
        rate: 0,
        comment: ''
      })
      this.hover = 0
    }
  }

  submit() {
    if (this.createForm.valid) {
      const dto: RatingCreateDto = {
        materialId: this.materialid || '',
        rate: this.createForm.getRawValue().rate,
        comment: this.createForm.getRawValue()?.comment.trim() || '',
      }
      this.save.emit(dto)
    } else {
      this.createForm.markAllAsTouched()
    }
  }

  onCancel() {
    (document.activeElement as HTMLElement | null)?.blur?.()
    this.close.emit()
  }

  onStarEnter(s: number) {
    if (this.loading) return
    this.hover = s
  }

  onStarLeave() {
    this.hover = 0
  }

  onStarClick(s: number) {
    if (this.loading) return
    this.createForm.get('rate')?.setValue(s)
    this.createForm.get('rate')?.markAsTouched()
  }

  isStarOn(s: number): boolean {
    return this.hover ? s <= this.hover : s <= (this.createForm.value.rate || 0)
  }
}
