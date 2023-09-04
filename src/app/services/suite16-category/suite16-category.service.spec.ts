import { TestBed } from '@angular/core/testing';

import { Suite16CategoryService } from './suite16-category.service';

describe('Suite16CategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Suite16CategoryService = TestBed.get(Suite16CategoryService);
    expect(service).toBeTruthy();
  });
});
