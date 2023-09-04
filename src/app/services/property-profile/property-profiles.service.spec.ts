import { TestBed } from '@angular/core/testing';

import { PropertyProfilesService } from './property-profiles.service';

describe('PropertyProfilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropertyProfilesService = TestBed.get(PropertyProfilesService);
    expect(service).toBeTruthy();
  });
});
