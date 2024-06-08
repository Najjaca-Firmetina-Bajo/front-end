import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-appointment-dialog',
  templateUrl: './create-appointment-dialog.component.html',
  styleUrls: ['./create-appointment-dialog.component.css']
})
export class CreateAppointmentDialogComponent implements OnInit {
  appointmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateAppointmentDialogComponent>
  ) { }

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      admin: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator]],
      time: ['', Validators.required],
      duration: [1, [Validators.required, Validators.min(1)]]
    });
  }

  futureDateValidator(control: FormControl) {
    const selectedDate = new Date(control.value);
    if (selectedDate <= new Date()) {
      return { pastDate: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
