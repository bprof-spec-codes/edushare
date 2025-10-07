import { Injectable } from '@angular/core';
import { Register } from '../models/register';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiBaseUrl = 'http://localhost:5000/api/User/Register'

  constructor(private http: HttpClient) {}

  register(register: Register): Observable<any> {
    return this.http.post(this.apiBaseUrl, register);
  }
}
