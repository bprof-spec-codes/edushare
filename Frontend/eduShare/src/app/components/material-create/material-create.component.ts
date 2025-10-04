import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { MaterialService } from '../../services/material.service';
import { FileContent } from '../../models/file-content';


@Component({
  selector: 'app-material-create',
  standalone: false,
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.sass'
})
export class MaterialCreateComponent {
  materialForm: FormGroup
  content: FileContent={fileName:'', file:''}

  constructor(private fb: FormBuilder, private http: HttpClient, private fileService: FileService, private materialService: MaterialService) {
    this.materialForm= this.fb.group(
      {
        title: ['',Validators.required],
        description: [''],
        file: [null,Validators.required]
      }
    )
  }

  async onFileSelected(event: Event){
    const file = (event.target as HTMLInputElement).files?.[0] || null
    if(!file) return

    this.content = await this.fileService.toFileContent(file)
    this.materialForm.patchValue({file})
  }

  onSubmit(){
    if(this.materialForm.invalid || !this.content) return

    const dto = {
      title: this.materialForm.value.title,
      description: this.materialForm.value.description,
      content: this.content
    }

    this.materialService.create(dto).subscribe({
      next: () => {
        console.log('Tananyag feltöltve')
        this.materialForm.reset()
        this.content={fileName:'', file:''}
      },
      error: (err) => {
        console.error("Sikertelen feltöltés",err)
      }
    })
  }
}
