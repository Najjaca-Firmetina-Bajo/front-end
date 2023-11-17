import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('RegisteredUser', [Validators.required]),
  });

  register(): void {
    if (this.registrationForm.valid) {
      const registration: Registration = {
        id: 0,
        username: this.registrationForm.value.username || '',
        password: this.registrationForm.value.password || '',
        role: 'RegisteredUser'
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
