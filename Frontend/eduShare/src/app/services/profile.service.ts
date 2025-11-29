import { Injectable } from '@angular/core';
import { ProfilListViewDto } from '../dtos/profil-list-view-dto';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProfileViewDto } from '../dtos/profile-view-dto';
import { UpdateProfileDto } from '../dtos/update-profile-dto';
import { environment } from '../../environments/environment';
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

  private _currentProfile$ = new BehaviorSubject<ProfileViewDto>(new ProfileViewDto);
  public currentProfile$ = this._currentProfile$.asObservable();

  constructor(private http: HttpClient) 
  { }

  getCurrentProfile(id: string): Observable<ProfileViewDto> {
    return this.http.get<ProfileViewDto>(`${this.apiBaseUrl}/${id}`).pipe(
      tap(profile => this._currentProfile$.next(profile))
    );
  }

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
      
  update(id: string, profile: UpdateProfileDto) {
    return this.http.put(`${this.apiBaseUrl}/${id}`, profile).pipe(
      tap(() => this.getCurrentProfile(id).subscribe())
    );
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

  warnUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/Warn/${id}`, {})
  }

  removeWarning(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/RemoveWarning/${id}`, {})
  }

  banUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/Ban/${id}`, {})
  }

  unbanUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/Unban/${id}`, {})
  }
}
