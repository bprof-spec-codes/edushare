import { Component, EventEmitter, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SubjectCreateDto } from '../../dtos/subject-create-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subject-create-modal',
  standalone: false,
  templateUrl: './subject-create-modal.component.html',
  styleUrls: ['./subject-create-modal.component.sass']
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
      name: ['', [Validators.required]],
      semester: [null, [Validators.min(1), Validators.max(20)]],
      credit: [null, [Validators.min(0), Validators.max(30)]],
    })
  }

  submit() {
    if (this.createForm.valid) {
      const { name, semester, credit } = this.createForm.getRawValue();

      const formattedName = name ? name.charAt(0).toUpperCase() + name.slice(1) : name;

      this.save.emit({
        name: formattedName,
        semester,
        credit
      });
    }
  }

  onCancel() {
    this.close.emit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true && this.createForm) {
      this.createForm.reset({ name: '', semester: 1, credit: 0 });
    }
  }

}
