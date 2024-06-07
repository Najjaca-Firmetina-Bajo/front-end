import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompaniesService } from "../companies/companies.service";
import { CompanyInfo } from "../administration/model/company-info.model";

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
    const addressParts = data.address.split('-');
    this.editCompanyForm = this.fb.group({
      name: [data.name],
      street: [addressParts[0]],
      number: [addressParts[1]],
      city: [addressParts[2]],
      country: [addressParts[3]],
      description: [data.description],
      averageRating: [data.averageRating],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const formValue = this.editCompanyForm.value;
    const formattedAddress = `${formValue.street}-${formValue.number}-${formValue.city}-${formValue.country}`;
    const updatedData = {
      ...this.data,
      name: formValue.name,
      address: formattedAddress,
      description: formValue.description,
      averageRating: formValue.averageRating
    };

    // You can implement your save logic here, for now, let's just close the dialog with the updated data
    this.dialogRef.close(updatedData);
  }
}
