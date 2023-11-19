import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  registrationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: ['RegisteredUser', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      companyInfo: ['', [Validators.required]],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    var a = formGroup.get('password');
    var b = formGroup.get('confirmPassword');
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
  
    return null;
  }

  register(): void {
    if (this.registrationForm.valid) {
      const registration: Registration = {
        id: 0,
        email: this.registrationForm.value.email || '',
        password: this.registrationForm.value.password || '',
        role: 'RegisteredUser',
        name: this.registrationForm.value.name || '',
        surname: this.registrationForm.value.surname || '',
        city: this.registrationForm.value.city || '',
        country: this.registrationForm.value.country || '',
        phoneNumber: this.registrationForm.value.phoneNumber || '',
        occupation: this.registrationForm.value.occupation || '',
        companyInfo: this.registrationForm.value.companyInfo || '',
      };

      this.authService.register(registration).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
      });
    } else {
      console.error('Form is invalid.');
    }
  }
}
