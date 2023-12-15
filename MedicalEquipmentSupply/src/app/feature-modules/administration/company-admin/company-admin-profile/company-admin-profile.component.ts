import { Component, OnInit } from '@angular/core';
import { WorkingCalendar } from '../../model/working-calendar.model';
import { WorkingDay } from '../../model/wrking-day.model';
import { Appointment } from '../../model/appointment.model';
import { AdministrationService } from '../../administration.service';
import { Equipment } from '../../model/equipment.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-company-admin-profile',
  templateUrl: './company-admin-profile.component.html',
  styleUrls: ['./company-admin-profile.component.css']
})
export class CompanyAdminProfileComponent implements OnInit {
  
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
  
  daysTable: boolean = false
  selectedRange: string = 'year'
  monthSelected: boolean = false
  weekSelected: boolean = false
  yearSelected: boolean = false
  selectedMonth: string = ''
  selectedWeekDate: string = ''
  selectedWeekMonth: string = ''
  selectedYear: string = ''
  invalidWeekDate: boolean = false
  currentYear: number = -1
  selectedMonthYear: string = ''
  selectedWeekYear: string = ''

  constructor(private administrationService: AdministrationService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.getWorkingCalednar()
  }

  getWorkingCalednar(): void {
    this.administrationService.getWorkingCalendar(15).subscribe({
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
        this.allAppointments.forEach(a => {
          if(appid === a.id && a.workingDayId === wd.id) {
            a.reservedEquipmentIds.forEach(eid => {
              this.allEquipment.forEach(e => {
                if(eid === e.id) {
                  item.day = wd.date
                  item.duration = a.duration
                  item.pickUpDate = a.pickUpDate
                  item.user = 'Registrovsni Korisnik' //nakon uvezivanja RegistredUser sa Appointment
                  item.equipmentList.push(e.name)
                }
              })
            })
          }
        })
        this.daysDetailsList.push(item)
      })
    })
    this.copyList = this.daysDetailsList
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

    this.daysDetailsList = this.daysDetailsList.filter(a => {
      const dayDate = new Date(a.day);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate >= firstDate && dayDate <= lastDate;
    });

    this.daysTable = true
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

    this.daysTable = true
  }

  yearFilter(): void {
    this.daysDetailsList = this.copyList
    this.daysDetailsList = this.daysDetailsList.filter(a => {
      const dateObject = new Date(a.day);
      const year = dateObject.getFullYear();
      console.log(year)
      return year.toString() === this.selectedYear;
    });

    this.daysTable = true
  }
  
  nextOptions(): void {
    if(this.selectedRange === 'week') {
      this.daysTable = false
      this.monthSelected = false
      this.yearSelected = false
      this.weekSelected = true
    }
    else if(this.selectedRange === 'month') {
      this.daysTable = false
      this.weekSelected = false
      this.yearSelected = false
      this.monthSelected = true
    }
    else {
      this.daysTable = false
      this.weekSelected = false
      this.monthSelected = false
      this.yearSelected = true
      //this.daysDetailsList.length = 0;
      //this.getWorkingCalednar()
      //this.daysTable = true
    }
  }

}
