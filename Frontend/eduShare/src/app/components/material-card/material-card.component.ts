import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Material } from '../../models/material';
import { MaterialShortViewDto } from '../../dtos/material-short-view-dto';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { FavMaterialService } from '../../services/fav-material.service';
import { BehaviorSubject, combineLatest, finalize, map, materialize, Observable, of } from 'rxjs';
import { AuthService } from '../../services/authentication.service';

@Component({
  selector: 'app-material-card',
  standalone: false,
  templateUrl: './material-card.component.html',
  styleUrl: './material-card.component.sass'
})
export class MaterialCardComponent implements OnChanges, OnInit {
  @Input({ required: true }) m!: MaterialShortViewDto

  private materialId$ = new BehaviorSubject<string | null>(null)
  isFav$!: Observable<boolean>
  busy = false
  isLoggedIn: boolean = false

  constructor(private router: Router, private profileService: ProfileService, private favService: FavMaterialService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.isFav$ = combineLatest([
      this.materialId$,
      this.favService.favIds$
    ]).pipe(
      map(([id, set]) => !!id && set.has(id))
    )

    this.materialId$.next(this.m?.id || null)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.materialId$.next(this.m?.id || null)
  }

  toggleFavourite() {
    if(this.busy || ! this.m) return
    this.busy = true
    this.favService.toggle$(this.m).pipe(
      finalize(() => this.busy = false)
    ).subscribe()
  }

  openMaterial(material: MaterialShortViewDto) {
    this.router.navigate(['/materials/' + material.id + '/view'])
  }

  openProfile(id: string) {
    this.router.navigate(['/profile-view', id])
  }

  titleClass(): string {
    if(this.m.isExam) {
      return "isExam"
    }
    return "isNotExam"
  }
}
