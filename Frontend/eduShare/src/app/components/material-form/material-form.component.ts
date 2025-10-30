import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialCreateDto } from '../../dtos/material-create-dto';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { formatCurrency } from '@angular/common';
import { FileContentDto } from '../../dtos/file-content-dto';
import { FileContent } from '../../models/file-content';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject';
import { Observable, combineLatest, map, startWith } from 'rxjs';

export interface MaterialFormValue {
  title: string
  subject: string
  description?: string
  content?: FileContentDto
}

export function subjectValidator(subjects: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim() || '';
    const match = subjects.some(s => s.toLowerCase() === value.toLowerCase());
    return match ? null : { invalidSubject: true };
  };
}

@Component({
  selector: 'app-material-form',
  standalone: false,
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.sass'
})
export class MaterialFormComponent implements OnInit {
  @Input() initial?: Partial<MaterialFormValue>
  @Input() isUpdateMode = false
  @Output() submitted = new EventEmitter<MaterialFormValue>

  materialForm!: FormGroup
  content?: FileContentDto
  fileError = ''
  allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx']
  subjects$ = new Observable<Subject[]>
  filteredSubjects$ = new Observable<Subject[]>
  showDropdown = false

  constructor(private fb: FormBuilder, private fileService: FileService, private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.materialForm = this.fb.group({
      title: [this.initial?.title ?? '', Validators.required],
      subject: [this.initial?.subject ?? '', Validators.required],
      description: [this.initial?.description ?? '', Validators.maxLength(1500)],
      file: [null]
    })

    const fileControl = this.materialForm.get('file')
    if (this.isUpdateMode) {
      fileControl?.clearValidators()
    } else {
      fileControl?.setValidators([Validators.required])
    }
    fileControl?.updateValueAndValidity()

    this.subjects$ = this.subjectService.subjects$;
    this.subjects$.subscribe(subjects => {
      const subjectNames = subjects.map(s => s.name);

      const subjectControl = this.materialForm.get('subject');
      subjectControl?.setValidators([
        Validators.required,
        subjectValidator(subjectNames)
      ]);
      subjectControl?.updateValueAndValidity();
    });

    this.filteredSubjects$ = combineLatest([
      this.subjectService.subjects$,
      this.materialForm.get('subject')!.valueChanges.pipe(
        startWith(this.materialForm.get('subject')!.value || '')
      )
    ]).pipe(
      map(([subjects, search]) =>
        subjects.filter(s => s.name.toLowerCase().includes((search || '').toLowerCase()))
      )
    );
  }

  get description() {
    return this.materialForm.get('description')
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null

    this.fileError = ''

    if (!file) return

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!this.allowed.includes(fileExtension)) {
      this.fileError = 'Nem támogatott fájltípus. Kérlek, válassz egy érvényes fájlt. (pdf, doc, docx, ppt, pptx)'
      this.content = new FileContent()
      this.materialForm.get('file')?.setValue('')
      return
    }

    this.content = await this.fileService.toFileContent(file)
    this.materialForm.get('file')?.markAsDirty()
  }

  submit() {
    if (this.materialForm.invalid) {
      this.materialForm.markAllAsTouched()
      return
    }

    const dto: MaterialFormValue = {
      title: this.materialForm.value.title,
      subject: this.materialForm.value.subject,
      description: this.materialForm.value.description?.trim() || undefined,
      ...(this.materialForm.value.file ? { content: this.content } : {})
    }

    this.submitted.emit(dto)
  }

  selectSubject(subject: Subject) {
    this.materialForm.get('subject')?.setValue(subject.name);
    this.showDropdown = false;
  }

  hideDropdownWithDelay() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150);
  }
}
