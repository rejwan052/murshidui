import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTagsComponent } from './all-tags.component';
import {HttpClient, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Meta, Title} from '@angular/platform-browser';

describe('AllTagsComponent', () => {
  // let component: AllTagsComponent;
  // let tagsService: TagsService;
  // let spy: Spy;
  //
  // beforeEach(() => {
  //   tagsService =  new TagsService(new HttpClient(new MockHttpHandler()));
  //   component = new AllTagsComponent(new Globals(), tagsService, new MockMeta(), new MockTitle());
  // });
  //
  // xit('should create', () => {
  //   spy = spyOn(tagsService, 'retrieveAll').and.returnValue([]);
  //   expect(component).toBeTruthy();
  // });
});


export class MockTitle extends Title {
  constructor() {
    super(null);
  }

  setTitle(newTitle: string): void {
  }
}

export class MockMeta extends Meta {
  constructor() {
    super(null);
  }

  getTag(attrSelector: string): HTMLMetaElement | null {
    return HTMLMetaElement.prototype;
  }

  removeTag(attrSelector: string): void {
  }


  updateTag(tag: { charset?: string; content?: string; httpEquiv?: string; id?: string; itemprop?: string; name?: string; property?: string; scheme?: string; url?: string } & { [p: string]: string }, selector?: string): HTMLMetaElement | null {
    return undefined;
  }
}



export class MockHttpHandler extends HttpHandler {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return undefined;
  }
}
