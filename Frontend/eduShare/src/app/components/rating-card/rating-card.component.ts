import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { map, Observable } from 'rxjs';
import { ProfilListViewDto } from '../../dtos/profil-list-view-dto';
import { RatingViewDto } from '../../dtos/rating-view-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rating-card',
  standalone: false,
  templateUrl: './rating-card.component.html',
  styleUrls: ['./rating-card.component.sass']
})
export class RatingCardComponent implements OnInit {
  @Input() rating!: RatingViewDto
  public userList$: Observable<ProfilListViewDto[]> = new Observable<ProfilListViewDto[]>()
  public ratingUserMap$: Observable<Record<string, ProfilListViewDto>> = new Observable<Record<string, ProfilListViewDto>>()

  @Output() showFullComment = new EventEmitter<void>()
  maxCommentLength = 51
  commentModalOpen = false

  constructor(private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.profileService.loadAll().subscribe()
    this.userList$ = this.profileService.profilessShort$
    this.ratingUserMap$ = this.userList$.pipe(
      map(users => Object.fromEntries(users.map(user => [user.id, user])))
    )
  }

  get isLongComment(): boolean {
    return (this.rating.comment?.length ?? 0) > this.maxCommentLength
  }

  onShowMore() {
    this.showFullComment.emit();
  }

  formatRatingDate(value: string | Date): string {
    if (!value) return ''

    const date = new Date(value)
    const now = new Date()

    const diffMs = now.getTime() - date.getTime()
    const isUnder24h = diffMs < 24 * 60 * 60 * 1000

    if (isUnder24h) {
      return date.toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }) + '.'
  }

  openProfile(userId: string) {
    this.router.navigate(['/profile-view', userId])
  }
}
