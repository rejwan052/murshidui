import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverComponent } from './cover.component';
import {Globals} from '../services/globals.service';
import {PaginationService} from '../services/pagination.service';
import {SongsService} from '../services/songs.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRoute, Router, Routes, UrlSegment} from '@angular/router';
import {TagsService} from '../services/tags.service';
import {Observable, of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';


describe('CoverComponent', () => {
  // let component: CoverComponent;
  // let fixture: ComponentFixture<CoverComponent>;
  // const routes: Routes = [
  //   {path: '', redirectTo: 'home', pathMatch: 'full'}
  // ];
  //
  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ CoverComponent ],
  //     imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes)],
  //     providers: [Globals, PaginationService, SongsService, TagsService],
  //     schemas: [NO_ERRORS_SCHEMA]
  //   });
  //   fixture = TestBed.createComponent(CoverComponent);
  //   component = fixture.componentInstance;
  // });
  //
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});


