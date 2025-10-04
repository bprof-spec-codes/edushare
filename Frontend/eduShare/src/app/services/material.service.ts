import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Material } from '../models/material';
import { MaterialCreateDto } from '../dtos/material-create-dto';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiBaseUrl = 'http://localhost:5000/api/material'

  private materialSubject = new BehaviorSubject<Material[]>([])
  public materials$ = this.materialSubject.asObservable()

  constructor(private http: HttpClient) { }

  loadAll(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiBaseUrl).pipe(
      tap(materials => this.materialSubject.next(materials))
    );
  }

  create(material: MaterialCreateDto): Observable<Material> {
    return this.http.post<Material>(this.apiBaseUrl, material).pipe(
      tap(created => {
        const current = this.materialSubject.value
        this.materialSubject.next([...current, created])
      })
    )
  }
}
