import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, switchMap, take, tap } from 'rxjs';
import { MaterialShortViewDto } from '../dtos/material-short-view-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavMaterialService {

  private apiBaseUrl = `${environment.baseApiUrl}/api/material`

  private _favMaterials$ = new BehaviorSubject<MaterialShortViewDto[]>([])
  public favMaterials$ = this._favMaterials$.asObservable()

  readonly favIds$ = this._favMaterials$.pipe(
    map(list => new Set(list.map(m => m.id))),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  constructor(private http: HttpClient) { }

  clear() {
    this._favMaterials$.next([])
  }

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

  isFav$(id: string): Observable<boolean> {
    return this.favIds$.pipe(map(set => set.has(id)));
  }

  toggle$(material: MaterialShortViewDto): Observable<void> {
    return this.isFav$(material.id).pipe(
      take(1),
      switchMap(isFav => isFav
        ? this.removeFavouriteMaterial(material.id)
        : this.setFavouriteMaterial(material.id, material)
      )
    )
  }
}
