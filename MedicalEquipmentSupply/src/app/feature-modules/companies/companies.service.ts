import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/enviroment';
import { Equipment } from '../administration/model/equipment.model';
import { WorkingDay } from '../administration/model/wrking-day.model';
import { WorkingCalendar } from '../administration/model/working-calendar.model';
import { Appointment } from '../administration/model/appointment.model';
import { Company } from '../administration/model/comapny.model';
import { QRCodeDto } from '../administration/model/qrcode.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
    return this.http.get<Appointment[]>(environment.apiHost + 'appointments/get-all-from-calendar/'+id)
  }

  getUsersDownloadedAppointments(id: number): Observable<Appointment[]>{
    return this.http.get<Appointment[]>(environment.apiHost + 'appointments/get-users-downloaded-appointments/'+id)
  }

  reserveAppointment(qrCodeDto: QRCodeDto): Observable<QRCodeDto> {
    return this.http.post<QRCodeDto>(environment.apiHost + 'appointments/reserve', qrCodeDto)
  }

  getAuthenticatedUserId(): Observable<number> {
    const url = environment.wwwRoot + 'auth/who-am-i';

    return this.http.get<number>(url);
  }

  getCompanyById(companyId: number): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + 'companies/findById/' + companyId)
  }

  getEquipmentByIds(ids: number[]): Observable<Equipment[]> {
    const params = ids.map(id => `ids=${id}`).join('&');
    return this.http.get<Equipment[]>(`${environment.apiHost}equipment/getByIds?${params}`);
  }

  getAllQRCodesForUser(userId: number): Observable<QRCodeDto[]> {
    return this.http.get<QRCodeDto[]>(environment.apiHost + 'qr-codes/get-all-by-user/' + userId);
  }

  cancelAppointmentReservation(appointmentId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiHost}appointments/cancel-reservation/${appointmentId}`, null);
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

  getExtraordinaryAppointments(selectedDate: Date, companyId: number): Observable<Appointment[]> {
    const formattedDate = this.formatDate(selectedDate);
    const params = { date: formattedDate, companyId: companyId.toString() };
    return this.http.get<Appointment[]>(environment.apiHost + 'appointments/extraordinary-appointments', { params }).pipe(
      catchError(error => {
        // Ovde možete obraditi grešku koja se dogodila
        console.error('Greška prilikom dobijanja izvanrednih termina:', error);
        
        // Vraćanje praznog niza ili neke podrazumevane vrednosti kao rezultata
        return of([]);
      })
    );
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'GMT'
    };
    const selectedDate = new Date(date);
  
    // Formatiranje datuma koristeći Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(selectedDate);
  
    return formattedDate;
  }

  sortCompanies(ascOrDesc: string, type: string): Observable<Company[]> {
    return this.http.get<Company[]>(environment.apiHost + 'companies/sort/' + ascOrDesc + '/' + type)
  }

  getEquipment(id: number): Observable<Equipment> {;
    return this.http.get<Equipment>(environment.apiHost + 'equipment/' + id);
  }

  sortAppointments(ascOrDesc: string, type: string, id: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(environment.apiHost + 'appointments/sort/' + ascOrDesc + '/' + type + '/' + id)
  }
}
