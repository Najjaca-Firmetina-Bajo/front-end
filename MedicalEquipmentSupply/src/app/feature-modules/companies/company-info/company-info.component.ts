import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Equipment } from '../../administration/model/equipment.model';
import { WorkingDay } from '../../administration/model/wrking-day.model';
import { WorkingCalendar } from '../../administration/model/working-calendar.model';
import { Appointment, AppointmentType } from '../../administration/model/appointment.model';
import { CompaniesService } from '../companies.service';
import { QRCodeDto } from '../../administration/model/qrcode.model';
import { Company } from '../../administration/model/comapny.model';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
  companyId: number;
  company: any;
  filteredEquipment: any;
  selectedEquipmentMap: Map<number, number> = new Map<number, number>();
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
    this.companyService.getCompanyById(this.companyId).subscribe(
      (data: Company) => {
        this.company = data;
        console.log(this.company);

        this.loadEquipmentByIds(this.company.availableEquipment.map((e: { equipmentId: number, quantity: number }) => e.equipmentId));
      },
      error => {
        console.error('Error fetching company data:', error);
      }
    );
  }

  private loadEquipmentByIds(ids: number[]): void {
    this.companyService.getEquipmentByIds(ids).subscribe(
      (data: Equipment[]) => {
        this.filteredEquipment = data;
      },
      error => {
        console.error('Error fetching equipment data:', error);
      }
    );
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
      this.selectedEquipmentMap.set(equipmentId, 0);
    }
  }

  updateSelectedQuantity(equipmentId: number, event: any): void {
    const selectedQuantity = parseInt(event.target.value, 10);
    this.selectedEquipmentMap.set(equipmentId, selectedQuantity);
  }
  
  getIsSelected(equipment: Equipment): boolean {
    return this.selectedEquipmentMap.has(equipment.id);
  }

  getEquipmentQuantity(equipmentId: number): number {
    const availableEquipment = this.company.availableEquipment;
    const equipment = availableEquipment.find((e: { equipmentId: number, quantity: number }) => e.equipmentId === equipmentId);
  
    return equipment ? equipment.quantity : 0;
  }

  

 

  selectAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }
}
