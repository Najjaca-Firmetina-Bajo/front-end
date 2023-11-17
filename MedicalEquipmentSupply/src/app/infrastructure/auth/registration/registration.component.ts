import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
//import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(
    //private authService: AuthService,
    private router: Router
  ) {}
  
  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('Author', [Validators.required]),
  });


  

  register(): void {
  
    if (true) {
      const registration: Registration = {
        username: this.registrationForm.value.username || '',
        password: this.registrationForm.value.password || '',
        role: this.registrationForm.value.role || 'Author'
      };
  
      const formData = new FormData();

  
      if (this.registrationForm.valid) {
        //this.authService.register(formData).subscribe({
        //  next: () => {
        //    this.router.navigate(['home']);
        //  },
        //});
      }
      else{
        console.error(this.registrationForm.errors);
      }
    } else {
      console.error('Profile picture is null or undefined.');
    }
  }
  
  private isFile(value: any): value is File {
    return value instanceof File;
  }


}