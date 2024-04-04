import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPenalPointsComponent } from './users-penal-points.component';

describe('UsersPenalPointsComponent', () => {
  let component: UsersPenalPointsComponent;
  let fixture: ComponentFixture<UsersPenalPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersPenalPointsComponent]
    });
    fixture = TestBed.createComponent(UsersPenalPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
