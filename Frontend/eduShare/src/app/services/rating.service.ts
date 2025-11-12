import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RatingViewDto } from '../dtos/rating-view-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RatingService {


  private _ratings$ = new BehaviorSubject<RatingViewDto[]>([])
  public ratings$ = this._ratings$.asObservable()

  constructor(private http: HttpClient) { }

  getRatingsByMaterial(materialId: string): Observable<RatingViewDto[]> {
    return this.http.get<RatingViewDto[]>(`${environment.baseApiUrl}/Rating/material/${materialId}`).pipe(
      tap(res => this._ratings$.next(res))
    )
  }
}
