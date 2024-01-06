import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { Router } from '@angular/router';
import { RegistredUser } from '../../administration/model/registred-user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {
  companies: any[] = [];
  userId: number;

  constructor(private companyService: CompaniesService,private router: Router) {
    this.userId = Number(-1);
    this.getAuthenticatedUserId();
  }

  getAuthenticatedUserId(): void {
    this.companyService.getAuthenticatedUserId().subscribe(
      (userId: number) => {
        console.log('Authenticated User ID:', Number(userId));
        this.userId = Number(userId)
      },
      (error) => {
        console.error('Error getting authenticated user ID:', error);
      }
    );
  }

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

  navigateToProfileInfo(): void {
    this.router.navigate(['/profile-info', this.userId]);
  }
}