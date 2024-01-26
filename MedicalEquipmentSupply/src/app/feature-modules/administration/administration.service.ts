import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/enviroment';
import { CompanyAdministrator } from './model/company-administrator.model';
import { Observable } from 'rxjs';
import { Company } from './model/comapny.model';
import { Equipment } from './model/equipment.model';
import { WorkingCalendar } from './model/working-calendar.model';
import { WorkingDay } from './model/wrking-day.model';
import { Appointment } from './model/appointment.model';
import { RegistredUser } from './model/registred-user.model';
import { SystemAdministrator } from './model/system-administrator.model';
import { QRCodeDto } from './model/qrcode.model';
import { QRCodeEquipment } from './model/qr-eq.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  registerCompanyAdmin(newAdmin: CompanyAdministrator): Observable<CompanyAdministrator> {
    return this.http.post<CompanyAdministrator>(environment.wwwRoot + 'auth/register-company-admin', newAdmin)
  }

  registerSystemAdmin(newAdmin: SystemAdministrator): Observable<SystemAdministrator> {
    return this.http.post<SystemAdministrator>(environment.wwwRoot + 'auth/register-system-admin', newAdmin)
  }

  registerCompany(newCompany: Company): Observable<Company> {
    return this.http.post<Company>(environment.apiHost + 'companies/register', newCompany)
  }

  getAllCompanyAdministrators(): Observable<CompanyAdministrator[]> {
    return this.http.get<CompanyAdministrator[]>(environment.apiHost + 'companyAdministrators/get-all')
  }

  setCompanyAdministrator(adminId: number, companyId: number): Observable<number> {
    return this.http.put<number>(environment.apiHost + 'companyAdministrators/set-company/' + adminId + '/' + companyId, null)
  }

  findCompany(name: string): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + 'companies/find/' + name)
  }

  getAllEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + 'equipment/getAll')
  }

  searchEquipment(name: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + 'equipment/search/' + name)
  }
  
  filterEquipment(params: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + 'equipment/filter/' + params);
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

  getAllRegisteredUsers(): Observable<RegistredUser[]> {
    return this.http.get<RegistredUser[]>(environment.apiHost + 'registeredUsers/get-all')
  }

  getAllQRCodes(): Observable<QRCodeDto[]> {
    return this.http.get<QRCodeDto[]>(environment.apiHost + 'qr-codes/get-all')
  }

  getAllQRCodeEquipments(): Observable<QRCodeEquipment[]> {
    return this.http.get<QRCodeEquipment[]>(environment.apiHost + 'qreq/get-all')
  }

}
