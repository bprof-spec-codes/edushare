import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { Material } from '../models/material';
import { MaterialCreateDto } from '../dtos/material-create-dto';
import { MaterialShortViewDto } from '../dtos/material-short-view-dto';
import { MaterialViewDto } from '../dtos/material-view-dto';
import { environment } from '../../environments/environment.development';
import { SearchDto } from '../dtos/search-dto';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiBaseUrl = environment.baseApiUrl + '/api/material'

  private materialShortSubject = new BehaviorSubject<MaterialShortViewDto[]>([])
  public materialsShort$ = this.materialShortSubject.asObservable()

  constructor(private http: HttpClient) { }

  loadAll(): Observable<MaterialShortViewDto[]> {
    return this.http.get<MaterialShortViewDto[]>(this.apiBaseUrl).pipe(
      tap(materials => this.materialShortSubject.next(materials))
    )
  }

  getById(id: string): Observable<MaterialViewDto> {
    return this.http.get<MaterialViewDto>(`${this.apiBaseUrl}/${id}`);
  }

  create(material: MaterialCreateDto): Observable<void> {
    return this.http.post<void>(this.apiBaseUrl, material).pipe(
      switchMap(() => this.http.get<MaterialShortViewDto[]>(this.apiBaseUrl)),
      tap(created => this.materialShortSubject.next(created)),
      map(() => void 0)
    )
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`).pipe(
      switchMap(() => this.http.get<MaterialShortViewDto[]>(this.apiBaseUrl)),
      tap(deleted => this.materialShortSubject.next(deleted)),
      map(() => void 0)
    )
  }

  update(id: string, material: MaterialCreateDto): Observable<void> {
    return this.http.put<void>(`${this.apiBaseUrl}/${id}`, material).pipe(
      switchMap(() => this.http.get<MaterialViewDto[]>(this.apiBaseUrl)),
      tap(updated => this.materialShortSubject.next(updated)),
      map(() => void 0)
    )
  }

  updateRecommended(id: string, isRecommended: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiBaseUrl}/${id}/recommended`, isRecommended).pipe(
      tap(() => {
        const current = this.materialShortSubject.getValue();
        const updated = current.map(m =>
          m.id === id ? { ...m, isRecommended } : m
        );
        this.materialShortSubject.next(updated);
      })
    );
  }

  searchMaterials(searchDto: SearchDto): Observable<MaterialShortViewDto[]> {
    return this.http.post<MaterialShortViewDto[]>(this.apiBaseUrl + "/searchMaterials", searchDto).pipe(
      tap(m => this.materialShortSubject.next(m))
    )
  }
}
