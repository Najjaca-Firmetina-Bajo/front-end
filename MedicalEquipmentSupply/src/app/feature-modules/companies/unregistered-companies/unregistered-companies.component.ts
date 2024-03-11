import { Component , OnInit } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'app-unregistered-companies',
  templateUrl: './unregistered-companies.component.html',
  styleUrls: ['./unregistered-companies.component.css']
})
export class UnregisteredCompaniesComponent implements OnInit {
  companies: any[] = [];
  logoUrl: string = 'https://png.pngtree.com/png-vector/20230415/ourmid/pngtree-company-line-icon-vector-png-image_6707332.png';

  constructor(private companyService: CompaniesService,private router: Router,private authService: AuthService) {}

  search: string = '';
  filterRating: string = '';
  filterEq: string = '';
  filter: boolean = false;
  parameters: string = ''

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe((data) => {
      this.companies = data;
    });
  }

  resetSearching(): void {
    this.companyService.getCompanies().subscribe((data) => {
      this.companies = data;
      this.filter = false;
    });
  }

  navigateToCompanyInfo(companyId: number): void {
    console.log(this.authService.isAuthenticated());
    if(!this.authService.isAuthenticated())
    {
      this.router.navigate(['/company', companyId]);
    }
    else{
      this.router.navigate(['/company-info', companyId]);
    }
  }

  searchCompanies(): void {
    this.companyService.searchCompanies(this.search).subscribe((data) => {
      this.companies = data;
      this.filter = true;
    })
  }

  filterCompaniesByRating(): void {
    this.parameters = this.search + ',' + this.filterRating
    this.companyService.filterCompaniesByRating(this.parameters).subscribe((data) => {
      this.companies = data;
    })
  }

  filterCompaniesByEquipmentNum(): void {
    this.parameters = this.search + ',' + this.filterEq
    this.companyService.filterCompaniesByEquipmentNum(this.parameters).subscribe((data) => {
      this.companies = data;
    })
  }
}