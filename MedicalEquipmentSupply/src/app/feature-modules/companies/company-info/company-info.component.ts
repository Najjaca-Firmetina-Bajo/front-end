import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Equipment } from '../../administration/model/equipment.model';
import { Appointment } from '../../administration/model/appointment.model';
import { CompaniesService } from '../companies.service';
import { QRCodeDto } from '../../administration/model/qrcode.model';
import { Company } from '../../administration/model/comapny.model';
import {EditCompanyDialogComponent} from "../../edit-company-dialog/edit-company-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {CompanyInfo} from "../../administration/model/company-info.model";
import {AuthService} from "../../../infrastructure/auth/auth.service";
import {User} from "../../../infrastructure/auth/model/user.model";

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
  user!: User;
  selectedDate: Date = new Date();
  companyNotWorking: boolean = false;
  coord: any;
  fixCoord: any;

  constructor(private route: ActivatedRoute,private companyService: CompaniesService,
              private router: Router,
              private authService: AuthService) {
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

        const [street, number, city, country,longitude, latitude] = this.company.address.split('-');
        this.coord = [parseFloat(latitude), parseFloat(longitude)];
        this.fixCoord = [this.coord, this.coord];

        console.log(this.company);

        this.loadEquipmentByIds(this.company.availableEquipment.map((e: { equipmentId: number, quantity: number }) => e.equipmentId));
        this.loadAppointments();
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

  loadAppointments(): void {
    this.companyNotWorking = false;
    if(this.companyId){
      this.companyService.getWorkingCalendar(this.companyId).subscribe((data) => {
        this.companyService.getAllAppointmentsByCalendar(data.id).subscribe((data) => {
          this.appointments = data;
        });
      });
    }
  }

   loadExtraordinaryAppointments(): void{
    if(this.companyId){
      this.companyService.getExtraordinaryAppointments(this.selectedDate,this.companyId).subscribe((data) =>{
        this.appointments = data;
        if(this.appointments.length === 0){
          this.companyNotWorking = true;
        }else{
          this.companyNotWorking = false;
        }
      })
    }
  }

  reserveAppointment(): void {
    if (this.selectedAppointment && this.hasSelectedEquipment()) {
      this.getAuthenticatedUserId();

      const reservedEquipment: { equipmentId: number; quantity: number }[] = [];

      // Iterate over selected equipment map and construct reserved equipment array
      this.selectedEquipmentMap.forEach((quantity, equipmentId) => {
        reservedEquipment.push({ equipmentId, quantity });
      });

      const qrCodeDto: QRCodeDto = {
        id: 0,
        code: 'string',
        status: 'NEW',
        registeredUserId: this.userId,
        appointmentId: this.selectedAppointment.id,
        reservedEquipment: reservedEquipment,
      };

      this.companyService.reserveAppointment(qrCodeDto).subscribe(
        () => {
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error reserving appointment:', error);
        }
      );
    }
  }

  getAuthenticatedUserId(): void {
    this.companyService.getAuthenticatedUserId().subscribe(
      (userId: number) => {
        this.userId = Number(userId);
        this.authService.getAuthenticatedUserDetails().subscribe(
          (data: User) => {
            this.user = data
          },
          (error) => {
            console.error('Error getting authenticated user ID:', error);
          }
        );
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
      this.selectedEquipmentMap.set(equipmentId, 1);
    }
  }

  hasSelectedEquipment(): boolean {
    return this.selectedEquipmentMap.size > 0;
  }

  updateSelectedQuantity(equipmentId: number, event: any): void {
    const selectedQuantity = parseInt(event.target.value, 10);
    if(selectedQuantity > 0)
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
