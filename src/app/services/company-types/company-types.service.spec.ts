import { TestBed } from '@angular/core/testing';

import { CompanyTypesService } from './company-types.service';

describe('CompanyTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyTypesService = TestBed.get(CompanyTypesService);
    expect(service).toBeTruthy();
  });
});
