import { Component, OnInit } from '@angular/core';
import { CompanyInfo } from "../../administration/model/company-info.model";
import { CompaniesService } from "../companies.service";
import { EditCompanyDialogComponent } from "../../edit-company-dialog/edit-company-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { CreateAppointmentDialogComponent } from '../create-appointment-dialog/create-appointment-dialog.component';
import {CreateEquipmentDialogComponent} from "../create-equipment-dialog/create-equipment-dialog.component";
import {EquipmentInfo} from "../../administration/model/equipment-info.model";
import {EditEquipmentDialogComponent} from "../edit-equipment-dialog/edit-equipment-dialog.component";

@Component({
  selector: 'app-company-info-admin',
  templateUrl: './company-info-admin.component.html',
  styleUrls: ['./company-info-admin.component.css']
})
export class CompanyInfoAdminComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;
  userId: number | undefined;
  searchTerm: string = '';

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

  openCreateEquipmentDialog(): void {
    if (!this.companyInfo) { return; }
    const dialogRef = this.dialog.open(CreateEquipmentDialogComponent, {
      width: '400px',
      data: { companyId: this.companyInfo.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.companyInfo) {
          this.companyInfo.equipments.push(result);
        }
      }
    });
  }

  deleteEquipment(id: number): void {
    this.companyService.deleteEquipment(id).subscribe(
      () => {
        if (this.companyInfo) {
          this.companyInfo.equipments = this.companyInfo.equipments.filter(equipment => equipment.id !== id);
        }
      },
      (error) => {
        console.error('Error deleting equipment:', error);
      }
    );
  }

  openEditEquipmentDialog(equipment: EquipmentInfo): void {
    if(!this.companyInfo) {return;}
    const dialogRef = this.dialog.open(EditEquipmentDialogComponent, {
      width: '400px',
      data: { companyId: this.companyInfo.id, equipment: equipment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the equipment details in the companyInfo.equipments list
        const index = this.companyInfo?.equipments.findIndex(e => e.id === result.id);
        if (index !== undefined && index !== -1 && this.companyInfo) {
          this.companyInfo.equipments[index] = result;
        }
      }
    });
  }

  searchEquipment(): void {
    if (!this.searchTerm.trim()) { return; }
    this.companyService.searchEquipmentByName(this.searchTerm).subscribe(
      (equipmentList: EquipmentInfo[]) => {
        // Update the equipment list with the search results
        if (this.companyInfo) {
          this.companyInfo.equipments = equipmentList;
        }
      },
      (error) => {
        console.error('Error searching equipment:', error);
      }
    );
  }

}
