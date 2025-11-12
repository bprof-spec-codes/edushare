import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RatingViewDto } from '../dtos/rating-view-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
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

  private averageRate(): void {
    const total = this._ratings$.value.reduce((sum, rating) => sum + rating.rate, 0)
    const average = this._ratings$.value.length ? total / this._ratings$.value.length : 0
    this._ratingAverage$.next(average)
  }

  getRatingsByMaterial(materialId: string): Observable<RatingViewDto[]> {
    return this.http.get<RatingViewDto[]>(`${environment.baseApiUrl}/Rating/material/${materialId}`).pipe(
      tap(res => {
        this._ratings$.next(res)
        const total = res.reduce((sum, rating) => sum + rating.rate, 0)
        this.averageRate()
      })
    )
  }

  createRating(rating: RatingCreateDto): Observable<RatingViewDto> {
    return this.http.post<RatingViewDto>(`${environment.baseApiUrl}/Rating`,rating).pipe(
      tap(newRating=>{
        const current = this._ratings$.value
          this._ratings$.next([...current,newRating])
          this.averageRate()
      })
    )
  }

  deleterating(ratingId: string): Observable<void>{
    return this.http.delete<void>(`${environment.baseApiUrl}/Rating/${ratingId}`).pipe(
      tap(()=>{        
        const current = this._ratings$.value
        const next = current.filter(s => s.id !== ratingId)
        this._ratings$.next(next)
        this.averageRate()
      })
    )
  }
}
