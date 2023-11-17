import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';
import { Registration } from './auth/model/registration.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private router: Router) { }

  register(registration: Registration): Observable<any> {
    const headers = new HttpHeaders({
    });
  
    return this.http.post(environment.apiHost + 'users/register', registration, { headers });
  }


}
