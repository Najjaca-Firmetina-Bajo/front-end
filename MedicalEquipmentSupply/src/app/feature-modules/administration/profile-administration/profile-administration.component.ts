import { Component, OnInit } from '@angular/core';
import { RegistredUser } from '../model/registred-user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompaniesService } from '../../companies/companies.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile-administration',
  templateUrl: './profile-administration.component.html',
  styleUrls: ['./profile-administration.component.css']
})
export class ProfileAdministrationComponent implements OnInit{

  currentUser!: RegistredUser;

  constructor(
    private authService: AuthService,
    private administrationService: AdministrationService,
    private companiesService: CompaniesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.administrationService.getRegisteredUser(this.userId).subscribe((user) => {
      this.currentUser = user;
    });
  }

  isEditing = false;
  showForm = false;
  userId: number;

  ngOnInit(): void {
    this.administrationService.getRegisteredUser(this.userId).subscribe((user) => {
      this.profileInfoForm.patchValue({
        id: user.id,
        activated: user.activated,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        city: user.city,
        companyInfo: user.companyInfo,
        country: user.country,
        occupation: user.occupation,
        password: user.password,  // Razmotrite sigurnosne aspekte prenosa lozinke.
        phoneNumber: user.phoneNumber,
        penal: user.penal,
      });
    });
  }

  getAuthenticatedUserId(): void {
    this.companiesService.getAuthenticatedUserId().subscribe(
      (userId: number) => {
        console.log('Authenticated User ID:', Number(userId));
        this.userId = Number(userId)
      },
      (error) => {
        console.error('Error getting authenticated user ID:', error);
      }
    );
  }

  profileInfoForm = new FormGroup({
    id: new FormControl(-1, [Validators.required]),
    activated: new FormControl(false, [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-z]*$')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-z]*$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    companyInfo: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    occupation: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    penal: new FormControl(-1, [Validators.required]),
  });

  startEditing() {
    this.isEditing = true; //izbaci
    this.showForm = true;
  }

  saveChanges() {
    /*if (this.profileInfoForm.valid) {
      this.isEditing = false; 
    }*/
    //this.edit()
    this.showForm = false;
  }

  edit(): void {
    if (this.profileInfoForm.valid) {
      const editedUser: RegistredUser = {
        id: this.currentUser.id,
        email: this.profileInfoForm.value.email || '',
        password: this.profileInfoForm.value.password || '',
        role: 'RegisteredUser',
        name: this.profileInfoForm.value.name || '',
        surname: this.profileInfoForm.value.surname || '',
        city: this.profileInfoForm.value.city || '',
        country: this.profileInfoForm.value.country || '',
        phoneNumber: this.profileInfoForm.value.phoneNumber || '',
        occupation: this.profileInfoForm.value.occupation || '',
        companyInfo: this.profileInfoForm.value.companyInfo || '',
        activated: this.profileInfoForm.value.activated || false,
        dtype: this.currentUser.dtype,
        appointmentsIds: this.currentUser.appointmentsIds,
        penal: this.profileInfoForm.value.penal || -1,
        companyId: this.currentUser.companyId
      };

      this.administrationService.edit(editedUser).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
      });
    } else {
      console.error('Form is invalid.');
    }
  }

}