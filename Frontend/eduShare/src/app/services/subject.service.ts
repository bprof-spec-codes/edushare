import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Subject } from '../models/subject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
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
      tap(subjects => {
        const sortedSubjects = subjects.sort((a, b) => a.name.localeCompare(b.name))
        this._subjects$.next(sortedSubjects)
      })
    )
  }

  createSubject(subject: SubjectCreateDto): Observable<void> {
    return this.http.post<void>(`${environment.baseApiUrl}/api/Subject`, subject).pipe(
      tap(() => this.getAllSubjects().subscribe())
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

  deleteSubject(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.baseApiUrl}/api/Subject/${id}`).pipe(
      tap(() => {
        const current = this._subjects$.value
        const next = current.filter(s => s.id !== id)
        this._subjects$.next(next)
      })
    )
  }
}
