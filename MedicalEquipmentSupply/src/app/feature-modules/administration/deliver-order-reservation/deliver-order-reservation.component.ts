import { Component, OnInit } from '@angular/core';
import { CompanyInfo } from "../model/company-info.model";
import { CompaniesService } from "../../companies/companies.service";
import { ReservationInfo } from "../model/reservation-info.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-deliver-order-reservation',
  templateUrl: './deliver-order-reservation.component.html',
  styleUrls: ['./deliver-order-reservation.component.css']
})
export class DeliverOrderReservationComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;
  userId: number | undefined;
  reservations: ReservationInfo[] = [];
  newReservations: ReservationInfo[] = [];
  showReservationTable: boolean = false;

  constructor(
    private companyService: CompaniesService,
  ) {}

  ngOnInit(): void {
    this.getAuthenticatedUserIdAndFetchCompanyInfo();
  }

  getAuthenticatedUserIdAndFetchCompanyInfo(): void {
    this.companyService.getAuthenticatedUserId().subscribe(
      (userId: number) => {
        this.userId = Number(userId);
        this.companyService.getCompanyInfo(this.userId).subscribe(
          (data: CompanyInfo) => {
            this.companyInfo = data;
            if (this.userId !== undefined) {
              this.fetchAllReservations();
            }
          },
          (error: any) => {
            console.error('Error fetching company info', error);
          }
        );
      },
      (error) => {
        console.error('Error getting authenticated user ID:', error);
      }
    );
  }

  fetchAllReservations(): void {
    if (this.userId !== undefined) {
      this.companyService.getAllReservationByAdminId(this.userId).subscribe(
        (reservations: ReservationInfo[]) => {
          this.reservations = reservations;
          this.fetchNewReservations();
        },
        (error) => {
          console.error('Error fetching reservations:', error);
        }
      );
    }
  }

  fetchNewReservations(): void {
    if (this.userId !== undefined) {
      this.companyService.getAllNewReservationByAdminId(this.userId).subscribe(
        (newReservations: ReservationInfo[]) => {
          this.newReservations = newReservations;
        },
        (error) => {
          console.error('Error fetching new reservations:', error);
        }
      );
    }
  }

  toggleReservationTable(): void {
    this.showReservationTable = !this.showReservationTable;
  }

  deliverClicked(appointmentId: number, qrEquipmentId: number): void {
    this.companyService.deliverReservation(appointmentId, qrEquipmentId).subscribe(
      (success: boolean) => {
        if (success) {
          // Optional: Handle success message or update UI
          console.log(`Reservation delivered successfully: appointmentId=${appointmentId}, qrEquipmentId=${qrEquipmentId}`);
          this.fetchAllReservations();
          this.fetchNewReservations();
        } else {
          console.error(`Failed to deliver reservation: appointmentId=${appointmentId}, qrEquipmentId=${qrEquipmentId}`);
        }
      },
      (error: any) => {
        console.error('Error delivering reservation:', error);
      }
    );
  }

}
