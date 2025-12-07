import { Component } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { MaterialFormValue } from '../material-form/material-form.component';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-material-create',
  standalone: false,
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.sass'
})
export class MaterialCreateComponent {
constructor(private materialService: MaterialService, private router: Router, private toast: ToastService) {}

  onCreate(value: MaterialFormValue) {
    if (!value.content) {
      this.toast.show('Please choose file!')
      return
    }

    const dto = {
      title: value.title,
      subjectId: value.subjectId,
      description: value.description,
      content: value.content
    }

    this.materialService.create(dto).subscribe({
      next: () => {
        console.log('The material has been successfully created.')
        this.router.navigate(['/materials'])
      },
      error: (err) => {
        console.error('The material could not be created.', err)
        this.router.navigate(['/materials'])
      }
    })
  }


}
