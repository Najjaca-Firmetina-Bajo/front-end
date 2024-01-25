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
  allEquipment: Equipment[] = []
  daysDetailsList: { day: Date, equipmentList: string[], pickUpDate: Date, duration: number, user: string }[] = []
  copyList: { day: Date, equipmentList: string[], pickUpDate: Date, duration: number, user: string }[] = []
  registeredUsers: RegistredUser[] = []
  
  daysTable: boolean = false
  selectedRange: string = 'month'
  monthSelected: boolean = false
  weekSelected: boolean = false
  yearSelected: boolean = false
  selectedMonth: string = '01'
  selectedWeekDate: string = '01'
  selectedWeekMonth: string = '01'
  selectedYear: string = '2023'
  invalidWeekDate: boolean = false
  currentYear: number = -1
  selectedMonthYear: string = '2023'
  selectedWeekYear: string = '2023'
  sevenDays: string = ''
  emptyDaysTable: boolean = false

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
              private authService: AuthService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    //this.getWorkingCalednar()
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
          this.getAllEquipment()
      },
      error: () => { }
   });
  }

  getAllEquipment(): void {
    this.administrationService.getAllEquipment().subscribe({
      next: (result: Equipment[]) => {
          this.allEquipment = result;
          this.getAllRegisteredUsers()
      },
      error: () => { }
   });
  }

  getAllRegisteredUsers(): void {
    this.administrationService.getAllRegisteredUsers().subscribe({
      next: (result: RegistredUser[]) => {
          this.registeredUsers = result;
          this.prepareBindingList()
      },
      error: () => { }
   });
  }

  prepareBindingList(): void {
    this.workingDays.forEach(wd => {
      wd.appointmentsIds.forEach(appid => {
        let item: { day: Date, equipmentList: string[], pickUpDate: Date, duration: number, user: string } = {
          day: new Date(),
          equipmentList: [],
          pickUpDate: new Date(),
          duration: -1,
          user: ''
        }

        let newEvent: EventInput = {
          title: '',
          start: new Date(), 
          end: new Date(),  
        };

        this.allAppointments.forEach(a => {
          this.registeredUsers.forEach(ru=> {
            if(a.registredUserId === ru.id) {
              if(a.reservedEquipmentIds.length !== 0) {
                if(appid === a.id && a.workingDayId === wd.id) {
                  a.reservedEquipmentIds.forEach(eid => {
                    this.allEquipment.forEach(e => {
                      if(eid === e.id) {
                        item.day = wd.date //a.pickUpDate
                        item.duration = a.duration
                        item.pickUpDate = a.pickUpDate
                        item.user = ru.name + " " + ru.surname 
                        item.equipmentList.push(e.name)

                        newEvent.title = a.duration + "h - " + ru.name + " " + ru.surname 
                        newEvent.start = new Date(a.pickUpDate)
                        newEvent.end = new Date(a.pickUpDate)
                        newEvent.end.setHours(newEvent.end.getHours() + a.duration, newEvent.end.getMinutes())
                      }
                    })
                  })
                }
              }
            }
          })
        })
        if(item.equipmentList.length !== 0) {
          this.daysDetailsList.push(item)
          // Dodaj događaj u niz
          this.calendarEvents.push(newEvent);

          this.calendarOptions = {
            ...this.calendarOptions,
            events: this.calendarEvents
          }

          if(this.fullCalendar) {
            this.fullCalendar.getApi().addEvent(newEvent)
          }
          //.log('calendarEvents after adding:', this.calendarEvents);
          //console.log(this.calendarEvents)
          //this.cdr.detectChanges()
        }
      })
    })
    this.copyList = this.daysDetailsList
    //console.log(this.calendarEvents)
  }

  showDaysTable(): void {
    if(this.weekSelected) {
      if(this.selectedWeekMonth === '01' || this.selectedWeekMonth === '03' || this.selectedWeekMonth === '05' || this.selectedWeekMonth === '07' || this.selectedWeekMonth === '08' || this.selectedWeekMonth === '10' || this.selectedWeekMonth === '12') {
        this.invalidWeekDate = false
        this.weekFilter()
      }
      else if(this.selectedWeekMonth === '04' || this.selectedWeekMonth === '06' || this.selectedWeekMonth === '09' || this.selectedWeekMonth === '11') {
        if(this.selectedWeekDate === '31') {
          this.invalidWeekDate = true;
          this.daysTable = false
        } 
        else {
          this.invalidWeekDate = false
          this.weekFilter()
        }
      }
      else {
        let rest = parseInt(this.selectedWeekYear, 10) % 4
        console.log(parseInt(this.selectedWeekYear, 10))
        if(rest === 0 && (this.selectedWeekDate === '30' || this.selectedWeekDate === '31')) {
          this.invalidWeekDate = true
          this.daysTable = false
        }
        else if(rest !== 0 && (this.selectedWeekDate === '29' || this.selectedWeekDate === '30' || this.selectedWeekDate === '31')) {
          this.invalidWeekDate = true
          this.daysTable = false
        }
        else {
          this.invalidWeekDate = false
          this.weekFilter()
        }
      }
    }
    else if(this.monthSelected) {
      this.monthFilter()
    }
    else {
      this.yearFilter()
    }
  }

  weekFilter(): void {
    this.daysDetailsList = this.copyList
    let firstDateString = this.selectedWeekYear + '-' + this.selectedWeekMonth + '-' + this.selectedWeekDate;
    let firstDate = new Date(firstDateString);
    let lastDate = new Date(firstDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    firstDate.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    this.sevenDays = "Appointments between " + firstDate.toDateString() + " and " + lastDate.toDateString() + " are shown."

    this.daysDetailsList = this.daysDetailsList.filter(a => {
      const dayDate = new Date(a.day);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate >= firstDate && dayDate <= lastDate;
    });

    if(this.daysDetailsList.length > 0) {
      this.emptyDaysTable = false
      this.daysTable = true
    }
    else {
      this.daysTable = false
      this.emptyDaysTable = true
    }
  }
  
  monthFilter(): void {
    this.daysDetailsList = this.copyList
    this.daysDetailsList = this.daysDetailsList.filter(a => {
      const dateObject = new Date(a.day);
      const month = dateObject.getMonth() + 1;
      const year = dateObject.getFullYear()
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      return formattedMonth === this.selectedMonth && year.toString() === this.selectedMonthYear;
    });

    if(this.daysDetailsList.length > 0) {
      this.emptyDaysTable = false
      this.daysTable = true
    }
    else {
      this.daysTable = false
      this.emptyDaysTable = true
    }
  }

  yearFilter(): void {
    this.daysDetailsList = this.copyList
    this.daysDetailsList = this.daysDetailsList.filter(a => {
      const dateObject = new Date(a.day);
      const year = dateObject.getFullYear();
      console.log(year)
      return year.toString() === this.selectedYear;
    });

    if(this.daysDetailsList.length > 0) {
      this.emptyDaysTable = false
      this.daysTable = true
    }
    else {
      this.daysTable = false
      this.emptyDaysTable = true
    }
  }
  
  nextOptions(): void {
    if(this.selectedRange === 'week') {
      this.daysTable = false
      this.monthSelected = false
      this.yearSelected = false
      this.emptyDaysTable = false
      this.weekSelected = true
    }
    else if(this.selectedRange === 'month') {
      this.daysTable = false
      this.weekSelected = false
      this.yearSelected = false
      this.emptyDaysTable = false
      this.monthSelected = true
    }
    else {
      this.daysTable = false
      this.weekSelected = false
      this.monthSelected = false
      this.emptyDaysTable = false
      this.yearSelected = true
    }
  }

}
