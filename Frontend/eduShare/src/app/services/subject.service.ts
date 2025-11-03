import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Subject } from '../models/subject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { SubjectCreateDto } from '../dtos/subject-create-dto';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private _subjects$ = new BehaviorSubject<Subject[]>([])
  subjects$ = this._subjects$.asObservable()

  constructor(private http: HttpClient) {
    this.getAllSubjects()
  }

  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${environment.baseApiUrl}/api/Subject`).pipe(
      tap(subjects => this._subjects$.next(subjects))
    )
  }

  createSubject(subject: SubjectCreateDto): Observable<any> {
    return this.http.post<any>(`${environment.baseApiUrl}/api/Subject`, subject).pipe(
      tap(newSub => {
        const current = this._subjects$.value
        this._subjects$.next([...current, newSub])
      })
    )
  }
}
