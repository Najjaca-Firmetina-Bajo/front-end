import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {User} from "../model/user.model";

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.css']
})
export class ChangePasswordFormComponent implements OnInit{

  changePasswordForm: FormGroup;
  loggedUserId: number = -1;

  constructor(private authService: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
      this.getLoggedUser();
  }

  getLoggedUser(): void {
    this.authService.getAuthenticatedUserId().subscribe({
      next: (result: number) => {
          this.loggedUserId = result;
      },
      error: () => { }
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    var a = formGroup.get('password');
    var b = formGroup.get('confirm');
    const password = a;
    const confirmPassword = b;

    if (password && confirmPassword) {
      const match = password.value === confirmPassword.value;
      if (!match) {
        confirmPassword.setErrors({ passwordMismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  /*
  changePassword(): void {
    this.authService.changePassword(this.loggedUserId, this.changePasswordForm.value.password).subscribe({
      next: (result: number) => {
        this.router.navigate(['/home']);
      },
      error: () => { }
    });
  }
   */
  changePassword(): void {
    this.authService.getAuthenticatedUserDetails().subscribe({
      next: (user: User) => {
        if (user.role === 'SYSTEM_ADMINISTRATOR') {
          this.authService.changePassword(this.loggedUserId, this.changePasswordForm.value.password).subscribe({
            next: () => {
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error('Password change failed:', error);
            }
          });
        } else if (user.role === 'COMPANY_ADMINISTRATOR') {
          this.authService.changePasswordCompanyAdmin(this.loggedUserId, this.changePasswordForm.value.password).subscribe({
            next: () => {
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error('Password change failed:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Failed to fetch user details:', error);
      }
    });
  }
}
