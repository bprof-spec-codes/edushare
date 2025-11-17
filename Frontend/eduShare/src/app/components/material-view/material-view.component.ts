import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { AuthService } from '../../services/authentication.service';

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
  showFullDescription = false
  currentUserId = ''

  constructor(private route: ActivatedRoute, private materialService: MaterialService, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (!id) {
      alert('Érvénytelen azonosító.')
      return
    }
    this.currentUserId = this.auth.getUserId() || ''
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

  recommendedMaterial(id: string){
  this.material!.isRecommended=!this.material?.isRecommended;
  this.materialService.updateRecommended(id, this.material!.isRecommended).subscribe({
    next: () => console.log('Sikeres mentés!'),
    error: (err) => console.error('Hiba történt:', err)
  });
    console.log(this.material!.isRecommended);
  }
  examMaterial(id: string){
  this.material!.isExam=!this.material?.isExam;
  this.materialService.updateExam(id, this.material!.isExam).subscribe({
    next: () => console.log('Sikeres mentés!'),
    error: (err) => console.error('Hiba történt:', err)
  });
    console.log(this.material!.isExam);
  }

  downloadFile(base64: string | undefined, fileName: string | undefined): void {
    if (!base64 || !fileName || !this.material?.id) return

    const link = document.createElement('a')
    link.href = `data:application/octet-stream;base64,${base64}`
    link.download = fileName
    link.click()

    this.materialService.materialDownloaded(this.material.id).subscribe()
  }

  previewFile(): void {
    if (!this.material?.content) return

    const fileName = this.material.content.fileName;
    const base64 = this.material.content.file;
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (ext === 'pdf') {
      const byteCharacters = atob(base64);
      const byteArray = Uint8Array.from(byteCharacters, char => char.charCodeAt(0));
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }else {
      alert('Preview is only available for PDF files.');
    }
  }

  updateMaterial(): void {
    if (!this.material) return
    this.router.navigate(['/materials', this.material.id, 'update'])
  }

  toggleDescription(): void {
    this.showFullDescription = !this.showFullDescription
  }

  openProfile(id: string) {
    this.router.navigate(['/profile-view', id])
  }

  deleteMaterial(): void {
    if (!this.material) return
    if (!confirm('Biztosan törölni szeretnéd az anyagot?')) return
    this.materialService.delete(this.material.id).subscribe({
      next: () => {
        console.log('A tananyag sikeresen törölve lett.')
        this.router.navigate(['/materials'])
      },
      error: (err) => {
        console.error(err)
        alert('Nem sikerült törölni az tananyagot.')
      }
    })
  }
}
