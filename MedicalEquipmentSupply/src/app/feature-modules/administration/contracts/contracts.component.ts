import {Component, OnInit} from '@angular/core';
import { CompanyInfo } from "../model/company-info.model";
import { CompaniesService } from "../../companies/companies.service";
import {ContractInfo} from "../model/contract-info.model";
import {AdministrationService} from "../administration.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;
  userId: number | undefined;
  contracts: ContractInfo[] = []

  constructor(
    private router: Router,
    private companyService: CompaniesService,
    private administrationService: AdministrationService
  ) { }

  ngOnInit(): void {
    this.getAuthenticatedUserIdAndFetchCompanyInfo();
  }

  getAuthenticatedUserIdAndFetchCompanyInfo(): void {
    this.companyService.getAuthenticatedUserId().subscribe(
      (userId: number) => {
        this.userId = Number(userId);
        this.companyService.getCompanyInfo(this.userId).subscribe(
          (data: CompanyInfo) => {
            this.companyInfo = data;
            this.administrationService.getAllContractsByCompanyId(this.companyInfo.id).subscribe(
              (data: ContractInfo[]) => {
                this.contracts = data;
              },
              (error: any) => {
                console.error('Error fetching contracts info', error);
              }
            );
          },
          (error: any) => {
            console.error('Error fetching company info', error);
          }
        );
      },
      (error) => {
        console.error('Error getting authenticated user ID:', error);
      }
    );
  }

  navigateToContractInfo(contractId: number): void {
    this.router.navigate(['/contract-info', contractId]);
  }

}
