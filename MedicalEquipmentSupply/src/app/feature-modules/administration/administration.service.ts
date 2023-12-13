import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/enviroment';
import { CompanyAdministrator } from './model/company-administrator.model';
import { Observable } from 'rxjs';
import { Company } from './model/comapny.model';
import { Equipment } from './model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  registerCompanyAdmin(newAdmin: CompanyAdministrator): Observable<CompanyAdministrator> {
    return this.http.post<CompanyAdministrator>(environment.apiHost + 'companyAdministrators/register', newAdmin)
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

}
