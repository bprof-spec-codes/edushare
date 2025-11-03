import { Component, EventEmitter, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SubjectCreateDto } from '../../dtos/subject-create-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subject-create-modal',
  standalone: false,
  templateUrl: './subject-create-modal.component.html',
  styleUrl: './subject-create-modal.component.sass'
})
export class SubjectCreateModalComponent implements OnInit, OnChanges {
  @Input() open = false
  @Input() loading = false
  @Input() error: string | null = null

  @Output() save = new EventEmitter<SubjectCreateDto>()
  @Output() close = new EventEmitter<void>()

  createForm!: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      semester: [null, Validators.max(20)],
    })
  }

  submit() {
    if (this.createForm.valid) {
      this.save.emit(this.createForm.getRawValue())
    }
  }

  onCancel() {
    this.close.emit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true && this.createForm) {
      this.createForm.reset({ name: '', semester: 1 });
    }
  }

}
