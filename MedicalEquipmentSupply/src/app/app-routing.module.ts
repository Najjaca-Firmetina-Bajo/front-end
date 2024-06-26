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
import { UnregisteredEqipmentComponent } from './feature-modules/companies/unregistered-eqipment/unregistered-eqipment.component';
import { ChangePasswordFormComponent } from './infrastructure/auth/change-password-form/change-password-form.component';
import { AppointmentsComponent } from './feature-modules/companies/appointments/appointments.component';
import { ReservationReviewComponent } from './feature-modules/administration/reservation-review/reservation-review/reservation-review.component';
import { MapComponent } from './feature-modules/map/map.component';
import { SimulatorComponent } from './feature-modules/map/simulator/simulator.component';
import { ProfileAdministrationComponent } from './feature-modules/administration/profile-administration/profile-administration.component';
import { DownloadedAppointmentsComponent } from './feature-modules/companies/downloaded-appointments/downloaded-appointments.component';
import { NewAppointmentsComponent } from './feature-modules/companies/new-appointments/new-appointments.component';
import { RateCompanyComponent } from './feature-modules/companies/rate-company/rate-company.component';
import { UsersPenaltiesComponent } from './feature-modules/administration/users-penalties/users-penalties.component';
import {CompanyInfoAdminComponent} from "./feature-modules/companies/company-info-admin/company-info-admin.component";
import {
  UsersWithReservationComponent
} from "./feature-modules/administration/users-with-reservation/users-with-reservation.component";
import {
  DeliverOrderReservationComponent
} from "./feature-modules/administration/deliver-order-reservation/deliver-order-reservation.component";
import {AnalyticsReportComponent} from "./feature-modules/administration/analytics-report/analytics-report.component";
import {ContractsComponent} from "./feature-modules/administration/contracts/contracts.component";
import {ContractInfoComponent} from "./feature-modules/administration/contract-info/contract-info.component";



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'system-admin-home-page', component: SystemAdminHomePageComponent },
  { path: 'equipment-review', component: EquipmentReviewComponent },
  { path: 'company-admin-profile', component: CompanyAdminProfileComponent },
  { path: 'company-info/:id', component: CompanyInfoComponent },
  { path: 'company/:id', component: UnregisteredEqipmentComponent },
  { path: 'change-password-form', component: ChangePasswordFormComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'reservation-review', component: ReservationReviewComponent },
  { path: 'map', component: SimulatorComponent },
  { path: 'my-profile/:id', component: ProfileAdministrationComponent},
  { path: 'downloaded-appointments/:id', component: DownloadedAppointmentsComponent},
  { path: 'new-appointments/:id', component: NewAppointmentsComponent},
  { path: 'users-penal-points/:id', component: UsersPenaltiesComponent},
  { path: 'rate-company/:id', component: RateCompanyComponent},
  { path: 'admin-company-info', component: CompanyInfoAdminComponent},
  { path: 'users-with-reservation', component: UsersWithReservationComponent},
  { path: 'deliver-order', component: DeliverOrderReservationComponent},
  { path: 'analytics-report', component: AnalyticsReportComponent},
  { path: 'contracts', component: ContractsComponent},
  { path: 'contract-info/:id', component: ContractInfoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
