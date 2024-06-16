import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminInfo} from "../model/admin-info.model";
import {AdministrationService} from "../administration.service";

@Component({
  selector: 'app-edit-admin-dialog',
  templateUrl: './edit-admin-dialog.component.html',
  styleUrls: ['./edit-admin-dialog.component.css']
})
export class EditAdminDialogComponent  implements OnInit {
  editForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<EditAdminDialogComponent >,
      private administrationService: AdministrationService,
      @Inject(MAT_DIALOG_DATA) public data: AdminInfo
  ) {
    this.editForm = this.fb.group({
      email: [data.email, [Validators.required, Validators.email]],
      name: [data.name, Validators.required],
      surname: [data.surname, Validators.required],
      city: [data.city, Validators.required],
      country: [data.country, Validators.required],
      phoneNumber: [data.phoneNumber, Validators.required]
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.editForm.valid) {
      const updatedAdminInfo: AdminInfo = {
        ...this.data,
        ...this.editForm.value
      };

      this.administrationService.updateAdminInfo(updatedAdminInfo).subscribe({
        next: () => {
          this.dialogRef.close(updatedAdminInfo);
          window.location.reload();
        },
        error: (err) => {
          console.error('Error updating admin info:', err);
          // Handle error here (e.g., show a notification)
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
