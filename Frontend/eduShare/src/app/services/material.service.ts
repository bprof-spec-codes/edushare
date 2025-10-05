import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
    )
  }

  create(material: MaterialCreateDto): Observable<Material> {
    const headers = { 'Authorization': `Bearer ${this.token}` }
    return this.http.post<Material>(this.apiBaseUrl, material, { headers }).pipe(
      map(data => Object.assign(new Material(), data)),
      tap(created => {
        const current = this.materialSubject.value
        this.materialSubject.next([...current, created])
      })
    )
  }

  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYmF0b3IiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjAwNGRiM2ExLWU5MWUtNGU1Zi05ZTBjLTQ2M2MxY2E0Njk0NiIsImV4cCI6MTc1OTc2NjgyMiwiaXNzIjoiZWR1c2hhcmUuY29tIiwiYXVkIjoiZWR1c2hhcmUuY29tIn0.MQysql8yygXwsDPHGRaGiB7BNuNmvj5u-RAya8Q9iaQ'
}
