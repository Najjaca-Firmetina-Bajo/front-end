import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';
import { Registration } from './model/registration.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from './model/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject<User>({email: "", id: 0, role: "" });

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
            this.getAuthenticatedUserDetails().subscribe(
              (user) => {
                this.user$.next(user);
              },
              (error) => {
                console.error('Error getting authenticated user details:', error);
              }
            );
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
    this.router.navigate(['/home']).then(_ => {
      this.removeToken();
      this.user$.next({email: "", id: 0, role: "" });
      }
    );
  }

  getAuthenticatedUserId(): Observable<number> {
    const url = environment.wwwRoot + 'auth/who-am-i';

    return this.http.get<number>(url);
  }

  isSystemAdministrator(username: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'users/is-system-administrator/' + username);
  }

  updatePassword(password: string, username: string): Observable<Registration> {
    return this.http.put<Registration>(environment.apiHost + 'users/update-password/' + password + '/' + username, null);
  }

  updatePasswordChanged(adminId: number): void {
    this.http.put(environment.apiHost + 'systemAdministrators/update-password/' + adminId, null);
  }

  getAuthenticatedUserDetails(): Observable<User> {
    return this.http.get<User>(environment.wwwRoot + 'auth/who-am-i-detailed');
  }
}
