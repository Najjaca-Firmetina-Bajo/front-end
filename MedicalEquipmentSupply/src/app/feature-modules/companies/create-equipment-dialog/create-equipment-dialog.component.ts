import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CreateEquipment} from "../../administration/model/create-equipment.model";
import {CompaniesService} from "../companies.service";

@Component({
  selector: 'app-create-equipment-dialog',
  templateUrl: './create-equipment-dialog.component.html',
  styleUrls: ['./create-equipment-dialog.component.css']
})
export class CreateEquipmentDialogComponent implements OnInit {
  equipmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEquipmentDialogComponent>,
    private companiesService: CompaniesService,
    @Inject(MAT_DIALOG_DATA) public data: { companyId: number }
  ) {
    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]]
    });

  }

  ngOnInit(): void {}

  onCreate(): void {
    if (this.equipmentForm.valid) {
      const equipmentData: CreateEquipment = {
        companyId: this.data.companyId,
        name: this.equipmentForm.value.name,
        type: this.equipmentForm.value.type,
        description: this.equipmentForm.value.description,
        price: this.equipmentForm.value.price,
        quantity: this.equipmentForm.value.quantity
      };

      this.companiesService.createEquipment(equipmentData).subscribe(
        () => {
          console.log('Equipment created successfully');
          this.dialogRef.close(equipmentData);
          window.location.reload();
        },
        error => {
          console.error('Error creating equipment:', error);
          // Handle error if needed
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
