import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { RatingViewDto } from '../dtos/rating-view-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RatingCreateDto } from '../dtos/rating-create-dto';

@Injectable({
  providedIn: 'root'
})
export class RatingService {


  private _ratings$ = new BehaviorSubject<RatingViewDto[]>([])
  public ratings$ = this._ratings$.asObservable()

  private _ratingAverage$ = new BehaviorSubject<number>(0)
  public ratingAverage$ = this._ratingAverage$.asObservable()

  constructor(private http: HttpClient) { }

  private averageRate(list: RatingViewDto[]): void {
    const total = list.reduce((sum, r) => sum + r.rate, 0)
    const avg = list.length ? total / list.length : 0
    this._ratingAverage$.next(+avg.toFixed(1))
  }

  getRatingsByMaterial(materialId: string): Observable<RatingViewDto[]> {
    return this.http.get<RatingViewDto[]>(`${environment.baseApiUrl}/api/Rating/material/${materialId}`).pipe(
      map(res =>
        [...res].sort((a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        )
      ),
      tap(sorted => {
        this._ratings$.next(sorted);
        this.averageRate(sorted);
      })
    )
  }

  createRating(rating: RatingCreateDto): Observable<RatingViewDto> {
    return this.http.post<RatingViewDto>(`${environment.baseApiUrl}/api/Rating`, rating).pipe(
      tap(() => {
        this.getRatingsByMaterial(rating.materialId).subscribe()
      })
    )
  }

  deleteRating(ratingId: string): Observable<void> {
    return this.http.delete<void>(`${environment.baseApiUrl}/api/Rating/${ratingId}`).pipe(
      tap(() => {
        const current = this._ratings$.value
        const next = current.filter(s => s.id !== ratingId)
        this._ratings$.next(next)
        this.averageRate(next)
      })
    )
  }
}
