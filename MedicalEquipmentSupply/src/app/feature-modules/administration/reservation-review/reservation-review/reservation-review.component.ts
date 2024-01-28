import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CompanyAdministrator } from '../../model/company-administrator.model';
import { Appointment } from '../../model/appointment.model';
import { QRCodeDto } from '../../model/qrcode.model';
import { QRCodeEquipment } from '../../model/qr-eq.model';
import { Equipment } from '../../model/equipment.model';
import jsQR from 'jsqr';
import { RegistredUser } from '../../model/registred-user.model';
import { Router } from '@angular/router';

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
  allRegisteredUsers: RegistredUser[] = []

  unexpiredAppointmentsForCA: Appointment[] = []
  qrCodeAppointmentId: string = "";
  registeredUserId: number = -1
  responsibleCompanyAdministrator: string = ""

  isValidQRcode: boolean = false;
  isExpiredQRcode: boolean = false;
  isWrongAdministrator: boolean = false;
  isDownloaded: boolean = false;
  isUsed: boolean = false;

  imageUrl: string = ""

  reservationDetails: { reservationNumber: number, registeredUser: string, equipments: string[], eids: number[], quantities: number[] } = {
    reservationNumber: -1,
    registeredUser: "",
    equipments: [],
    eids: [],
    quantities: []
  }  

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

  constructor(private administrationService: AdministrationService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
      this.getAllCompanyAdministrators()
  }

  getAllCompanyAdministrators(): void {
    this.administrationService.getAllCompanyAdministrators().subscribe({
      next: (result: CompanyAdministrator[]) => {
          this.companyAdmins = result;
          this.getAllRegisteredUsers();
      },
      error: () => { }
    });
  }

  getAllRegisteredUsers(): void {
    this.administrationService.getAllRegisteredUsers().subscribe({
      next: (result: RegistredUser[]) => {
          this.allRegisteredUsers = result;
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
    this.getAllUnexpiredAppointments()
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

  findAppointment(): void {
    this.isValidQRcode = false;
    this.isExpiredQRcode = false;
    this.isWrongAdministrator = false;
    this.isDownloaded = false;
    this.isUsed = false;

    let flag = false;
    this.unexpiredAppointmentsForCA.forEach(uap => { //this.unexpiredAppointmentsForCA.forEach, this.allExpiredAppointments
      const qrid = parseInt(this.qrCodeAppointmentId, 10);
      if(uap.id === qrid) {
        flag = true;
        this.reservationDetails.eids.length = 0;
        this.reservationDetails.equipments.length = 0;
        this.reservationDetails.registeredUser = "";
        this.reservationDetails.reservationNumber = -1;
        this.findQRCodeInformations(uap, true);
      }
    })
  
    if(!flag) {
      this.isQRcodeAlreadyUsed()
    }
  }

  isQRcodeAlreadyUsed(): void {
    let flag = false;
    const qrid = parseInt(this.qrCodeAppointmentId, 10);
    this.allUnexpiredAppointments.forEach(uap => {
      if(uap.id === qrid) {
        flag = true;
      }
    }) 
    
    if(!flag) {
      this.isUsed = true;
      this.isReservationExpired()
    }
  }

  isReservationExpired(): void {
    let flag = false
    this.allExpiredAppointments.forEach(a => {
      const qrid = parseInt(this.qrCodeAppointmentId, 10);
      if(a.id === qrid) {
        flag = true;
        this.findQRCodeInformations(a, false)
        this.givePenalPoints()
      }
    })

    if(!flag) {
      this.findAppropriateCompanyAdministrator()
    }
  }

  findAppropriateCompanyAdministrator(): void {
    this.allUnexpiredAppointments.forEach(a => {
      const qrid = parseInt(this.qrCodeAppointmentId, 10);
      if(a.id === qrid) {
        this.companyAdmins.forEach(ca => {
          if(a.companyAdministratorId === ca.id) {
            this.responsibleCompanyAdministrator = ca.name + " " + ca.surname;
            this.isWrongAdministrator = true;
          }
        })
      }
    })
  }

  givePenalPoints(): void {
    this.administrationService.givePenalPoints(this.registeredUserId).subscribe({
      next: (result: number) => {
          this.isExpiredQRcode = true;
      },
      error: () => { }
    });
  }

  findQRCodeInformations(appointment: Appointment, isValid: boolean): void {
    this.allQRCodes.forEach(qr => {
      if(qr.appointmentId === appointment.id) {
        this.reservationDetails.reservationNumber = qr.id;
        this.findRegisteredUser(qr, isValid)
      }
    })
  }

  findRegisteredUser(qrCode: QRCodeDto, isValid: boolean): void {
    this.allRegisteredUsers.forEach(ru => {
      if(qrCode.registeredUserId === ru.id) {
        this.reservationDetails.registeredUser = ru.name + " " + ru.surname;
        this.registeredUserId = ru.id
        this.findQRCodeEquipment(qrCode, isValid);
      }
    })
  }

  findQRCodeEquipment(qrCode: QRCodeDto, isValid: boolean): void {
    this.allQRCodeEquipment.forEach(qre => {
      if(qre.qrCode === qrCode.id) {
        this.allEquipment.forEach(e => {
          if(qre.equipmentId === e.id) {
            this.reservationDetails.eids.push(e.id);
            this.reservationDetails.equipments.push(e.name + " x" + qre.quantity);
            this.reservationDetails.quantities.push(qre.quantity);
          }
        })
      }
    })

    if(isValid) {
      this.isValidQRcode = true;
    }
  }

  updateStockStatus(): void {
    let i = 0;
    this.reservationDetails.eids.forEach(eid => {
      this.administrationService.updateStockStatus(eid, this.loggedCA.companyId, this.reservationDetails.quantities[i]).subscribe({
        next: (result: number) => {
            i = i + 1;
        },
        error: () => { }
      });
    })
    this.downloadEquipmentAndSendEmail()
  }

  downloadEquipmentAndSendEmail(): void {
    const qrid = parseInt(this.qrCodeAppointmentId, 10);
    this.administrationService.downloadEquipmentAndSendEmail(qrid, this.reservationDetails.reservationNumber).subscribe({
      next: (result: number) => {
        this.isValidQRcode = false;
        this.isDownloaded = true;
      },
      error: () => { }
    });
  }

  backToPerviousPage(): void {
    this.router.navigate(['/home']); 
  }

  handleFileInput(event: any): void {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const imageDataUrl = e.target.result;
        this.imageUrl = reader.result as string;
        this.processImageData(imageDataUrl);
      };

      reader.readAsDataURL(file);
    }
  }

  processImageData(imageDataUrl: string): void {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0, img.width, img.height);

      const imageData = context?.getImageData(0, 0, img.width, img.height);
      if (imageData) {
        const code = jsQR(imageData.data, img.width, img.height);

        if (code) {
          console.log('Detected QR Code:', code);
          this.qrCodeAppointmentId = code.data;
          console.log(this.qrCodeAppointmentId) //appointment id
        } else {
          console.log('QR kod nije pronađen.');
          this.qrCodeAppointmentId = "";
        }
      } else {
        console.log('Nemoguće dobiti podatke o slici.');
        this.qrCodeAppointmentId = "";
      }
    };

    img.src = imageDataUrl;
  }

}
