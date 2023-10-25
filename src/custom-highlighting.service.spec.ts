import { TestBed } from '@angular/core/testing';

import { CustomHighlightingService } from './custom-highlighting.service';

describe('CustomHighlightingService', () => {
  let service: CustomHighlightingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomHighlightingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
