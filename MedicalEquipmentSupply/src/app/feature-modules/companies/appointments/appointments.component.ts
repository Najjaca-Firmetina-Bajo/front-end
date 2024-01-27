import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { QRCodeDto } from '../../administration/model/qrcode.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent {
  qrCodes: QRCodeDto[] = [];
  userId: any;

  constructor(private companyService: CompaniesService) { }

  ngOnInit(): void {
    this.getAuthenticatedUserId().subscribe((userId: any) => {
      this.userId = userId;

      this.companyService.getAllQRCodesForUser(this.userId).subscribe(
        (data: QRCodeDto[]) => {
          this.qrCodes = data;
        },
        error => {
          console.error('Error fetching QR codes:', error);
        }
      );
    });
  }

  private getAuthenticatedUserId(): Observable<number> {
    return this.companyService.getAuthenticatedUserId();
  }

  cancelQRCode(qrCodeId: number): void {
    this.companyService.cancelAppointmentReservation(qrCodeId).subscribe(
      () => {
        this.companyService.getAllQRCodesForUser(this.userId).subscribe(
          (data: QRCodeDto[]) => {
            this.qrCodes = data;
          },
          error => {
            console.error('Error fetching QR codes:', error);
          }
        );
      },
      error => {
        console.error('Error canceling QR code:', error);
      }
    );
  }
}
