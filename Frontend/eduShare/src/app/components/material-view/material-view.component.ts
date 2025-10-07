import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { ActivatedRoute } from '@angular/router';
import { MaterialViewDto } from '../../dtos/material-view-dto';

@Component({
  selector: 'app-material-view',
  standalone: false,
  templateUrl: './material-view.component.html',
  styleUrl: './material-view.component.sass'
})
export class MaterialViewComponent implements OnInit {
  material: MaterialViewDto | null = null
  loading = false
  error?: string

  constructor(private route: ActivatedRoute, private materialService: MaterialService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if(!id) {
      alert('Érvénytelen azonosító.')
      return
    }

    this.loading = true
    if (id) {
      this.materialService.getById(id).subscribe({
        next: (data) => {
          this.material = data
          console.log(this.material)
        },
        error: (err) => {
          console.error(err)
          alert('Nem sikerült betölteni az anyagot.')
        }
      })
    }
  }

  downloadFile(base64: string | undefined, fileName: string | undefined): void {
    if (!base64 || !fileName) return

    const link = document.createElement('a')
    link.href = `data:application/octet-stream;base64,${base64}`
    link.download = fileName
    link.click()
  }

}
