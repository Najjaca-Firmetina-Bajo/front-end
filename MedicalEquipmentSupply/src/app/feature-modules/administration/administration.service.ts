import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/enviroment';
import { CompanyAdministrator } from './model/company-administrator.model';
import { Observable } from 'rxjs';
import { Company } from './model/comapny.model';

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

}
