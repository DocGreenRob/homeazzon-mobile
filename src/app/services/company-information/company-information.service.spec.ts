import { TestBed } from '@angular/core/testing';

import { CompanyInformationService } from './company-information.service';

describe('CompanyInformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyInformationService = TestBed.get(CompanyInformationService);
    expect(service).toBeTruthy();
  });
});
