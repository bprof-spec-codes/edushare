import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialCreateDto } from '../../dtos/material-create-dto';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { formatCurrency } from '@angular/common';
import { FileContentDto } from '../../dtos/file-content-dto';
import { FileContent } from '../../models/file-content';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject';
import { Observable, combineLatest, map, startWith, tap } from 'rxjs';

export interface MaterialFormValue {
  title: string
  subjectId: string
  description?: string
  content?: FileContentDto
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
  disableDefault = false

  constructor(private fb: FormBuilder, private fileService: FileService, private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.materialForm = this.fb.group({
      title: [this.initial?.title ?? '', Validators.required],
      subject: [this.initial?.subjectId ?? '', Validators.required],
      description: [this.initial?.description ?? '', Validators.maxLength(1500)],
      file: [null]
    })

    if (this.materialForm.value.subject) {
      this.disableDefault = true;
    }

    const fileControl = this.materialForm.get('file')
    if (this.isUpdateMode) {
      fileControl?.clearValidators()
    } else {
      fileControl?.setValidators([Validators.required])
    }
    fileControl?.updateValueAndValidity()

    this.subjects$ = this.subjectService.getAllSubjects().pipe(
      map(subjects => subjects.slice().sort((a, b) => a.name.localeCompare(b.name)))
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
      this.fileError = 'Unsupported file type. Please select a valid file. (pdf, doc, docx, ppt, pptx)'
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
      subjectId: this.materialForm.value.subject,
      description: this.materialForm.value.description?.trim() || undefined,
      ...(this.materialForm.value.file ? { content: this.content } : {})
    }

    console.log(dto)

    this.submitted.emit(dto)
  }

  onSubjectChange() {
    this.disableDefault = true
  }
}
