import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from '../models/subject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubjectService implements OnInit{
  private _subjects$ = new BehaviorSubject<Subject[]>([])
  subjects$ = this._subjects$.asObservable()

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const subjects = [
      new Subject('1', 'Programozás alapjai'),
      new Subject('2', 'Objektumorientált programozás'),
      new Subject('3', 'Adatbázisok'),
      new Subject('4', 'Webfejlesztés'),
      new Subject('5', 'Szoftverfejlesztés'),
      new Subject('6', 'Számítógép-hálózatok'),
      new Subject('7', 'Operációs rendszerek'),
      new Subject('8', 'Algoritmusok és adatszerkezetek'),
      new Subject('9', 'Digitális technika'),
      new Subject('10', 'Számítógépes architektúrák'),
      new Subject('11', 'Mobilalkalmazás-fejlesztés'),
      new Subject('12', 'Mesterséges intelligencia alapjai'),
      new Subject('13', 'Gépitanulás'),
      new Subject('14', 'Kiberbiztonság'),
      new Subject('15', 'Számítógépes grafika'),
      new Subject('16', 'Ember–számítógép interakció'),
      new Subject('17', 'Projektmenedzsment'),
      new Subject('18', 'Informatikai rendszerek tervezése'),
      new Subject('19', 'Adatvédelem és etika'),
      new Subject('20', 'Üzleti informatika'),
      new Subject('21', 'Webes technológiák'),
      new Subject('22', 'Felhőalapú rendszerek'),
      new Subject('23', 'Hálózati protokollok'),
      new Subject('24', 'Tesztelés és hibakeresés'),
      new Subject('25', 'Internetes szolgáltatások fejlesztése')
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
