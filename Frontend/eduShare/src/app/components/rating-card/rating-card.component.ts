import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { map, Observable } from 'rxjs';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { ProfilListViewDto } from '../../dtos/profil-list-view-dto';
import { RatingViewDto } from '../../dtos/rating-view-dto';

@Component({
  selector: 'app-rating-card',
  standalone: false,
  templateUrl: './rating-card.component.html',
  styleUrl: './rating-card.component.sass'
})
export class RatingCardComponent implements OnInit {
  @Input() rating!: RatingViewDto
  public userList$: Observable<ProfilListViewDto[]> = new Observable<ProfilListViewDto[]>()
  public ratingUserMap$: Observable<Record<string, ProfilListViewDto>> = new Observable<Record<string, ProfilListViewDto>>()

  @Output() showFullComment = new EventEmitter<void>()
  maxCommentLength = 51
  commentModalOpen = false

  constructor(private profileService: ProfileService) { }

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

}
