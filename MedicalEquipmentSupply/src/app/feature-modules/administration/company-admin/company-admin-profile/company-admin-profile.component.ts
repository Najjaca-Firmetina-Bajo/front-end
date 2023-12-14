import { Component, OnInit } from '@angular/core';
import { WorkingCalendar } from '../../model/working-calendar.model';
import { WorkingDay } from '../../model/wrking-day.model';
import { Appointment } from '../../model/appointment.model';

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
  appointments: Appointment[] = []
  daysDetailsList: { day: Date, equipmentList: string[], pickUpDate: Date, duration: number, user: string }[] = []
  
  daysTable: boolean = false
  selectedRange: string = ''
  monthSelected: boolean = false
  weekSelected: boolean = false
  selectedMonth: string = ''
  selectedWeekDate: string = ''
  selectedWeekMonth: string = ''
  button: boolean = false

  
  ngOnInit(): void {
    this.getWorkingCalednar()
  }

  getWorkingCalednar(): void {

  }

  getWorkingDays(): void {

  }

  getAppointments(): void {

  }

  showDaysTable(): void {
    //validacija izabranih datuma
  }

}
