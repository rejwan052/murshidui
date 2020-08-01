import {Component, OnInit} from '@angular/core';
import {SongsService} from '../services/songs.service';
import {SongSelector} from '../models/SongSelector';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Transliteration} from '../models/Transliteration';
import {Section} from '../models/Section';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {Globals} from '../services/globals.service';
import {UrlUtils} from '../utils/UrlUtils';
import {PaginationService} from '../services/pagination.service';
import {TagsService} from '../services/tags.service';
import {environment} from '../../environments/environment';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';
import {UrlElements} from '../models/UrlElements';

@Component({
  // tslint:disable-next-line:component-selector
    selector: '[app-cover]',
    templateUrl: './cover.component.html',
    styleUrls: ['./cover.component.scss']
})
export class CoverComponent implements OnInit {

    public songSelectors: SongSelector[];

    private newCount: boolean;

    public tagTitle: string;
    public tagDescription: string;

    public isTag: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    constructor(private paginationService: PaginationService, private route: ActivatedRoute, private router: Router, private songsService: SongsService,
                private globals: Globals, private tagsService: TagsService,
                public breakpointObserver: BreakpointObserver, private title: Title, private meta: Meta) {

        this.route.url.subscribe((s: UrlSegment[]) => {
            const urlElements =  UrlUtils.extractElements(this.route);
            const valid1 = (this.globals.lastTagKey || 'valid');
            const valid2 = (urlElements.tag || 'valid');
            // page === undefined happens, for example, when we change the song sorting
            this.newCount =  (valid1 !==  valid2)  || (valid1 === 'valid' && paginationService.pagination == null) || urlElements.page === undefined;

            this.globals.lastCoverPage = urlElements.page;
            this.globals.orderSongsBy = urlElements.sort ||  OrderSongsBy.post;
            this.globals.lastCoverUrl = this.route;

            this.manageTags(urlElements);
        });
    }

    manageTags(urlElements: UrlElements) {
      this.isTag = (urlElements.tag !== null && urlElements.tag !== undefined);
      if (!this.isTag) {
        this.populateSelectors();
        return;
      }

      this.tagsService.getTag(urlElements.tag).then(
        tag => {
          this.globals.lastTag = tag;
          this.tagTitle = this.globals.lastTag.title;
          this.title.setTitle(this.tagTitle);

          this.meta.updateTag({name: 'description', content: this.globals.lastTag.description});
          this.tagDescription = this.globals.lastTag.description;
          this.populateSelectors();

        }
      );

    }



  ngOnInit() {
    this.globals.section = Section.Cover;
  }

  populateSelectors() {
    let page = 0;
    if (this.globals.lastCoverPage != null) {
      page = this.globals.lastCoverPage.valueOf() - 1;
    }
    let orderSongsBy = OrderSongsBy.post;
    if (this.globals.orderSongsBy) {
      orderSongsBy = this.globals.orderSongsBy;
    }

    if (this.newCount) {
      if (this.isTag) {
        this.songsService.retrieveSelectorsWithTagCount(this.globals.lastTag.key).then(count => {
          if (count.uiVersion !== environment.buildNumber) {
            // window.location.reload();
          }
          const pagination = this.paginationService.start(count.count);
          this.paginationService.paginationChange.next(pagination);
          this.songsService.retrieveSelectorsWithTag(this.globals.lastTag.key, orderSongsBy, page).then(songs => {
            this.songSelectors = songs;
          });
        });

      } else { // url without tag
        this.songsService.retrieveSelectorsCount().then(count => {
          if (count.uiVersion !== environment.buildNumber) {
            // window.location.reload(true);
          }
          const pagination = this.paginationService.start(count.count);
          this.paginationService.paginationChange.next(pagination);
          this.songsService.retrieveAllSelectorsInitial(orderSongsBy, page).then(songs => {
            this.songSelectors = songs;
          });
        });
      }
    } else {
      if (this.isTag) {
        this.songsService.retrieveSelectorsWithTag(this.globals.lastTag.key, orderSongsBy, page).then(songs => {
          this.songSelectors = songs;
        });

      } else { // url without tag
          this.songsService.retrieveAllSelectorsInitial(orderSongsBy, page).then(songs => {
          this.songSelectors = songs;
        });
      }
    }
  }

    pagerPageClicked(event) {
        const page = Number.parseInt(event.toString());
        const urlElements = UrlUtils.extractElements(this.route);
        this.paginationService.pagination = this.paginationService.forcePageSelection(this.paginationService.pagination, page);
        urlElements.page = page;
        const url = UrlUtils.reconstruct(urlElements);
        this.router.navigateByUrl(url);
    }

    pagerNextClicked(event) {
        const urlElements = UrlUtils.extractElements(this.route);
        const pagination = this.paginationService.actionNext(this.paginationService.pagination);
        // const pagination = this.paginationService.pagination;
        urlElements.page = pagination.pages[pagination.activePageIndex];
        const url = UrlUtils.reconstruct(urlElements);
        this.paginationService.paginationChange.next(pagination);
        this.router.navigateByUrl(url);
    }

    pagerPreviousClicked(event) {
        const urlElements = UrlUtils.extractElements(this.route);
        const pagination = this.paginationService.actionPrevious(this.paginationService.pagination);
        // const pagination = this.paginationService.pagination;
        urlElements.page = pagination.pages[pagination.activePageIndex];
        const url = UrlUtils.reconstruct(urlElements);
        this.paginationService.paginationChange.next(pagination);
        this.router.navigateByUrl(url);
    }

    applyTransliteration(selectors: SongSelector[], transliteration: Transliteration) {
        selectors.forEach(sel => sel.transliteration =  transliteration);
    }

}
