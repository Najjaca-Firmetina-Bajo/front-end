import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment, AppointmentType } from '../../administration/model/appointment.model';
import { CompaniesService } from '../companies.service';

@Component({
  selector: 'app-downloaded-appointments',
  templateUrl: './downloaded-appointments.component.html',
  styleUrls: ['./downloaded-appointments.component.css']
})
export class DownloadedAppointmentsComponent {
  appointments: any;
  userId: number;

  constructor(private route: ActivatedRoute,private companyService: CompaniesService,private router: Router) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
      this.companyService.getUsersDownloadedAppointments(this.userId).subscribe((data) => {
        this.appointments = data;
      });
    }
}
