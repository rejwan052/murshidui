import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagerComponent } from './pager.component';
import {Globals} from '../../services/globals.service';
import {PaginationService} from '../../services/pagination.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';


describe('PagerComponent', () => {
  let component: PagerComponent;
  let fixture: ComponentFixture<PagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PagerComponent ],
      providers: [Globals, PaginationService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(PagerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

