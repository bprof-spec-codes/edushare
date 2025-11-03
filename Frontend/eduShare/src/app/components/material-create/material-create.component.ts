import { Component } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { MaterialFormValue } from '../material-form/material-form.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-material-create',
  standalone: false,
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.sass'
})
export class MaterialCreateComponent {
constructor(private materialService: MaterialService, private router: Router) {}

  onCreate(value: MaterialFormValue) {
    if (!value.content) {
      alert('Kérlek, válassz egy fájlt!')
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
        console.log('A tananyag sikeresen létre lett hozva.')
        this.router.navigate(['/materials'])
      },
      error: (err) => {
        console.error('Nem sikerült létrehozni a tananyagot', err)
        this.router.navigate(['/materials'])
      }
    })
  }


}
