import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompaniesService } from "../companies/companies.service";
import { CompanyInfo } from "../administration/model/company-info.model";
import {EditCompany} from "../administration/model/edit-company.model";

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
      longitude: [addressParts[4]],
      latitude: [addressParts[5]],
      description: [data.description],
      averageRating: [data.averageRating],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const formValue = this.editCompanyForm.value;
    const formattedAddress = `${formValue.street}-${formValue.number}-${formValue.city}-${formValue.country}-${formValue.longitude}-${formValue.latitude}`;
    const updatedData: EditCompany = {
      id: this.data.id,
      name: formValue.name,
      address: formattedAddress,
      description: formValue.description,
      averageRating: formValue.averageRating
    };

    this.companyService.updateCompanyInfo(updatedData).subscribe({
      next: () => {
        console.log('Company info updated successfully');
        this.dialogRef.close(updatedData); // Close the dialog and pass the updated data
        window.location.reload(); // Refresh the page
      },
      error: (error) => {
        console.error('Error updating company info', error);
        // Optionally, handle the error (e.g., show a notification to the user)
      }
    });
  }
}
