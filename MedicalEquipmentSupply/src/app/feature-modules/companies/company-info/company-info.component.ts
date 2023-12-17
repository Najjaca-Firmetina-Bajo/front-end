import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Equipment } from '../../administration/model/equipment.model';
import { WorkingDay } from '../../administration/model/wrking-day.model';
import { WorkingCalendar } from '../../administration/model/working-calendar.model';
import { Appointment } from '../../administration/model/appointment.model';
import { CompaniesService } from '../companies.service';

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

  constructor(private route: ActivatedRoute,private companyService: CompaniesService) {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
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

  

  selectedAppointment: Appointment | null = null;

  selectAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }
}
