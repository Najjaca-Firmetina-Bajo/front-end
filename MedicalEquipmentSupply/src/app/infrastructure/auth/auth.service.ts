import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';
import { Registration } from './model/registration.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService) { }

  register(registration: Registration): Observable<any> {
    const headers = new HttpHeaders({
    });
  
    return this.http.post(environment.wwwRoot + 'auth/signup', registration, { headers });
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired
    return !this.jwtHelper.isTokenExpired(token || '');
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public removeToken(): void {
    localStorage.removeItem('token');
  }

  login(credentials: { username: string; password: string }) {
    return this.http
      .post<any>(environment.wwwRoot + 'auth/login', credentials)
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            this.setToken(response.accessToken);
            console.log(response.accessToken);
          }
        }),
        catchError((error) => {
          // Handle error appropriately, e.g., log it or show a user-friendly message.
          console.error('Login failed:', error);
          // Rethrow the error to propagate it to the caller.
          return throwError(error);
        })
      );
  }

  logout() {
    this.removeToken();
  }


}
