import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { CompanyAdministrator } from '../model/company-administrator.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from '../model/comapny.model';
import { SystemAdministrator } from '../model/system-administrator.model';

@Component({
  selector: 'app-system-admin-home-page',
  templateUrl: './system-admin-home-page.component.html',
  styleUrls: ['./system-admin-home-page.component.css']
})
export class SystemAdminHomePageComponent implements OnInit{
  
  showCompanyForm: boolean = false
  showCompanyAdministratorForm: boolean = false
  showSystemAdministratorForm: boolean = false
  showAdminsTable: boolean = false
  isAnyAvailableAdmin: boolean = true;
  currentCompanyName: string = ''
  companyAdminRegistrationForm: FormGroup;
  companyRegistrationForm: FormGroup;
  systemAdminRegistrationForm: FormGroup;
  availableAdministrators: CompanyAdministrator[] = []

  constructor(private administrationService: AdministrationService,
              private formBuilder: FormBuilder,
    ) {
    this.companyAdminRegistrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: ['CompanyAdministrator', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      company_info: ['', [Validators.required]],
    }, {
      validator: this.passwordMatchValidator
    });

    this.companyRegistrationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      rating: ['', [Validators.required]],
    }, {
      validator: this.addressAndRatingValidator
    });

    this.systemAdminRegistrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: ['SystemAdministrator', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      company_info: ['', [Validators.required]],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.getAvailableAdministrators()
  }

  addressAndRatingValidator(formGroup: FormGroup) {
    var address = formGroup.get('address');
    var rating = formGroup.get('rating');

    if (!address || !rating) {
      return null; // Ako neki od kontrola nije prisutan, preskoči validaciju
    }

    const addressPattern = /^[a-zA-Z0-9\s-]+-[0-9]+-[a-zA-Z0-9\s_]+-[a-zA-Z0-9\s_]+$/;
    const validAddress = addressPattern.test(address.value);

    const ratingValue = parseFloat(rating.value);
    const validRating = !isNaN(ratingValue) && ratingValue >= 0.0 && ratingValue <= 5.0;

    if (!validAddress) {
      address.setErrors({ invalidAddress: true });
    } else {
      address.setErrors(null);
    }

    if (!validRating) {
      rating.setErrors({ invalidRating: true });
    } else {
      rating.setErrors(null);
    }

    return null;
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

  addCompany(): void {
    this.showCompanyAdministratorForm = false;
    this.showSystemAdministratorForm = false;
    this.showCompanyForm = true;
  }

  addCompanyAdministrator(): void {
    this.showCompanyForm = false;
    this.showSystemAdministratorForm = false;
    this.showCompanyAdministratorForm = true;
  }

  addSystemAdministrator(): void {
    this.showCompanyForm = false;
    this.showCompanyAdministratorForm = false;
    this.showSystemAdministratorForm = true;
  }

  registerCompanyAdministrator(): void {
    if (this.companyAdminRegistrationForm.valid) {
      const newAdmin: CompanyAdministrator = {
        activated: false,
        role: 'CompanyAdministrator',
        companyId: 0,
        id: 0,
        dtype: '',
        city: this.companyAdminRegistrationForm.value.city,
        companyInfo: this.companyAdminRegistrationForm.value.company_info,
        country: this.companyAdminRegistrationForm.value.country,
        email: this.companyAdminRegistrationForm.value.email,
        name: this.companyAdminRegistrationForm.value.name,
        occupation: this.companyAdminRegistrationForm.value.occupation,
        password: this.companyAdminRegistrationForm.value.password,
        phoneNumber: this.companyAdminRegistrationForm.value.phone_number,
        surname: this.companyAdminRegistrationForm.value.surname,
        appointmentsIds: []
      };

      this.administrationService.registerCompanyAdmin(newAdmin).subscribe({
        next: () => {
          //this.router.navigate(['']); 
          this.companyAdminRegistrationForm.reset()
          this.showCompanyAdministratorForm = false;
          window.location.reload()
        },
      });
    } 
    else {
      console.error('Form is invalid.');
    }
  }

  registerCompany(): void {
    if (this.companyRegistrationForm.valid) {
      const newCompany: Company = {
        averageRating: this.companyRegistrationForm.value.rating,
        id: 0,
        address: this.companyRegistrationForm.value.address,
        name: this.companyRegistrationForm.value.name,
        availableEquipment: [],
        companyAdministratorIds: [],
        workingCalendarId: -1
      };

      this.administrationService.registerCompany(newCompany).subscribe({
        next: () => {
          //this.router.navigate(['']); 
          //this.companyRegistrationForm.reset()
          //this.showCompanyForm = false;
          this.currentCompanyName = newCompany.name;
          this.showAdminsTable = true;
        },
      });
    } 
    else {
      console.error('Form is invalid.');
    }
  }

  registerSystemAdministrator(): void {
    if (this.systemAdminRegistrationForm.valid) {
      const newAdmin: SystemAdministrator = {
        activated: false,
        role: 'SystemAdministrator',
        companyId: 0,
        id: 0,
        dtype: '',
        city: this.systemAdminRegistrationForm.value.city,
        companyInfo: this.systemAdminRegistrationForm.value.company_info,
        country: this.systemAdminRegistrationForm.value.country,
        email: this.systemAdminRegistrationForm.value.email,
        name: this.systemAdminRegistrationForm.value.name,
        occupation: this.systemAdminRegistrationForm.value.occupation,
        password: this.systemAdminRegistrationForm.value.password,
        phoneNumber: this.systemAdminRegistrationForm.value.phone_number,
        surname: this.systemAdminRegistrationForm.value.surname,
        passwordChanged: false
      };

      this.administrationService.registerSystemAdmin(newAdmin).subscribe({
        next: () => {
          //this.router.navigate(['']); 
          this.systemAdminRegistrationForm.reset()
          this.showSystemAdministratorForm = false;
          window.location.reload()
        },
      });
    } 
    else {
      console.error('Form is invalid.');
    }
  }

  findCompany(adminId: number) {
    this.administrationService.findCompany(this.currentCompanyName).subscribe({
      next: (result: Company) => {
        //this.router.navigate(['']); 
        this.addAdministrator(adminId, result.id)
      },
    });
  }

  addAdministrator(adminId: number, companyId: number) : void {
    this.administrationService.setCompanyAdministrator(adminId, companyId).subscribe({
      next: (result: number) => {
        //this.router.navigate(['']); 
        this.availableAdministrators.length = 0;
        this.getAvailableAdministrators()
      },
    });
  }

  finishCompanyRegistration(): void {
    this.companyRegistrationForm.reset()
    this.showCompanyForm = false;
    this.showAdminsTable = false;
  }

  getAvailableAdministrators(): void {
    this.administrationService.getAllCompanyAdministrators().subscribe({
        next: (result: CompanyAdministrator[]) => {
            result.forEach(administrator => {
              if(administrator.companyId === -1) {
                this.availableAdministrators.push(administrator);
              }
            })
            
            if(this.availableAdministrators.length === 0) this.isAnyAvailableAdmin = false;
        },
        error: () => {
            
        }
    });
  }
}
