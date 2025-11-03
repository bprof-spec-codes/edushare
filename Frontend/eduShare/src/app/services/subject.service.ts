import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from '../models/subject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private _subjects$ = new BehaviorSubject<Subject[]>([])
  subjects$ = this._subjects$.asObservable()

  constructor(private http: HttpClient) {
    this.getAllSubjects()
  }

  getAllSubjects() {
    this.http.get<Subject[]>(environment.baseApiUrl + "/api/Subject").subscribe({
      next: res => { 
        console.log(res)
        this._subjects$.next(res)
      },
      error: err => {
        console.log("Error getting subjects: " + err)
      }
    })
  }
}
