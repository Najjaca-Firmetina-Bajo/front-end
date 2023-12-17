import { TestBed } from '@angular/core/testing';

import { AdministrationServiceService } from './administration.service';

describe('AdministrationServiceService', () => {
  let service: AdministrationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministrationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
