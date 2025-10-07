import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private materialService: MaterialService, private router: Router) {}

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

  deleteMaterial(): void {
    if (!this.material) return
    if (!confirm('Biztosan törölni szeretnéd az anyagot?')) return
    this.materialService.delete(this.material.id).subscribe({
      next: () => {
        console.log('A tananyag sikeresen törölve lett.')
        this.router.navigate(['/list-materials'])
      },
      error: (err) => {
        console.error(err)
        alert('Nem sikerült törölni az tananyagot.')
      }
    })
  }
}
