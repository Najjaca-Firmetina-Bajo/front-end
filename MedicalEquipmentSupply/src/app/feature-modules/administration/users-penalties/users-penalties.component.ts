import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-penalties',
  templateUrl: './users-penalties.component.html',
  styleUrls: ['./users-penalties.component.css']
})
export class UsersPenaltiesComponent {
  userId: number;
  penalPoints: number = -1;

  constructor(
    private administrationService: AdministrationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.administrationService.getUsersPenalPoints(this.userId).subscribe((penal) => {
      this.penalPoints = penal;
    });
  }

  
}
