import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { MaterialService } from '../../services/material.service';
import { FileContent } from '../../models/file-content';
import { FileContentDto } from '../../dtos/file-content-dto';


@Component({
  selector: 'app-material-create',
  standalone: false,
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.sass'
})
export class MaterialCreateComponent {
  materialForm: FormGroup
  content: FileContentDto = new FileContent()

  fileError: string = ''
  allowedFileTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx']

  constructor(private fb: FormBuilder, private http: HttpClient, private fileService: FileService, private materialService: MaterialService) {
    this.materialForm = this.fb.group(
      {
        title: ['', Validators.required],
        description: [''],
        file: [null, Validators.required]
      }
    )
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null

    this.fileError = ''

    if (!file) return

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!this.allowedFileTypes.includes(fileExtension)) {
      this.fileError = 'Nem támogatott fájltípus. Kérlek, válassz egy érvényes fájlt. (pdf, doc, docx, ppt, pptx)'
      this.materialForm.patchValue({ file: null })
      this.content = new FileContent()
      return
    }

    this.content = await this.fileService.toFileContent(file)
    this.materialForm.patchValue({ file })
  }

  onSubmit() {
    if (this.materialForm.invalid || !this.content){
      alert("Kérlek töltsd ki a kötelező mezőket és válassz fájlt!")
      return
    }

    if (!this.content.file || !this.content.fileName || !this.materialForm.value.title) return

    const dto = {
      title: this.materialForm.value.title,
      subject: "Általános",
      description: this.materialForm.value.description,
      content: this.content
    }
    console.log('Feltöltendő JSON:', JSON.stringify(dto, null, 2))

    this.materialService.create(dto).subscribe({
      next: () => {
        console.log('Tananyag feltöltve')
        this.materialForm.reset()
        this.content = new FileContent()
      },
      error: (err) => {
        console.error("Sikertelen feltöltés", err)
        alert("Sikertelen feltöltés")
      }
    })
  }
}
