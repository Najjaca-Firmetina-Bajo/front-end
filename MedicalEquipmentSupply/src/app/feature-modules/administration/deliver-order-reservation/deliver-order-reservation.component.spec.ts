import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverOrderReservationComponent } from './deliver-order-reservation.component';

describe('DeliverOrderReservationComponent', () => {
  let component: DeliverOrderReservationComponent;
  let fixture: ComponentFixture<DeliverOrderReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliverOrderReservationComponent]
    });
    fixture = TestBed.createComponent(DeliverOrderReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
