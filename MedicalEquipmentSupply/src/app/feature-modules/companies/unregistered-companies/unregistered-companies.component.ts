import { Component , OnInit } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../../administration/administration.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-unregistered-companies',
  templateUrl: './unregistered-companies.component.html',
  styleUrls: ['./unregistered-companies.component.css']
})
export class UnregisteredCompaniesComponent implements OnInit {
  companies: any[] = [];
  logoUrl: string = 'https://png.pngtree.com/png-vector/20230415/ourmid/pngtree-company-line-icon-vector-png-image_6707332.png';

  constructor(private companyService: CompaniesService,private router: Router,private authService: AuthService, private administrationService: AdministrationService) {
    this.userId = -1;
  }

  search: string = '';
  filterRating: string = '';
  filterEq: string = '';
  filter: boolean = false;
  parameters: string = '';
  ascOrDesc: string = 'asc';
  type: string = 'name';
  userId: number;

  ngOnInit(): void {
    this.authService.getAuthenticatedUserId().subscribe(userId => {
      this.userId = userId;
      this.administrationService.removeUsersPenalPoints(userId).subscribe(penal => {
        
      });
    });
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

  sortCompanies(): void {
    this.companyService.sortCompanies(this.ascOrDesc,this.type).subscribe((data) => {
      this.companies = data;
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

  rateCompany(companyId: number): void {
    this.companyService.checkIfUserCanRateCompany(this.userId,companyId).subscribe((data) => {
      if(data){
        this.router.navigate(['/rate-company', companyId]);
      }
      else {
        alert('User does not have reserved appointment in this company!');
      }
    })    
  }
}