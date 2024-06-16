import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWithReservationComponent } from './users-with-reservation.component';

describe('UsersWithReservationComponent', () => {
  let component: UsersWithReservationComponent;
  let fixture: ComponentFixture<UsersWithReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersWithReservationComponent]
    });
    fixture = TestBed.createComponent(UsersWithReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
