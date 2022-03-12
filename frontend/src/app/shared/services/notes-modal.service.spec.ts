import { TestBed } from '@angular/core/testing';

import { NotesModalService } from './notes-modal.service';

describe('NotesModalService', () => {
  let service: NotesModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
