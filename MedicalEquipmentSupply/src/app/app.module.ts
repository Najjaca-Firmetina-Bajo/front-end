import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './feature-modules/layout/home/home.component';
import { LoginComponent } from './infrastructure/auth/login/login.component';
import { RegistrationComponent } from './infrastructure/auth/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SystemAdminHomePageComponent } from './feature-modules/administration/system-admin/system-admin-home-page.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Auth0 Angular JWT Module
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './infrastructure/auth/auth.service';
import { JwtInterceptor } from './infrastructure/auth/jwt/jwt.interceptor';
import { environment } from 'src/env/enviroment';
import { CompaniesComponent } from './feature-modules/companies/companies/companies.component';
import { EquipmentReviewComponent } from './feature-modules/administration/equipment-review/equipment-review/equipment-review.component';
import { CompanyAdminProfileComponent } from './feature-modules/administration/company-admin/company-admin-profile/company-admin-profile.component';
import { CompanyInfoComponent } from './feature-modules/companies/company-info/company-info.component';
import { NavbarComponent } from './feature-modules/layout/navbar/navbar.component';
import { UnregisteredCompaniesComponent } from './feature-modules/companies/unregistered-companies/unregistered-companies.component';
import { UnregisteredEqipmentComponent } from './feature-modules/companies/unregistered-eqipment/unregistered-eqipment.component';
import { FullCalendarModule } from '@fullcalendar/angular';
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
import { EditCompanyDialogComponent } from './feature-modules/edit-company-dialog/edit-company-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CompanyInfoAdminComponent } from './feature-modules/companies/company-info-admin/company-info-admin.component';
import { CreateAppointmentDialogComponent } from './feature-modules/companies/create-appointment-dialog/create-appointment-dialog.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { CreateEquipmentDialogComponent } from './feature-modules/companies/create-equipment-dialog/create-equipment-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    CompaniesComponent,
    SystemAdminHomePageComponent,
    EquipmentReviewComponent,
    CompanyAdminProfileComponent,
    CompanyInfoComponent,
    NavbarComponent,
    UnregisteredCompaniesComponent,
    UnregisteredEqipmentComponent,
    ChangePasswordFormComponent,
    AppointmentsComponent,
    ReservationReviewComponent,
    MapComponent,
    SimulatorComponent,
    ProfileAdministrationComponent,
    DownloadedAppointmentsComponent,
    NewAppointmentsComponent,
    RateCompanyComponent,
    UsersPenaltiesComponent,
    EditCompanyDialogComponent,
    CompanyInfoAdminComponent,
    CreateAppointmentDialogComponent,
    CreateEquipmentDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatMenuModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule, // Include this if you prefer moment.js for date handling
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          // Implement a function to retrieve the token from localStorage
          return localStorage.getItem('token');
        },
        allowedDomains: ['*'], // Allow tokens for all domains
        disallowedRoutes: [] // Specify routes that should not include the token
      }
    }),
    MatDialogModule,
    MatAutocompleteModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
