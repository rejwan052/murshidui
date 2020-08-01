import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongSelectorItemComponent } from './song-selector-item.component';
import {Globals} from '../../services/globals.service';
import {RouterTestingModule} from '@angular/router/testing';
import {SongSelector} from '../../models/SongSelector';

describe('SongSelectorItemComponent', () => {
  let component: SongSelectorItemComponent;
  let fixture: ComponentFixture<SongSelectorItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongSelectorItemComponent ],
      imports: [RouterTestingModule],
      providers: [Globals]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongSelectorItemComponent);
    component = fixture.componentInstance;
    component.songSelectorItem = new SongSelector();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
