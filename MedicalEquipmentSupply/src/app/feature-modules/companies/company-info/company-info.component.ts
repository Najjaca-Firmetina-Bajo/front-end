import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Equipment } from '../../administration/model/equipment.model';
import { WorkingDay } from '../../administration/model/wrking-day.model';
import { WorkingCalendar } from '../../administration/model/working-calendar.model';
import { Appointment, AppointmentType } from '../../administration/model/appointment.model';
import { CompaniesService } from '../companies.service';
import { QRCodeDto } from '../../administration/model/qrcode.model';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
  companyId: number;
  company: any;
  filteredEquipment: any;
  selectedEquipmentMap: Map<number, boolean> = new Map<number, boolean>();
  appointments: any;
  selectedAppointment: Appointment | null = null;
  userId: number;

  constructor(private route: ActivatedRoute,private companyService: CompaniesService,private router: Router) {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = Number(-1);
    this.getAuthenticatedUserId();
  }

  ngOnInit(): void {
    this.company = this.loadCompanies();
  }

  private loadCompanies(): void {
    this.companyService.getCompanies().subscribe((data) => {
      this.company = data.find(company => company.id === this.companyId);
      this.loadEquipmentByCompanyId();
      this.loadAppointments();
    });
  }

  private loadEquipmentByCompanyId(): void {
    if(this.companyId){
      this.companyService.getAllEquipment().subscribe((data) => {
        this.filteredEquipment = data.filter(equipment => equipment.companies.includes(this.companyId));
      });
    }
  }

  private loadAppointments(): void {
    if(this.companyId){
      this.companyService.getWorkingCalendar(this.companyId).subscribe((data) => {
        this.companyService.getAllAppointmentsByCalendar(data.id).subscribe((data) => {
          this.appointments = data;
          console.log(data);
        });
      });
    }
  }

  reserveAppointment(): void {
    if (this.selectedAppointment) {
      this.getAuthenticatedUserId();
      const qrCodeDto: QRCodeDto = {
        id: 0,
        code: 'string', 
        status: 'NEW', 
        registeredUserId: this.userId,
        appointmentId: this.selectedAppointment.id,
        reservedEquipmentIds: Array.from(this.selectedEquipmentMap.keys())
      };

      this.companyService.reserveAppointment(qrCodeDto).subscribe(() => {
        this.router.navigate(['/companies']);
      });
    }
  }

  getAuthenticatedUserId(): void {
    this.companyService.getAuthenticatedUserId().subscribe(
      (userId: number) => {
        console.log('Authenticated User ID:', Number(userId));
        this.userId = Number(userId)
      },
      (error) => {
        console.error('Error getting authenticated user ID:', error);
      }
    );
  }

  toggleEquipmentSelection(equipment: Equipment): void {
    const equipmentId = equipment.id;
    
    if (this.selectedEquipmentMap.has(equipmentId)) {
      this.selectedEquipmentMap.delete(equipmentId);
    } else {
      this.selectedEquipmentMap.set(equipmentId, true);
    }
  }
  
  getIsSelected(equipment: Equipment): boolean {
    return this.selectedEquipmentMap.has(equipment.id);
  }

  

 

  selectAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }
}
