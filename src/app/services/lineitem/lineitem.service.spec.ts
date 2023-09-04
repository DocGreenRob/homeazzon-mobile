import { TestBed } from '@angular/core/testing';

import { LineitemService } from './lineitem.service';

describe('LineitemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineitemService = TestBed.get(LineitemService);
    expect(service).toBeTruthy();
  });
});
