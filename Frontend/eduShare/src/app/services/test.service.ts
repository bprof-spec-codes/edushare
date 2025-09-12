import { Injectable } from '@angular/core';
import { Test } from '../models/test.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  baseApiUrl: string = environment.baseApiUrl

  test: Test = new Test("")


  constructor(private http: HttpClient) { }

  getTest(): Observable<Test>{
    return this.http.get<Test>(this.baseApiUrl + "/api/Test")
  }

  loadTest(): void{
    this.getTest().subscribe({
      next: test => {
        this.test = test
      },
      error: (err) => {
        console.log("Error loading in test: ", err)
      }
    })
  }
}
