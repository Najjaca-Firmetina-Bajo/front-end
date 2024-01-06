import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/layout/home/home.component';
import { LoginComponent } from './infrastructure/auth/login/login.component';
import { RegistrationComponent } from './infrastructure/auth/registration/registration.component';
import { CompaniesComponent } from './feature-modules/companies/companies/companies.component';
import { SystemAdminHomePageComponent } from './feature-modules/administration/system-admin/system-admin-home-page.component';
import { EquipmentReviewComponent } from './feature-modules/administration/equipment-review/equipment-review/equipment-review.component';
import { CompanyAdminProfileComponent } from './feature-modules/administration/company-admin/company-admin-profile/company-admin-profile.component';
import { CompanyInfoComponent } from './feature-modules/companies/company-info/company-info.component';
import { ProfileAdministrationComponent } from './feature-modules/administration/profile-administration/profile-administration.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'system-admin-home-page', component: SystemAdminHomePageComponent },
  { path: 'equipment-review', component: EquipmentReviewComponent },
  { path: 'company-admin-profile', component: CompanyAdminProfileComponent },
  { path: 'company-info/:id', component: CompanyInfoComponent },
  { path: 'profile-info/:id', component: ProfileAdministrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
