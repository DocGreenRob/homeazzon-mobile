import { TestBed } from '@angular/core/testing';

import { AzureAuthService } from './azure-auth.service';

describe('AuthService', () => {
  let service: AzureAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
