import { TestBed } from '@angular/core/testing';

import { PrivatelabelerSettingsService } from './privatelabeler-settings.service';

describe('PrivatelabelerSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrivatelabelerSettingsService = TestBed.get(PrivatelabelerSettingsService);
    expect(service).toBeTruthy();
  });
});
