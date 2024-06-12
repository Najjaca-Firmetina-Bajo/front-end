import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { Observable } from 'rxjs';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service';
import { SystemAdministrator } from 'src/app/feature-modules/administration/model/system-administrator.model';
import {AdminCompanyLogging} from "../../../feature-modules/administration/model/admin-company-login.model";

@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loggedUserId: number = -1
  username: string = ""
  systemAdministrators: SystemAdministrator[] = []

  constructor(
    private authService: AuthService,
    private administrationService: AdministrationService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    isVerified: new FormControl()
  });

  login(): void {
    const login: Login = {
      username: this.loginForm.value.username || "",
      password: this.loginForm.value.password || "",
    };

    if (this.loginForm.valid) {
          this.authService.login(login).subscribe({
            next: () => {
              this.username = this.loginForm.value.username || "";
              this.getLoggedUser();
              //this.router.navigate(['/home']);
            },
            error: (error)=>{
            console.error('Login failed:', error); // Log the error for debugging
            alert('Incorrect username or password!');
          }
          });
        }
  }

  getLoggedUser(): void {
    this.authService.getAuthenticatedUserId().subscribe({
      next: (result: number) => {
          this.loggedUserId = result;
          this.getAllSystemAdministrators()
      },
      error: () => { }
    });
  }

  getAllSystemAdministrators(): void {
    this.administrationService.getAllSystemAdministrators().subscribe({
      next: (result: SystemAdministrator[]) => {
          this.systemAdministrators = result;
          this.investigateRole()
      },
      error: () => { }
    });
  }

  /*
  investigateRole(): void {
    this.authService.isSystemAdministrator(this.username).subscribe({
      next: (result: boolean) => {
          if(result) {
            this.systemAdministrators.forEach(sa => {
              if(sa.id === this.loggedUserId) {
                if(!sa.passwordChanged) {
                  this.router.navigate(['/change-password-form']);
                }
                else {
                  this.router.navigate(['/home']);
                }
              }

            })
          }
          else {
            this.router.navigate(['/home']);
          }
      },
      error: () => { }
    });
  }
   */
  investigateRole(): void {
    this.authService.isSystemAdministrator(this.username).subscribe({
      next: (isSystemAdmin: boolean) => {
        if (isSystemAdmin) {
          this.handleSystemAdministrator();
        } else {
          this.checkCompanyAdministrator();
        }
      },
      error: () => { }
    });
  }

  handleSystemAdministrator(): void {
    this.systemAdministrators.forEach(sa => {
      if (sa.id === this.loggedUserId) {
        if (!sa.passwordChanged) {
          this.router.navigate(['/change-password-form']);
        } else {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  checkCompanyAdministrator(): void {
    this.authService.isCompanyAdministrator(this.username).subscribe({
      next: (isCompanyAdmin: boolean) => {
        if (isCompanyAdmin) {
          this.checkPasswordChangedForCompanyAdmin();
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => { }
    });
  }

  checkPasswordChangedForCompanyAdmin(): void {
    this.authService.isPasswordChanged(this.username).subscribe({
      next: (adminLogging: AdminCompanyLogging) => {
        if (!adminLogging.passwordChanged) {
          this.router.navigate(['/change-password-form']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => { }
    });
  }

}
