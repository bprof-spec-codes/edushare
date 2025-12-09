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
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

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
  recommendedMaterials: any[] = [];


  ratingDeleteId: string | null = null
  ratingCreateModalOpen = false
  ratingCreating = false
  ratingCreateError: string | null = null
  public ratings$: Observable<RatingViewDto[]> = new Observable<RatingViewDto[]>()
  public ratingAverage$: Observable<number> = new Observable<number>()

  selectedComment: string = ''
  selectedUserName: string = ''
  commentModalOpen = false

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private router: Router,
    public auth: AuthService,
    private ratingService: RatingService,
    private toast: ToastService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.toast.show('Invalid ID.');
        return;
      }

      this.loadMaterial(id);
    });
  }



  loadMaterial(id: string) {
    this.currentUserId = this.auth.getUserId() || '';
    this.loading = true;

    this.materialService.getById(id).subscribe({
      next: (data) => {
        this.material = data;
        this.recommendedMaterials = data.recommendedMaterials || [];

        //console.log('Loaded material:', data);

        this.ratingsLoad(id);
      },
      error: (err) => {
        console.error('Error loading course material:', err);
        this.toast.show('The data could not be loaded.');
      }
    });
  }

  recommendedMaterial(id: string) {
    this.material!.isRecommended = !this.material?.isRecommended;
    this.materialService.updateRecommended(id, this.material!.isRecommended).subscribe({
      next: () => {
        //console.log('Save successfull!')
      },
      error: (err) => console.error('An error has occurred:', err)
    });
    //console.log(this.material!.isRecommended);
  }
  examMaterial(id: string) {
    this.material!.isExam = !this.material?.isExam;
    this.materialService.updateExam(id, this.material!.isExam).subscribe({
      next: () => {
        //console.log('Save successfull!')
      },
      error: (err) => console.error('An error has occurred:', err)
    });
    //console.log(this.material!.isExam);
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
    } else {
      this.toast.show('Preview is only available for PDF files.');
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

  async deleteMaterial(): Promise<void> {
    if (!this.material) return
    const confirmed = await this.confirmService.confirm('Are you sure you want to delete the material?')
    if (!confirmed) return
    this.materialService.delete(this.material.id).subscribe({
      next: () => {
        //console.log('The course material has been successfully deleted.')
        this.router.navigate(['/materials'])
      },
      error: (err) => {
        console.error(err)
        this.toast.show('The course material could not be deleted.')
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
        this.toast.show('Could not load ratings.')
      }
    })
  }

  openRatingCreateModal() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'])
      return
    }
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

  handleRatingDelete(event: string) {
    this.ratingService.deleteRating(event).subscribe({
      next: () => { },
      error: (err) => {
        console.error(err)
      }
    })
  }

  onHorizontalScroll(event: WheelEvent) {
    const container = event.currentTarget as HTMLElement;

    if (event.deltaY !== 0) {
      event.preventDefault();
      container.scrollLeft += event.deltaY;
    }
  }

  openCommentModal(userName: string, comment: string) {
    this.selectedUserName = userName
    this.selectedComment = comment
    this.commentModalOpen = true
  }

  closeCommentModal() {
    this.commentModalOpen = false
  }

  openSubjectMaterials(subjectId: string) {
    this.router.navigate(['/materials'], { queryParams: { subject: subjectId } });
  }
}