import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongContainerComponent } from './song-container.component';
import {MAT_DIALOG_DATA, MatCheckboxModule, MatDialogModule, MatDialogRef} from '@angular/material';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Routes, UrlSegment} from '@angular/router';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {SongsService} from '../services/songs.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Globals} from '../services/globals.service';
import Spy = jasmine.Spy;
import {SongModel} from '../models/SongModel';
import {HttpParams} from '@angular/common/http';

describe('SongContainerComponent', () => {
  let component: SongContainerComponent;
  let fixture: ComponentFixture<SongContainerComponent>;
  let songService: SongsService;
  let debugElement: DebugElement;
  let songsServiceSpy: Spy;

  const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'}
  ];


  beforeEach(async(() => {
    const mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [ SongContainerComponent ],
      imports : [MatCheckboxModule, RouterTestingModule.withRoutes(routes), HttpClientTestingModule, MatDialogModule],
      providers: [
        SongsService,
        {provide: ActivatedRoute,  useValue: mockActivatedRoute},
        {provide : MatDialogRef, useValue : {}},
        {provide : MAT_DIALOG_DATA, useValue : []},
        Globals],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SongContainerComponent);
    debugElement = fixture.debugElement;
    songService = debugElement.injector.get(SongsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongContainerComponent);
    component = fixture.componentInstance;
    spyOn(component, 'ngOnInit').and.stub();
    component.songModel = new SongModel();
    fixture.detectChanges();
  });

  it('should create', () => {
    songsServiceSpy = spyOn(songService, 'retrieveAllSelectorsInitial').and.returnValue(null);
    expect(component).toBeTruthy();
  });
});


export class MockActivatedRoute extends ActivatedRoute {
  segment = [new UrlSegment( 'somePath', {})];
  url = of(this.segment);
  param = new HttpParams();
  params = of(this.param);
  // snapshot =  {paramMap: convertToParamMap({id: 'one-id'}), url: null, params: null, queryParams: null,
  //   fragment: null, data: null, outlet: null, component: null, routeConfig: null, root: null, parent: null, firstChild: null,
  //   children: null, pathFromRoot: null, queryParamMap: null
  // };
}
