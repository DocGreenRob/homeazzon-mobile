import { TestBed } from '@angular/core/testing';

import { PrivateLabelService } from './private-label.service';

describe('PrivateLabelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrivateLabelService = TestBed.get(PrivateLabelService);
    expect(service).toBeTruthy();
  });
});
