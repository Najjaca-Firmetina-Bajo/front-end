import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompaniesService } from "../companies.service";
import { WorkingCalendarInfo } from "../../administration/model/working-calendar-info.model";
import {DatePipe, formatDate} from "@angular/common";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {AdminInfo} from "../../administration/model/admin-info.model";
import {CreateAppointment} from "../../administration/model/create-appointment.model";

@Component({
  selector: 'app-create-appointment-dialog',
  templateUrl: './create-appointment-dialog.component.html',
  styleUrls: ['./create-appointment-dialog.component.css']
})
export class CreateAppointmentDialogComponent implements OnInit {
  appointmentForm!: FormGroup;
  workingCalendarInfo: WorkingCalendarInfo | null = null;
  futureWorkingDays: { date: Date, id: number }[] = [];
  minTime: string = '';
  maxTime: string = '';
  @ViewChild('auto') auto!: MatAutocomplete;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateAppointmentDialogComponent>,
    private companyService: CompaniesService,
    @Inject(MAT_DIALOG_DATA) public data: { companyId: number, admins: AdminInfo[] }
  ) { }

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      admin: [null, Validators.required],
      selectedDate: [null, Validators.required],
      time: ['', Validators.required],
      duration: [1, [Validators.required, Validators.min(1)]]
    });

    this.getFetchWorkingCalendarInfo(this.data.companyId);
  }

  getFetchWorkingCalendarInfo(companyId: number): void {
    this.companyService.getWorkingCalendarInfo(companyId).subscribe(
      (workingCalendarInfo: WorkingCalendarInfo) => {
        this.workingCalendarInfo = workingCalendarInfo;
        this.filterFutureWorkingDays();
      },
      (error: any) => {
        console.error('Error fetching working calendar info', error);
      }
    );
  }

  filterFutureWorkingDays(): void {
    if (!this.workingCalendarInfo) return;

    const today = new Date();
    this.futureWorkingDays = this.workingCalendarInfo.workingDays
      .map(day => ({ date: new Date(day.date), id: day.id }))
      .filter(day => day.date > today);

    // Pronalazimo minimalno i maksimalno vreme za izabrani dan
    if (this.appointmentForm.get('selectedDate')?.value) {
      const selectedDay = this.workingCalendarInfo.workingDays.find(day => day.date === this.appointmentForm.get('selectedDate')?.value);
      if (selectedDay) {
        this.minTime = new Date(selectedDay.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        this.maxTime = new Date(selectedDay.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const selectedTime = this.appointmentForm.get('time')?.value;
      if (!selectedTime) return;

      const [hours, minutes] = selectedTime.split(':');
      const selectedDate = new Date();
      selectedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      const minTime24 = this.convertTo24HourFormat(this.minTime);
      const maxTime24 = this.convertTo24HourFormat(this.maxTime);

      if (
        selectedDate.getTime() < minTime24.getTime() ||
        selectedDate.getTime() > maxTime24.getTime()
      ) {
        this.appointmentForm.get('time')?.setErrors({ invalidTime: true });
        return;
      }

      const selectedWorkingDay = this.appointmentForm.get('selectedDate')?.value;
      selectedWorkingDay.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      if (!selectedWorkingDay) return;

      const appointment: CreateAppointment = {
        adminId: this.appointmentForm.get('admin')?.value.id,
        pickUpDate: selectedDate.toISOString(),
        duration: this.appointmentForm.get('duration')?.value,
        workingDayId: this.getWorkingDayIdFromForm()
      };

      this.companyService.createAppointment(appointment).subscribe(
        () => {
          // Successfully created appointment
          this.dialogRef.close(this.appointmentForm.value);
        },
        (error) => {
          console.error('Error creating appointment', error);
          // Handle the error here, e.g., show a notification or set form errors
        }
      );
    }
  }

  getWorkingDayIdFromForm(): number | null {
    const selectedDate = this.appointmentForm.get('selectedDate')?.value;
    if (!selectedDate) return null;

    const selectedOption = this.auto.options.find(option => option.value === selectedDate);
    if (selectedOption) {
      const nativeElement: HTMLElement = selectedOption._getHostElement(); // Dobijamo HTML element MatOptiona
      const workingDayId = nativeElement.getAttribute('data-id');
      return workingDayId ? +workingDayId : null; // Pretvara string u broj ili null ako nije dostupan ID radnog dana
    }

    return null;
  }


  convertTo24HourFormat(time: string): Date {
    const timeParts = time.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Ako je PM, dodaj 12 sati na sate
    if (time.toLowerCase().includes('pm')) {
      hours += 12;
    }

    const date = new Date();
    date.setHours(hours, minutes);

    return date;
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  displayDate(date: Date | null): string {
    const datePipe = new DatePipe('en-US');
    return date ? datePipe.transform(date, 'M/d/yy') || '' : '';
  }

  onDateSelectionChange(event: MatAutocompleteSelectedEvent): void {
    const selectedDate = new Date(event.option.value);
    if (!selectedDate || !this.workingCalendarInfo) return;

    const selectedDay = this.workingCalendarInfo.workingDays.find(day => {
      const currentDate = new Date(day.date);
      return currentDate.getTime() === selectedDate.getTime();
    });

    if (selectedDay) {
      this.minTime = new Date(selectedDay.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      this.maxTime = new Date(selectedDay.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }

}
