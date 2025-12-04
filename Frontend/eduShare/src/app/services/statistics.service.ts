import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStatisticsDto } from '../dtos/admin-statistics-dto';
import { environment } from '../../environments/environment';
import { HomepageStatisticsDto } from '../dtos/homepage-statistics-dto';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.baseApiUrl}/api/Statistics`;

  constructor(private http: HttpClient) { }

  getAdminStatistics(): Observable<AdminStatisticsDto> {
    return this.http.get<AdminStatisticsDto>(`${this.apiUrl}/GetAdminStatisctics`);
  }

  getHomepageStatistics(): Observable<HomepageStatisticsDto> {
    return this.http.get<HomepageStatisticsDto>(`${this.apiUrl}/GetHomepageStatistics`);
  }
}
