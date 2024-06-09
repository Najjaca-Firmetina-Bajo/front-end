import { Component, OnInit } from '@angular/core';
import { CompanyInfo } from "../../administration/model/company-info.model";
import { CompaniesService } from "../companies.service";
import { EditCompanyDialogComponent } from "../../edit-company-dialog/edit-company-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { CreateAppointmentDialogComponent } from '../create-appointment-dialog/create-appointment-dialog.component';

@Component({
  selector: 'app-company-info-admin',
  templateUrl: './company-info-admin.component.html',
  styleUrls: ['./company-info-admin.component.css']
})
export class CompanyInfoAdminComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;
  userId: number | undefined;

  constructor(
    private companyService: CompaniesService,
    private dialog: MatDialog
  ) {}

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

  openEditDialog(company: any): void {
    if (this.userId) {
      this.companyService.getCompanyInfo(this.userId).subscribe((data: CompanyInfo) => {
        const dialogRef = this.dialog.open(EditCompanyDialogComponent, {
          width: '400px',
          data: data
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Update the company details with the new values
            // Make API call to update company details
          }
        });
      });
    }
  }

  openCreateAppointmentDialog(): void {
    if (this.companyInfo) {
      const dialogRef = this.dialog.open(CreateAppointmentDialogComponent, {
        width: '400px',
        data: { companyId: this.companyInfo.id, admins: this.companyInfo.admins }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Handle the result if needed
          // For example, refresh the appointments list
        }
      });
    }
  }
}
