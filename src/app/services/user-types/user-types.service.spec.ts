import { TestBed } from '@angular/core/testing';

import { UserTypesService } from './user-types.service';

describe('UserTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserTypesService = TestBed.get(UserTypesService);
    expect(service).toBeTruthy();
  });
});
