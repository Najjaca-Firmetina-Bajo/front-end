import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CompanyAdministrator } from '../../model/company-administrator.model';
import { Appointment } from '../../model/appointment.model';
import { QRCodeDto } from '../../model/qrcode.model';
import { QRCodeEquipment } from '../../model/qr-eq.model';
import { Equipment } from '../../model/equipment.model';

@Component({
  selector: 'app-reservation-review',
  templateUrl: './reservation-review.component.html',
  styleUrls: ['./reservation-review.component.css']
})
export class ReservationReviewComponent implements OnInit{

  allUnexpiredAppointments: Appointment[] = []
  allExpiredAppointments: Appointment[] = []
  allQRCodes: QRCodeDto[] = []
  allQRCodeEquipment: QRCodeEquipment[] = []
  allEquipment: Equipment[] = []

  unexpiredAppointmentsForCA: Appointment[] = []

  companyAdmins: CompanyAdministrator[] = []
  loggedCA: CompanyAdministrator = {
    activated: false,
    role: '',
    companyId: 0,
    id: 0,
    dtype: '',
    city: '',
    companyInfo: '',
    country: '',
    email: '',
    name: '',
    occupation: '',
    password: '',
    phoneNumber: '',
    surname: '',
    appointmentsIds: []
  }
  caName: String = ""

  constructor(private administrationService: AdministrationService, private authService: AuthService) {}

  ngOnInit(): void {
      this.getAllCompanyAdministrators()
  }

  getAllCompanyAdministrators(): void {
    this.administrationService.getAllCompanyAdministrators().subscribe({
      next: (result: CompanyAdministrator[]) => {
          this.companyAdmins = result;
          this.getLoggedUser();
      },
      error: () => { }
    });
  }

  getLoggedUser(): void {
    this.authService.getAuthenticatedUserId().subscribe({
      next: (result: number) => {
          this.investigate(result);
      },
      error: () => { }
    });
  }

  investigate(userId: number): void {
    this.companyAdmins.forEach(ca => {
      if(ca.id === userId) {
        this.loggedCA = ca;
        this.caName = "Issuing of equipment - " + ca.name + " " + ca.surname
      }
    })
  }

  getAllUnexpiredAppointments(): void {
    this.administrationService.getNotExpiredAppointments().subscribe({
      next: (result: Appointment[]) => {
          this.allUnexpiredAppointments = result;
          this.getAllEexpiredAppointments();
      },
      error: () => { }
    });
  }

  getAllEexpiredAppointments(): void {
    this.administrationService.getExpiredAppointments().subscribe({
      next: (result: Appointment[]) => {
          this.allExpiredAppointments = result;
          this.getAllQRCodes();
      },
      error: () => { }
    });
  }

  getAllQRCodes(): void {
    this.administrationService.getAllQRCodes().subscribe({
      next: (result: QRCodeDto[]) => {
          this.allQRCodes = result;
          this.getAllQRCodeEquipment();
      },
      error: () => { }
    });
  }

  getAllQRCodeEquipment(): void {
    this.administrationService.getAllQRCodeEquipments().subscribe({
      next: (result: QRCodeEquipment[]) => {
          this.allQRCodeEquipment = result;
          this.getAllEquipment();
      },
      error: () => { }
    });
  }

  getAllEquipment(): void {
    this.administrationService.getAllEquipment().subscribe({
      next: (result: Equipment[]) => {
          this.allEquipment = result;
          this.findUnexpiredAppointmentsForCA()
      },
      error: () => { }
    });
  }

  findUnexpiredAppointmentsForCA(): void {
    this.allUnexpiredAppointments.forEach(uap => {
      if(uap.companyAdministratorId === this.loggedCA.id) {
        this.unexpiredAppointmentsForCA.push(uap);
      }
    })
  }

  //sada CA prilaze QRCode. QRCode se trazi u njegovim listama za pocetak, prikazu se sve informacije koje QRCode sadrzi.
  //u zavisnosti od datuma, prikazuje se opcija "issue equipment" + obavjestenje o mejlu
  //u zavisnosti od datuma, prikazuje se poruka o penalima za registrovanog korisnika

}
