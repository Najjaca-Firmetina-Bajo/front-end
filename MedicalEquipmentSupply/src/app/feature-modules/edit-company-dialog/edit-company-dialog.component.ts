import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {CompaniesService} from "../companies/companies.service";
import {CompanyInfo} from "../administration/model/company-info.model";

@Component({
  selector: 'app-edit-company-dialog',
  templateUrl: './edit-company-dialog.component.html',
  styleUrls: ['./edit-company-dialog.component.css']
})
export class EditCompanyDialogComponent {
  editCompanyForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditCompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyInfo,
    private fb: FormBuilder,
    private companyService: CompaniesService
  ) {
    this.editCompanyForm = this.fb.group({
      name: [data.name],
      address: [data.address],
      description: [data.description],
      averageRating: [data.averageRating],
      availableSlots: [data.availableAppointments],
      administrators: [data.admins],
      pickUpDate: [null],
      duration: [null],
      type: [null],
      username: [null],
      email: [null],
      phoneNumber: [null]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // You can implement your save logic here, for now, let's just close the dialog
    this.dialogRef.close();
  }
}
