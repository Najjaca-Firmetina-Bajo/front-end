import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment, AppointmentType } from '../../administration/model/appointment.model';
import { CompaniesService } from '../companies.service';
import { Equipment } from '../../administration/model/equipment.model';

@Component({
  selector: 'app-downloaded-appointments',
  templateUrl: './downloaded-appointments.component.html',
  styleUrls: ['./downloaded-appointments.component.css']
})
export class DownloadedAppointmentsComponent {
  appointments: Appointment[] = [];
  userId: number;
  ascOrDesc: string = 'asc';
  type: string = 'date';

  constructor(private route: ActivatedRoute,private companyService: CompaniesService,private router: Router) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
      this.companyService.getUsersDownloadedAppointments(this.userId).subscribe((data) => {
        this.appointments = data;
        this.appointments.forEach((appointment: any) => {
          // radite nešto sa svakim pojedinačnim appointment objektom
          appointment.reservedEquipment.forEach((re: { equipmentId: number; }): any =>{
            let equipmentList: Equipment[] = []
            this.companyService.getEquipment(re.equipmentId).subscribe((data)=>{
              equipmentList.push(data);
            })
            appointment.reservedEquipmentReal = equipmentList;
          })
        });
      });
  }

  sortAppointments(): void {
    this.companyService.sortAppointments(this.ascOrDesc,this.type, this.userId).subscribe((data) => {
      this.appointments = data;
        this.appointments.forEach((appointment: any) => {
          // radite nešto sa svakim pojedinačnim appointment objektom
          appointment.reservedEquipment.forEach((re: { equipmentId: number; }): any =>{
            let equipmentList: Equipment[] = []
            this.companyService.getEquipment(re.equipmentId).subscribe((data)=>{
              equipmentList.push(data);
            })
            appointment.reservedEquipmentReal = equipmentList;
          })
        });
    })
  }

  reset(): void{
    this.loadAppointments();
  }
}
