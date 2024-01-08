import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';
import { Equipment } from '../administration/model/equipment.model';
import { WorkingDay } from '../administration/model/wrking-day.model';
import { WorkingCalendar } from '../administration/model/working-calendar.model';
import { Appointment } from '../administration/model/appointment.model';
import { Company } from '../administration/model/comapny.model';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private apiUrl = 'your-api-url'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiHost}companies/getAll`);
  }

  getAllEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + 'equipment/getAll')
  }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + 'companies/getAll')
  }

  getWorkingCalendar(companyId: number): Observable<WorkingCalendar> {
    return this.http.get<WorkingCalendar>(environment.apiHost + 'workingCalendars/findBy/' + companyId)
  }

  getWorkingDays(calendarId: number): Observable<WorkingDay[]> {
    return this.http.get<WorkingDay[]>(environment.apiHost + 'workingDays/findBy/' + calendarId)
  }

  getAppointments(dayId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(environment.apiHost + 'appointments/findBy/' + dayId)
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(environment.apiHost + 'appointments/get-all')
  }

  getAllAppointmentsByCalendar(id:number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(environment.apiHost + 'appointments/get-all-calendar/'+id)
  }

  reserveAppointment(appointment:Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(environment.apiHost + 'appointments/reserve',appointment)
  }

  getAuthenticatedUserId(): Observable<number> {
    const url = environment.wwwRoot + 'auth/who-am-i';

    return this.http.get<number>(url);
  }

  searchCompanies(nameOrPlace: string): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + 'companies/search/' + nameOrPlace)
  }

  filterCompaniesByRating(params: string): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + 'companies/filter/' + params)
  }

  filterCompaniesByEquipmentNum(params: string): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + 'companies/filter-eq/' + params)
  }
}
