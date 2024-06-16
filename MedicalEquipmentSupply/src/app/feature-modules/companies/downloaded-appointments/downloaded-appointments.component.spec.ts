import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadedAppointmentsComponent } from './downloaded-appointments.component';

describe('DownloadedAppointmentsComponent', () => {
  let component: DownloadedAppointmentsComponent;
  let fixture: ComponentFixture<DownloadedAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadedAppointmentsComponent]
    });
    fixture = TestBed.createComponent(DownloadedAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
