import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { MaterialShortViewDto } from '../dtos/material-short-view-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FavMaterialService {

  private apiBaseUrl = `${environment.baseApiUrl}/api/material`

  private _favMaterials$ = new BehaviorSubject<MaterialShortViewDto[]>([])
  public favMaterials$ = this._favMaterials$.asObservable()

  constructor(private http: HttpClient) { }

  getAll(): Observable<MaterialShortViewDto[]> {
    return this.http.get<MaterialShortViewDto[]>(`${this.apiBaseUrl}/favouriteMaterials`).pipe(
      tap(favMaterials => {
        this._favMaterials$.next(favMaterials)
      })
    )
  }

  setFavouriteMaterial(id: string, material: MaterialShortViewDto): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/setFavouriteMaterial/${id}`, {}).pipe(
      tap(() => {
        const current = this._favMaterials$.value
        this._favMaterials$.next([...current, material])
      })
    )
  }

  removeFavouriteMaterial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/removeFavouriteMaterial/${id}`).pipe(
      tap(() => {
        const current = this._favMaterials$.value
        const next = current.filter(m => m.id !== id)
        this._favMaterials$.next(next)
      })
    )
  }
}
