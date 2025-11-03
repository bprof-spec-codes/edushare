import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from '../../models/subject';
import { SubjectCreateDto } from '../../dtos/subject-create-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subject-update-form',
  standalone: false,
  templateUrl: './subject-update-form.component.html',
  styleUrl: './subject-update-form.component.sass'
})
export class SubjectUpdateFormComponent implements OnInit, OnChanges {
  @Input() subject!: Subject
  @Input() saving = false

  @Output() save = new EventEmitter<SubjectCreateDto>()
  @Output() cancel = new EventEmitter<void>()

  updateForm!: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: [this.subject.name, [Validators.required]],
      semester: [this.subject.semester, [Validators.required, Validators.min(1), Validators.max(20)]] 
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']?.currentValue && this.updateForm) {
      this.updateForm.patchValue({
        name: this.subject?.name ?? '',
        semester: this.subject?.semester ?? 1
      }, { emitEvent: false });
    }

  }

  submit() {
    if (this.updateForm.valid) {
      this.save.emit(this.updateForm.getRawValue())
    }
  }

  onCancel() {
    if (this.saving) return
    this.cancel.emit()
  }

}
