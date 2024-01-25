import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  user: User | undefined;  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage()!;
  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.user = this.authService.getUserFromLocalStorage()!;
      }
    });
  }

  isUserLoggedIn(): boolean {
    return !!this.user; // Returns true if user is defined, false if undefined
  }

  onLogout(): void {
    this.authService.logout();
    this.user = undefined;
  }

}