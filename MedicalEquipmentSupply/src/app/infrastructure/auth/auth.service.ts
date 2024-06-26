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
import {AdminCompanyLogging} from "../../feature-modules/administration/model/admin-company-login.model";


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

    if (token) {
      const user = this.getUserFromLocalStorage();

      if (user) {
        if (this.jwtHelper.isTokenExpired(token)) {
          this.logout();
          return false;
        }

        // User is logged in
        return true;
      }
    }

    // No token or user found
    return false;
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

  public setUserInLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalStorage(): User | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  public removeUserFromLocalStorage(): void {
    localStorage.removeItem('user');
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
                this.setUserInLocalStorage(user);
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
      this.removeUserFromLocalStorage();
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

  isCompanyAdministrator(username: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'users/is-company-administrator/' + username);
  }

  isPasswordChanged(username: string): Observable<AdminCompanyLogging> {
    return this.http.get<AdminCompanyLogging>(environment.apiHost + 'companyAdministrators/get-logging-info/' + username);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiHost + 'users/get-all');
  }

  changePassword(adminId: number, password: string): Observable<number> {
    return this.http.put<number>(environment.apiHost + 'systemAdministrators/update-password/' + adminId + '/' + password, null);
  }

  changePasswordCompanyAdmin(adminId: number, password: string): Observable<number> {
    return this.http.put<number>(environment.apiHost + 'companyAdministrators/update-password/' + adminId + '/' + password, null);
  }

  getAuthenticatedUserDetails(): Observable<User> {
    return this.http.get<User>(environment.wwwRoot + 'auth/who-am-i-detailed');
  }
}
