import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../../administration/administration.service';
import { CompanyAdministrator } from '../../administration/model/company-administrator.model';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {
  
  companies: any[] = [];
  isCompanyAdmin: boolean = false
  companyAdmins: CompanyAdministrator[] = []
  

  constructor(private companyService: CompaniesService,
              private authService: AuthService,
              private administrationService: AdministrationService,
              private router: Router) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe((data) => {
      this.companies = data;
      this.getAllCompanyAdministrators();
    });
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


  investigate(userId: number): void {
    this.companyAdmins.forEach(ca => {
      if(ca.id === userId) {
        this.isCompanyAdmin = true;
      }
    })
  }

  navigateToCompanyInfo(companyId: number): void {
    this.router.navigate(['/company-info', companyId]);
  }

  searchEquipment(): void {
    this.router.navigate(['/equipment-review']);
  }

  showCompanyAdminProfile(): void {
    this.router.navigate(['/company-admin-profile']);
  }
}