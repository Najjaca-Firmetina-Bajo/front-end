import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAdministrationComponent } from './profile-administration.component';

describe('ProfileAdministrationComponent', () => {
  let component: ProfileAdministrationComponent;
  let fixture: ComponentFixture<ProfileAdministrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileAdministrationComponent]
    });
    fixture = TestBed.createComponent(ProfileAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
