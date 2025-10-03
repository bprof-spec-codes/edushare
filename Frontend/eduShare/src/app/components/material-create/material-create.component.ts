import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-material-create',
  standalone: false,
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.sass'
})
export class MaterialCreateComponent {
  materialForm: FormGroup
  fileBase64: string =''
  fileName: string = ''

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.materialForm= this.fb.group(
      {
        title: ['',Validators.required],
        description: [''],
        file: [null,Validators.required]
      }
    )
  }

  onFileSelected(event: Event){

  }

  onSubmit(){

  }
}
