import { TestBed } from '@angular/core/testing';

import { ArtifactIndexService } from './artifact-index.service';

describe('ArtifactIndexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArtifactIndexService = TestBed.get(ArtifactIndexService);
    expect(service).toBeTruthy();
  });
});
