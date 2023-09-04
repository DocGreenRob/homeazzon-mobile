import { TestBed } from '@angular/core/testing';
import { MetattachService } from './metattach.service';

describe('MetattachService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MetattachService = TestBed.get(MetattachService);
    expect(service).toBeTruthy();
  });
});
