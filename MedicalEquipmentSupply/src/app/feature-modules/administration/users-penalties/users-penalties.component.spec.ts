import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPenaltiesComponent } from './users-penalties.component';

describe('UsersPenaltiesComponent', () => {
  let component: UsersPenaltiesComponent;
  let fixture: ComponentFixture<UsersPenaltiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersPenaltiesComponent]
    });
    fixture = TestBed.createComponent(UsersPenaltiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
