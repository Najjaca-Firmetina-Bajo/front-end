import { Component, OnInit } from '@angular/core';
import { CompanyInfo } from "../model/company-info.model";
import { CompaniesService } from "../../companies/companies.service";
import { ReservationInfo } from "../model/reservation-info.model";

@Component({
  selector: 'app-deliver-order-reservation',
  templateUrl: './deliver-order-reservation.component.html',
  styleUrls: ['./deliver-order-reservation.component.css']
})
export class DeliverOrderReservationComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;
  userId: number | undefined;
  reservations: ReservationInfo[] = [];
  showReservationTable: boolean = false; // Dodali smo promenljivu za prikazivanje/sakrivanje tabele

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
              this.companyService.getAllReservationByAdminId(this.userId).subscribe(
                (reservations: ReservationInfo[]) => {
                  this.reservations = reservations;
                }
              )
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

  // Funkcija za prikazivanje/sakrivanje tabele
  toggleReservationTable(): void {
    this.showReservationTable = !this.showReservationTable;
  }
}
