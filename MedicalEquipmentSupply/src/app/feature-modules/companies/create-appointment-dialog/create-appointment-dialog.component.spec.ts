import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppointmentDialogComponent } from './create-appointment-dialog.component';

describe('CreateAppointmentDialogComponent', () => {
  let component: CreateAppointmentDialogComponent;
  let fixture: ComponentFixture<CreateAppointmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAppointmentDialogComponent]
    });
    fixture = TestBed.createComponent(CreateAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
