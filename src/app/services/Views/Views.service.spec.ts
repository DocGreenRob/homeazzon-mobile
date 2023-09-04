import { TestBed } from '@angular/core/testing';
import { UxNotifierService } from '../uxNotifier/ux-notifier.service';

describe('UxNotifierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UxNotifierService = TestBed.get(UxNotifierService);
    expect(service).toBeTruthy();
  });
});
