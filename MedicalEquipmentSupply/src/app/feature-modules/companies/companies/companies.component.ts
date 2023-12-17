import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {
  companies: any[] = [];

  constructor(private companyService: CompaniesService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  private loadCompanies(): void {
    this.companyService.getCompanies().subscribe((data) => {
      this.companies = data;
    });
  }
}