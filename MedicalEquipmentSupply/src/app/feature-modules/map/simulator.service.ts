// simulation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private apiUrl = 'http://localhost:8080/api/simulator/start-simulation';

  constructor(private http: HttpClient) { }

  startSimulation(frequency: number): Observable<void> {
    const url = `${this.apiUrl}?frequency=${frequency}`;
    return this.http.get<void>(url);
  }
}
