import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CompaniesService} from "../companies.service";
import {EquipmentInfo} from "../../administration/model/equipment-info.model";
import {EditEquipment} from "../../administration/model/edit-equipment.model";

@Component({
  selector: 'app-edit-equipment-dialog',
  templateUrl: './edit-equipment-dialog.component.html',
  styleUrls: ['./edit-equipment-dialog.component.css']
})
export class EditEquipmentDialogComponent implements OnInit {
  equipmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEquipmentDialogComponent>,
    private companiesService: CompaniesService,
    @Inject(MAT_DIALOG_DATA) public data: { companyId: number, equipment: EquipmentInfo }
  ) {
    this.equipmentForm = this.fb.group({
      name: [this.data.equipment.name, Validators.required],
      type: [this.data.equipment.type, Validators.required],
      description: [this.data.equipment.description, Validators.required],
      price: [this.data.equipment.price, [Validators.required, Validators.min(0)]],
      quantity: [this.data.equipment.quantity, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {}

  onUpdate(): void {
    if (this.equipmentForm.valid) {
      const updatedEquipmentData: EditEquipment = {
        id: this.data.equipment.id,
        companyId: this.data.companyId,
        name: this.equipmentForm.value.name,
        type: this.equipmentForm.value.type,
        description: this.equipmentForm.value.description,
        price: this.equipmentForm.value.price,
        quantity: this.equipmentForm.value.quantity
      };

      this.companiesService.updateEquipment(updatedEquipmentData).subscribe(
        () => {
          console.log('Equipment updated successfully');
          this.dialogRef.close(updatedEquipmentData);
          window.location.reload();
        },
        error => {
          console.error('Error updating equipment:', error);
          // Handle error if needed
        }
      );

    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
