import {ComponentFixture, TestBed} from '@angular/core/testing';

import { TagsService } from './tags.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TagsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [TagsService]
  }));

  it('should be created', () => {
    const service: TagsService = TestBed.get(TagsService);
    expect(service).toBeTruthy();
  });
});
