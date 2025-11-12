import { Component, EventEmitter, Input, input, OnInit, Output, output } from '@angular/core';
import { RatingCreateDto } from '../../dtos/rating-create-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rating-create-modal',
  standalone: false,
  templateUrl: './rating-create-modal.component.html',
  styleUrl: './rating-create-modal.component.sass'
})
export class RatingCreateModalComponent implements OnInit {
  @Input() materialid: string | null = ''
  @Input() open = false
  @Input() loading = false
  @Input() error: string | null = null

  @Output() save = new EventEmitter<RatingCreateDto>()
  @Output() close = new EventEmitter<void>()

  createForm!: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      rate: [0, [Validators.required, Validators.max(5), Validators.min(0)]],
      comment: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]]
    })
  }

  submit() {
    if (this.createForm.valid){
      const dto: RatingCreateDto = {
        materialId: this.materialid || '',
        ...this.createForm.getRawValue()
      }
      this.save.emit(dto)
    } else {
      this.createForm.markAllAsTouched()
    }
  }
}
