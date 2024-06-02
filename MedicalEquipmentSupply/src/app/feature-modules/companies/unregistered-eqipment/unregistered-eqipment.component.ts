import { Component } from '@angular/core';
import { Equipment } from '../../administration/model/equipment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../companies.service';
import { Company } from '../../administration/model/comapny.model';
import {EditCompanyDialogComponent} from "../../edit-company-dialog/edit-company-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-unregistered-eqipment',
  templateUrl: './unregistered-eqipment.component.html',
  styleUrls: ['./unregistered-eqipment.component.css']
})
export class UnregisteredEqipmentComponent {
  companyId: number;
  company: any;
  equipment: any;

  constructor(private route: ActivatedRoute,private companyService: CompaniesService,
              private router: Router,
              private dialog: MatDialog) {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.company = this.loadCompanies();
  }

  private loadCompanies(): void {
    this.companyService.getCompanyById(this.companyId).subscribe(
      (data: Company) => {
        this.company = data;
        console.log(this.company);

        this.loadEquipmentByIds(this.company.availableEquipment.map((e: { equipmentId: number, quantity: number }) => e.equipmentId));
      },
      error => {
        console.error('Error fetching company data:', error);
      }
    );
  }

  private loadEquipmentByIds(ids: number[]): void {
    this.companyService.getEquipmentByIds(ids).subscribe(
      (data: Equipment[]) => {
        this.equipment = data;
        console.log(this.equipment);
      },
      error => {
        console.error('Error fetching equipment data:', error);
      }
    );
  }

  openEditDialog(company: any): void {
    const dialogRef = this.dialog.open(EditCompanyDialogComponent, {
      width: '400px',
      data: { ...company }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the company details with the new values
        Object.assign(company, result);
        // Save the updated company details, e.g., make an API call
      }
    });
  }
}
