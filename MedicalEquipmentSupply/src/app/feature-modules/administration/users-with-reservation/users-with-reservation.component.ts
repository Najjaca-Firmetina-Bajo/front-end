import {Component, OnInit} from '@angular/core';
import {CompanyInfo} from "../model/company-info.model";
import {AdministrationService} from "../administration.service";
import {CompaniesService} from "../../companies/companies.service";
import {RegisteredUserInfo} from "../model/registered-user-info.model";

@Component({
  selector: 'app-users-with-reservation',
  templateUrl: './users-with-reservation.component.html',
  styleUrls: ['./users-with-reservation.component.css']
})
export class UsersWithReservationComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;
  userId: number | undefined;
  usersWithReservation: RegisteredUserInfo[] = [];
  displayedColumns: string[] = ['name', 'surname', 'email', 'address', 'phoneNumber'];

  constructor(private administrationService: AdministrationService,
              private companyService: CompaniesService) {}

  ngOnInit(): void {
    this.getAuthenticatedUserIdAndFetchCompanyInfo()
  }

  getAuthenticatedUserIdAndFetchCompanyInfo(): void {
    this.companyService.getAuthenticatedUserId().subscribe(
      (userId: number) => {
        this.userId = Number(userId);
        this.companyService.getCompanyInfo(this.userId).subscribe(
          (data: CompanyInfo) => {
            this.companyInfo = data;
            this.administrationService.getAllUsersWithReservations(this.companyInfo.id).subscribe(
              (usersInfo: RegisteredUserInfo[]) => {
                this.usersWithReservation = usersInfo;
              }
            )
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

}
