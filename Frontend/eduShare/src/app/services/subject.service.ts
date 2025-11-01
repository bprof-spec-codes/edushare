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
    const subjects = [
      new Subject('1', 'Programozás alapjai', 1),
      new Subject('2', 'Objektumorientált programozás', 2),
      new Subject('3', 'Adatbázisok', 3),
      new Subject('4', 'Webfejlesztés', 5),
      new Subject('5', 'Szoftverfejlesztés', 3),
      new Subject('6', 'Számítógép-hálózatok', 3),
      new Subject('7', 'Operációs rendszerek', 2),
      new Subject('8', 'Algoritmusok és adatszerkezetek', 3),
      new Subject('9', 'Digitális technika', 1),
      new Subject('10', 'Számítógépes architektúrák', 4),
      new Subject('11', 'Mobilalkalmazás-fejlesztés', 4),
      new Subject('12', 'Mesterséges intelligencia alapjai', 5),
      new Subject('13', 'Gépitanulás', 5),
      new Subject('14', 'Kiberbiztonság', 4),
      new Subject('15', 'Számítógépes grafika', 3),
      new Subject('16', 'Ember-számítógép interakció', 2),
      new Subject('17', 'Projektmenedzsment', 2),
      new Subject('18', 'Informatikai rendszerek tervezése', 3),
      new Subject('19', 'Adatvédelem és etika', 4),
      new Subject('20', 'Üzleti informatika', 5),
      new Subject('21', 'Webes technológiák', 5),
      new Subject('22', 'Felhőalapú rendszerek', 5),
      new Subject('23', 'Hálózati protokollok', 3),
      new Subject('24', 'Tesztelés és hibakeresés', 4),
      new Subject('25', 'Internetes szolgáltatások fejlesztése', 5)
    ]

    this._subjects$.next(subjects)
  }

  getAllSubjects() {
    this.http.get<Subject[]>(environment.baseApiUrl + "/api/Subject").subscribe({
      next: res => { 
        this._subjects$.next(res)
      },
      error: err => {
        console.log("Error getting subjects: " + err)
      }
    })
  }
}
