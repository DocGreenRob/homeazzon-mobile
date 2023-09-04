import { TestBed } from '@angular/core/testing';

import { FirebaseUploadService } from './firebase-upload.service';

describe('FirebaseUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseUploadService = TestBed.get(FirebaseUploadService);
    expect(service).toBeTruthy();
  });
});
