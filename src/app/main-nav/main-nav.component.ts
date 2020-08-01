import {Component, ViewChild, ViewChildren} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {Globals} from '../services/globals.service';
import {Router} from '@angular/router';
import {PaginationService} from '../services/pagination.service';
import {Section} from '../models/Section';
import {Transliteration} from '../models/Transliteration';
import {UrlUtils} from '../utils/UrlUtils';
import {environment} from '../../environments/environment';
import {SelectorComponent} from '../selector/selector.component';
declare var $: any;

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  @ViewChild(SelectorComponent, {static: false})
  selectorComponent: SelectorComponent;

  constructor(private breakpointObserver: BreakpointObserver, public globals: Globals, private router: Router, private paginationService: PaginationService) {
    globals.section = Section.Cover;
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  async transliterationSelected(trans: string) {
    const previousTransliteration = this.globals.transliteration;

    // tslint:disable-next-line:triple-equals

    // tslint:disable-next-line:triple-equals
    if (trans == 'हिन्दी') {
      this.globals.transliteration = Transliteration.Hindi;
    } else if (trans === 'اُردو') {
      this.globals.transliteration = Transliteration.Urdu;
    } else if (trans === 'Latin') {
      this.globals.transliteration = Transliteration.Latin;
    }


    if (this.globals.transliteration !== previousTransliteration) {
      // tslint:disable-next-line:max-line-length
      await this.router.navigate(['/song/' + Transliteration[this.globals.transliteration].toString() + '/' + this.globals.urlKey], {});
    }
  }

  async homeSelected() {
    if (this.selectorComponent !== undefined) {
      this.selectorComponent.eraseContent();
    }
    this.paginationService.pagination = null;
    this.globals.section = Section.Cover;
    if (this.globals.orderSongsBy != null) {
      await this.router.navigate(['/sort/' + this.globals.orderSongsBy.toString()]);
    } else {
      await this.router.navigate(['/']);
    }
  }

  async allTagsSelected() {
    this.globals.section = Section.AllTags;
    // this.globals.transliteration = null;
    await this.router.navigate(['/all-tags'], {});
  }


  getVersion(): string {
    return 'Version ' + environment.buildNumber;
  }

  async orderSongsBySelected(orderSongsBy: string) {
    const urlElements = UrlUtils.extractElements(this.globals.lastCoverUrl);
    if (urlElements.tag != null) {
      await this.router.navigate(['/tag/' + urlElements.tag + '/sort/' + orderSongsBy]);
    } else {
      await this.router.navigate(['/sort/' + orderSongsBy]);
    }
    // $('#drawer').close();
  }


}
