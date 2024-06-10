import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { WorkingCalendar } from '../../model/working-calendar.model';
import { WorkingDay } from '../../model/wrking-day.model';
import { Appointment } from '../../model/appointment.model';
import { AdministrationService } from '../../administration.service';
import { Equipment } from '../../model/equipment.model';
import { RegistredUser } from '../../model/registred-user.model';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CompanyAdministrator } from '../../model/company-administrator.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { QRCodeDto } from '../../model/qrcode.model';
import {AdminInfo} from "../../model/admin-info.model";
import {MatDialog} from "@angular/material/dialog";
import {EditAdminDialogComponent} from "../../edit-admin-dialog/edit-admin-dialog.component";
import {ResetPasswordDialogComponent} from "../../reset-password-dialog/reset-password-dialog.component";

@Component({
  selector: 'app-company-admin-profile',
  templateUrl: './company-admin-profile.component.html',
  styleUrls: ['./company-admin-profile.component.css']
})
export class CompanyAdminProfileComponent implements OnInit {

  calendarEvents: EventInput[] = [];
  calendarFlag: boolean = false

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth', //dayGridMonth, dayGridWeek, dayGridYear
    events: this.calendarEvents,
    eventTimeFormat: { // Objekat koji definiše format vremena
      hour: 'numeric', // Prikaz sata
      minute: '2-digit', // Prikaz minuta
      meridiem: false, // Da li prikazivati AM/PM
      hour12: false
    },
    eventColor: '#E53935',
    eventDisplay: 'block'
  };

  @ViewChild(FullCalendarComponent) fullCalendar!: FullCalendarComponent;

  workingCalendar: WorkingCalendar = {
    id: -1,
    companyId: -1,
    workingDaysIds: []
  }
  workingDays: WorkingDay[] = []
  allAppointments: Appointment[] = []
  allQRCodes: QRCodeDto[] = []
  registeredUsers: RegistredUser[] = []

  selectedRange: string = 'month'

  admin: AdminInfo | null = null;

  loggedCA: CompanyAdministrator = {
    activated: false,
    role: '',
    companyId: 0,
    id: 0,
    dtype: '',
    city: '',
    companyInfo: '',
    country: '',
    email: '',
    name: '',
    occupation: '',
    password: '',
    phoneNumber: '',
    surname: '',
    appointmentsIds: []
  }

  caName: String = ""

  companyAdmins: CompanyAdministrator[] = []

  constructor(private administrationService: AdministrationService,
              private router: Router,
              private authService: AuthService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllCompanyAdministrators()
  }

  backToPerviousPage(): void {
    this.router.navigate(['/home']);
  }

  getAllCompanyAdministrators(): void {
    this.administrationService.getAllCompanyAdministrators().subscribe({
      next: (result: CompanyAdministrator[]) => {
          this.companyAdmins = result;
          this.getLoggedUser();
      },
      error: () => { }
    });
  }

  getLoggedUser(): void {
    this.authService.getAuthenticatedUserId().subscribe({
      next: (result: number) => {
          this.investigate(result);
      },
      error: () => { }
    });
  }

  changeCalendarPerspective(): void {
    if(this.selectedRange === 'week') {
      this.calendarOptions = {
        ...this.calendarOptions,
        initialView: 'dayGridWeek'
      }

      if(this.fullCalendar) {
        this.fullCalendar.getApi().changeView('dayGridWeek');
      }
    }
    else if(this.selectedRange === 'month') {
      this.calendarOptions = {
        ...this.calendarOptions,
        initialView: 'dayGridMonth'
      }

      if(this.fullCalendar) {
        this.fullCalendar.getApi().changeView('dayGridMonth');
      }
    }
    else {
      this.calendarOptions = {
        ...this.calendarOptions,
        initialView: 'dayGridYear'
      }

      if(this.fullCalendar) {
        this.fullCalendar.getApi().changeView('dayGridYear');
      }
    }
  }

  investigate(userId: number): void {
    this.companyAdmins.forEach(ca => {
      if(ca.id === userId) {
        this.loggedCA = ca;
        this.caName = "CA profile of " + ca.name + " " + ca.surname
        this.getWorkingCalednar()
        this.getAdminInfo(ca.id);
      }
    })
  }

  getWorkingCalednar(): void {
    this.administrationService.getWorkingCalendar(this.loggedCA.companyId).subscribe({
      next: (result: WorkingCalendar) => {
          this.workingCalendar = result;
          this.getWorkingDays()
      },
      error: () => { }
   });
  }

  getWorkingDays(): void {
    this.administrationService.getWorkingDays(this.workingCalendar.id).subscribe({
      next: (result: WorkingDay[]) => {
          this.workingDays = result;
          this.getAppointments()
      },
      error: () => { }
   });
  }

  getAppointments(): void {
    this.administrationService.getAllAppointments().subscribe({
      next: (result: Appointment[]) => {
          this.allAppointments = result;
          this.getAllRegisteredUsers()
      },
      error: () => { }
   });
  }

  getAllRegisteredUsers(): void {
    this.administrationService.getAllRegisteredUsers().subscribe({
      next: (result: RegistredUser[]) => {
          this.registeredUsers = result;
          this.getAllQRCodes()
      },
      error: () => { }
   });
  }

  getAllQRCodes(): void {
    this.administrationService.getAllQRCodes().subscribe({
      next: (result: QRCodeDto[]) => {
          this.allQRCodes = result;
          this.fillCalendar()
      },
      error: () => { }
   });
  }

  fillCalendar(): void {
    let flag = false;

    this.workingDays.forEach(wd => {
      this.allAppointments.forEach(app => {
        let newEvent: EventInput = {
          title: '',
          start: new Date(),
          end: new Date(),
        };

        this.allQRCodes.forEach(qr => {
          this.registeredUsers.forEach(u => {
            if(wd.id === app.workingDayId && app.id === qr.appointmentId && qr.registeredUserId === u.id) {
              newEvent.title = app.duration + "h - " + u.name + " " + u.surname
              newEvent.start = new Date(app.pickUpDate)
              newEvent.end = new Date(app.pickUpDate)
              newEvent.end.setHours(newEvent.end.getHours() + app.duration, newEvent.end.getMinutes())

              flag = true;
            }
          })
        })

        if(flag) {
          this.calendarEvents.push(newEvent);

          this.calendarOptions = {
            ...this.calendarOptions,
            events: this.calendarEvents
          }

          if(this.fullCalendar) {
            this.fullCalendar.getApi().addEvent(newEvent)
          }

          flag = false;
        }
      })
    })
  }

  getAdminInfo(id: number): void {
    this.administrationService.getAdminInfo(id).subscribe(
      (data: AdminInfo) => {
        this.admin = data;
      },
      (error: any) => {
        console.error('Error fetching admin info', error);
      }
    );
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditAdminDialogComponent, {
      width: '400px',
      data: this.admin
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Ovdje možete dodati kod za ažuriranje podataka o administratoru
        console.log('Dialog result:', result);
        // Na primjer, možete pozvati metodu servisa za ažuriranje podataka na serveru
      }
    });
  }

  openResetPasswordDialog(): void {
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '400px',
      data: this.admin?.id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result
        console.log('Password reset data:', result);
        // You can call a service method to handle the password reset here
      }
    });
  }

}
