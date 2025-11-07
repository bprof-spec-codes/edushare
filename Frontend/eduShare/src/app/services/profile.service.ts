import { Injectable } from '@angular/core';
import { ProfilListViewDto } from '../dtos/profil-list-view-dto';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProfileViewDto } from '../dtos/profile-view-dto';
import { UpdateProfileDto } from '../dtos/update-profile-dto';
import { environment } from '../../environments/environment.development';
import { SearchUploaderDto } from '../dtos/search-uploader-dto';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiBaseUrl = environment.baseApiUrl + '/api/User'
  
  private profileShortSubject = new BehaviorSubject<ProfilListViewDto[]>([])
  public profilessShort$ = this.profileShortSubject.asObservable()

  private _uploaders$ = new BehaviorSubject<SearchUploaderDto[]>([])
  public uploaders$ = this._uploaders$.asObservable()

  constructor(private http: HttpClient) 
  { }

  loadAll(): Observable<ProfilListViewDto[]> {
    return this.http.get<ProfilListViewDto[]>(this.apiBaseUrl).pipe(
      tap(profiles => this.profileShortSubject.next(profiles))
    )
  }

  loadUploaders(): Observable<SearchUploaderDto[]> {
    return this.http.get<SearchUploaderDto[]>(this.apiBaseUrl + "/GetUploaders").pipe(
      tap(uploaders => this._uploaders$.next(uploaders))
    )
  }

  getById(id: string): Observable<ProfileViewDto> {
      return this.http.get<ProfileViewDto>(`${this.apiBaseUrl}/${id}`);
    }
      
  update(id: string, profile: UpdateProfileDto): Observable<void> {
    return this.http.put<void>(`${this.apiBaseUrl}/${id}`, profile).pipe(
      switchMap(() => this.http.get<ProfileViewDto[]>(this.apiBaseUrl)),
      tap(updated => this.profileShortSubject.next(updated)),
      map(() => void 0)
    )
  }

  grantAdmin(id:string): Observable<void> {
    return this.http.get<void>(`${this.apiBaseUrl}/GrantAdmin/${id}`)
  }
   
  grantTeacher(id:string): Observable<void> {
    return this.http.get<void>(`${this.apiBaseUrl}/GrantTeacher/${id}`)
  }

  revokeRole(id:string): Observable<void> {
    return this.http.get<void>(`${this.apiBaseUrl}/RevokeRole/${id}`)
  }
}
