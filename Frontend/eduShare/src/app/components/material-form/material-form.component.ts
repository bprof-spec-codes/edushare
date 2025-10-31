import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { MaterialCreateDto } from '../../dtos/material-create-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { formatCurrency } from '@angular/common';
import { FileContentDto } from '../../dtos/file-content-dto';
import { FileContent } from '../../models/file-content';

export interface MaterialFormValue {
  title: string
  subject: string
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

  constructor(private fb: FormBuilder, private fileService: FileService) { }

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
}
