import { Injectable } from '@angular/core';
import { ProfilListViewDto } from '../dtos/profil-list-view-dto';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProfileViewDto } from '../dtos/profile-view-dto';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiBaseUrl = 'http://localhost:5000/api/User'
  
    private profileShortSubject = new BehaviorSubject<ProfilListViewDto[]>([])
    public profilessShort$ = this.profileShortSubject.asObservable()

  constructor(private http: HttpClient) 
  { }

  loadAll(): Observable<ProfilListViewDto[]> {
      return this.http.get<ProfilListViewDto[]>(this.apiBaseUrl).pipe(
        tap(profiles => this.profileShortSubject.next(profiles))
      )
    }
    getById(id: string): Observable<ProfileViewDto> {
        return this.http.get<ProfileViewDto>(`${this.apiBaseUrl}/${id}`);
      }
}
