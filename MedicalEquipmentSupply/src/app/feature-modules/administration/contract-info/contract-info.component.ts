import {Component, OnInit} from '@angular/core';
import {ContractInfo} from "../model/contract-info.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CompaniesService} from "../../companies/companies.service";
import {AdministrationService} from "../administration.service";
import {CompanyInfo} from "../model/company-info.model";

@Component({
  selector: 'app-contract-info',
  templateUrl: './contract-info.component.html',
  styleUrls: ['./contract-info.component.css']
})
export class ContractInfoComponent implements OnInit {
  contractInfo: ContractInfo | undefined;
  contractId: number = 0;

  constructor(
    private administrationService: AdministrationService,
    private route: ActivatedRoute,
  ) {
    this.contractId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getContractInfo();
  }

  getContractInfo(): void {
    this.administrationService.getContractById(this.contractId).subscribe(
      (data: ContractInfo) => {
        this.contractInfo = data;
      },
      (error) => {
        console.error('Error getting authenticated user ID:', error);
      }
    );
  }

  deliverContract(): void {
    if (this.contractInfo) {
      this.administrationService.deliverContract(this.contractInfo.id).subscribe(
        () => {
          window.location.reload();
          console.log('Contract delivered successfully.');
        },
        (error) => {
          console.error('Error delivering contract:', error);
        }
      );
    }
  }
}
