import { Component } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CompanyRating } from '../model/company-rating.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rate-company',
  templateUrl: './rate-company.component.html',
  styleUrls: ['./rate-company.component.css']
})
export class RateCompanyComponent {

  companyRating: any;
  userId: number = -1;
  companyId: number = -1
  selectedRating: number = -1;
  selectedReasons: string[] = [];
  additionalComments: string = '';
  ratings = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' }
  ];
  ratingReasons = ['Quality of equipment', 'Professionalism of the staff', 'Delivery speed and responsibility', 'Equipment hygiene'];

  constructor(private route: ActivatedRoute,private companyService: CompaniesService,private router: Router, private authService: AuthService) {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.authService.getAuthenticatedUserId().subscribe(userId => {
      this.userId = userId;
      this.companyService.findUserRatingForCompany(this.companyId,this.userId).subscribe(data => {
        this.companyRating = data;
        if (this.companyRating) {
          this.selectedRating = this.companyRating.rating;
          this.selectedReasons = this.companyRating.ratingReasons;
          this.additionalComments = this.companyRating.ratingDescription;
        }
      })
    });
  }

  submitRating(): void {

    const companyRate: CompanyRating = {
      rating: this.selectedRating,
      ratingReasons: this.selectedReasons,
      ratingDescription: this.additionalComments,
      companyId: this.companyId,
      userId: this.userId
    }

    if(!this.companyRating){
      this.companyService.rateCompany(companyRate).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
      });
    }
    else{
      this.companyService.updateCompanyRate(companyRate).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
      });
    }
  }
}
