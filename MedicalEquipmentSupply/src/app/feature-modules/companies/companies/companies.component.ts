import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {
  companies: any[] = [];

  constructor(private companyService: CompaniesService,private router: Router) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  private loadCompanies(): void {
    this.companyService.getCompanies().subscribe((data) => {
      this.companies = data;
    });
  }

  navigateToCompanyInfo(companyId: number): void {
    this.router.navigate(['/company-info', companyId]);
  }

  searchEquipment(): void {
    this.router.navigate(['/equipment-review']);
  }

}