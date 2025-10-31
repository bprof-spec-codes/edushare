import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiBaseUrl = environment.baseApiUrl + '/api/User/Register'

  constructor(private http: HttpClient) {}

 register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    return this.http.post(`${this.apiBaseUrl}`, body);
  }
}

