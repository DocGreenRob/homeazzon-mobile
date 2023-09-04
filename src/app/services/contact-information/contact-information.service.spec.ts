import { TestBed } from '@angular/core/testing';

import { ContactInformationService } from './contact-information.service';

describe('ContactInformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactInformationService = TestBed.get(ContactInformationService);
    expect(service).toBeTruthy();
  });
});
