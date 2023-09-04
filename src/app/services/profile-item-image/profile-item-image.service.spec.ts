import { TestBed } from '@angular/core/testing';

import { ProfileItemImageService } from './profile-item-image.service';

describe('PropertyProfilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
      const service: ProfileItemImageService = TestBed.get(ProfileItemImageService);
    expect(service).toBeTruthy();
  });
});
