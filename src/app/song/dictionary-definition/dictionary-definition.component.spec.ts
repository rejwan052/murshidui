import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryDefinitionComponent } from './dictionary-definition.component';
import {SongsService} from '../../services/songs.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material';
import {Observable, of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Globals} from '../../services/globals.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('DictionaryDefinitionComponent', () => {
  let component: DictionaryDefinitionComponent;
  let fixture: ComponentFixture<DictionaryDefinitionComponent>;

  // let dialogSpy: jasmine.Spy;
  // const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  // dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async(() => {
    // dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    TestBed.configureTestingModule({
      declarations: [ DictionaryDefinitionComponent ],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [SongsService, Globals,
        {provide : MatDialogRef, useValue : {}},
        {provide : MAT_DIALOG_DATA, useValue : []}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictionaryDefinitionComponent);
    component = fixture.componentInstance;
    // component.dialogRef = dialogRefSpyObj;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

