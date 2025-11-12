import { Component, DestroyRef, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialViewDto } from '../../dtos/material-view-dto';
import { AuthService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { RatingService } from '../../services/rating.service';
import { RatingCreateDto } from '../../dtos/rating-create-dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RatingViewDto } from '../../dtos/rating-view-dto';

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

  ratingCreateModalOpen = false
  ratingCreating = false
  ratingCreateError: string | null = null
  public ratings$: Observable<RatingViewDto[]> = new Observable<RatingViewDto[]>()
  public ratingAverage$: Observable<number> = new Observable<number>()

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private router: Router,
    public auth: AuthService,
    private ratingService: RatingService,
  ) { }

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

    this.ratingsLoad(id)

  }

  recommendedMaterial(id: string) {
    this.material!.isRecommended = !this.material?.isRecommended;
    this.materialService.updateRecommended(id, this.material!.isRecommended).subscribe({
      next: () => console.log('Sikeres mentés!'),
      error: (err) => console.error('Hiba történt:', err)
    });
    console.log(this.material!.isRecommended);
  }

  downloadFile(base64: string | undefined, fileName: string | undefined): void {
    if (!base64 || !fileName) return

    const link = document.createElement('a')
    link.href = `data:application/octet-stream;base64,${base64}`
    link.download = fileName
    link.click()
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
    } else {
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

  ratingsLoad(id: string) {
    this.ratingService.getRatingsByMaterial(id).subscribe({
      next: () => {
        this.ratings$ = this.ratingService.ratings$
        this.ratingAverage$ = this.ratingService.ratingAverage$
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        console.error(err)
        alert('Could not load ratings.')
      }
    })
  }

  openRatingCreateModal() {
    this.ratingCreateModalOpen = true
    this.ratingCreateError = null
  }

  closeRatingCreateModal() {
    this.ratingCreateModalOpen = false
  }

  handleRatingCreate(event: RatingCreateDto) {
    if (!this.material) return
    this.ratingCreating = true
    this.ratingCreateError = null
    event.materialId = this.material.id
    this.ratingService.createRating(event).subscribe({
      next: () => {
        this.ratingCreating = false
        this.ratingCreateModalOpen = false
      },
      error: (err) => {
        console.error(err)
        this.ratingCreateError = "Could not create rating."
        this.ratingCreating = false
      }
    })
  }
}
