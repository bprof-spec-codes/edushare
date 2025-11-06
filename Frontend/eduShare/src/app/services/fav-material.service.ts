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



  constructor(private http: HttpClient) {}

  getAll():Observable<MaterialShortViewDto[]>{
    return this.http.get<MaterialShortViewDto[]>(`${this.apiBaseUrl}/favouriteMaterials`).pipe(
      tap( favMaterials =>{
        this._favMaterials$.next(favMaterials)
      })
    )
  }

  setFavouriteMaterial(id: string): Observable<MaterialShortViewDto>{
    return this.http.post<MaterialShortViewDto>(`${this.apiBaseUrl}/setFavouriteMaterial`, id, { headers: { 'Content-Type': 'text/plain' } }).pipe(
      tap(newFav => {
        const current = this._favMaterials$.value
        this._favMaterials$.next([...current, newFav])
      })
    )
  }
}
