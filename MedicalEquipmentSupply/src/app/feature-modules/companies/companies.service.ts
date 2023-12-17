import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private apiUrl = 'your-api-url'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiHost}companies/getAll`);
  }
}