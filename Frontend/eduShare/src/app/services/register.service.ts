import { Injectable } from '@angular/core';
import { Register } from '../models/register';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiBaseUrl = environment.baseApiUrl + '/api/User/Register'

  constructor(private http: HttpClient) {}

  register(register: Register): Observable<any> {
    return this.http.post(this.apiBaseUrl, register);
  }
}
