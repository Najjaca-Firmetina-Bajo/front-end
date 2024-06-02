import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-company-dialog',
  templateUrl: './edit-company-dialog.component.html',
})
export class EditCompanyDialogComponent {
  editCompanyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditCompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editCompanyForm = this.fb.group({
      name: [data.name, Validators.required],
      address: [data.address, Validators.required],
      description: [data.description],
      averageRating: [data.averageRating, [Validators.required, Validators.min(0), Validators.max(5)]],
      availableSlots: [data.availableSlots],
      administrators: [data.administrators],
    });
  }

  onSubmit() {
    if (this.editCompanyForm.valid) {
      this.dialogRef.close(this.editCompanyForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
