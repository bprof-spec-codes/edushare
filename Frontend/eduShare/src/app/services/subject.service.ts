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

  createSubject(subject: SubjectCreateDto): Observable<Subject> {
    return this.http.post<Subject>(`${environment.baseApiUrl}/api/Subject`, subject).pipe(
      tap(newSub => {
        const current = this._subjects$.value
        this._subjects$.next([...current, newSub])
      })
    )
  }

  updateSubject(subject: SubjectCreateDto, id: string): Observable<void> {
    return this.http.put<void>(`${environment.baseApiUrl}/api/Subject/${id}`, subject).pipe(
      tap(() => {
        const current = this._subjects$.value;
        const index = current.findIndex(s => s.id === id);
        if (index > -1) {
          const next = [...current];
          next[index] = { ...next[index], ...subject };
          this._subjects$.next(next);
        }
      })
    )
  }
}
