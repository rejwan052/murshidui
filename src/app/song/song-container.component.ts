import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';

import {SongsService} from '../services/songs.service';
import {Transliteration} from '../models/Transliteration';
import {Section} from '../models/Section';
import {ActivatedRoute, Router} from '@angular/router';
import {SongModel} from '../models/SongModel';
import {isPlatformBrowser} from '@angular/common';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ParagraphBlock} from '../models/ParagraphBlock';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {Globals} from '../services/globals.service';
import {DictionaryDefinitionComponent} from './dictionary-definition/dictionary-definition.component';
import {EnumUtils} from '../models/EnumUtils';
import {environment} from '../../environments/environment';

declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
    selector: '[app-songcontainer]',
    templateUrl: './song-container.component.html',
    styleUrls: ['./song-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongContainerComponent implements OnInit, OnDestroy {

    private sub: any;
    public script: Transliteration;
    private urlKey: string;
    public songModel: SongModel;
    public videoId;
    private player;
    private ytEvent;
    public isBrowser;
    public showNastaliqOption = false;
    public nastaliqCalligraphy: boolean;
    public paragraphBlocks: ParagraphBlock[];
    // private deployed;
    public languageParagraphDir: string;
    public languageParagraphClass: string;
    public languagePunctuationClass: string;
    // the first time, the video doesn't seekTo() correctly
    // so cueVideo(... with a start seconds) has to be used instead
    private clickedOnce: boolean;
    public plainTextLink: string;

    playerVars = {
        cc_lang_pref: 'en'
    };


    constructor(private route: ActivatedRoute, private router: Router, private songsService: SongsService, private elementRef: ElementRef,
                private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId, private changeDetector: ChangeDetectorRef,
                private title: Title, private meta: Meta, private globals: Globals, public dialog: MatDialog,
                private _sanitizer: DomSanitizer
                ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.clickedOnce = false;
    }

    async ngOnInit() {
        this.globals.section = Section.Song;
        let attributeSelector  = 'name="description"';
        this.meta.removeTag(attributeSelector);
        attributeSelector  = 'name="og:image"';
        this.meta.removeTag(attributeSelector);

        this.sub = this.route.params.subscribe(params => {
            if (params.script !== undefined) {
              this.script = EnumUtils.transliterationFromString( params.script);
            } else {
              this.script = Transliteration.Hindi;
            }
            this.urlKey = params.urlKey;
            this.globals.urlKey = this.urlKey;
            this.globals.transliteration = this.script;
            this.songModel = this.route.snapshot.data.songModel;
            if (this.songModel != null) {
                this.title.setTitle(this.buildTitle(this.songModel, this.script));
                this.meta.updateTag({ name: 'description', content: this.songModel.metaDescription});
                this.meta.updateTag({ name: 'og:image', content:  environment.imageServer + '/video-thumbnails/' + this.songModel.urlKey + environment.jpegExtension});
            }
            this.plainTextLink = '/song-lyrics/' + Transliteration[this.globals.transliteration].toString() + '/' + this.globals.urlKey;
            this.updateContainerContent();

        });


        this.changeDetector.detectChanges();

        // ngOnInit is executed twice, one onthe server, the other on the browser
        if (this.isBrowser) {
            fromEvent(window, 'resize')
                .pipe(debounceTime(500))
                .subscribe(() => this.onResize());
        }
    }

    buildTitle(songModel: SongModel, transliteration: Transliteration) {
      switch (transliteration) {
        case Transliteration.Hindi:
          return songModel.bollyName + ' Lyrics Hindi | ' + songModel.hindiTitle + ' lyrics';
        case Transliteration.Urdu:
          return songModel.bollyName + ' Lyrics Urdu | lyrics ' + songModel.urduTitle;
        default:
          return songModel.bollyName + ' Lyrics';
      }
    }

    openDialog(): void {
        const dialog = this.dialog.open(DictionaryDefinitionComponent, {
            width: '500px'
        });


    }

    timeClicked(evt: Event, paragraphBlock: ParagraphBlock) {
        evt.stopImmediatePropagation();
        const seconds = paragraphBlock.minutes.valueOf() * 60 + paragraphBlock.seconds.valueOf();
        if (this.player != null && this.isBrowser) {
          if (!this.clickedOnce) {
            this.player.cueVideoById(this.videoId, seconds);
            this.clickedOnce = true;
          } else {
            this.player.seekTo(seconds, true);
          }
          this.player.playVideo();
        }
    }

    pauseClicked(evt: Event) {
        evt.stopImmediatePropagation();
        if (this.player != null && this.isBrowser) {
            this.player.pauseVideo();
        }
    }


    changeTagItemStyle(evt: Event) {
        if (evt.type === 'mouseover') {
            $(evt.target).addClass('tag-item-hover');
        } else {
            $(evt.target).removeClass('tag-item-hover');
        }
    }

    async onResize() {
        this.updateContainerContent();
    }

    async updateContainerContent() {
        this.showNastaliqOption = (this.script === Transliteration.Urdu );
        this.nastaliqCalligraphy = this.showNastaliqOption;

        if (this.urlKey != null) {
            this.songModel = this.route.snapshot.data.songModel;
            // this.songModel = await this.songsService.retrieveSong(this.urlKey);
            if (this.songModel == null) {
                await this.router.navigateByUrl('/');
                return;
            }

            this.songsService.transliteration = this.script;
            this.songsService.populateInflectedGeo(this.songModel);
            this.songsService.populateNotInflectedGeo(this.songModel);
            this.videoId = this.songModel.videoUrl;

            // the first time, the player has not been loaded and the ID has to be set in savePlayer()
            // Subsequent times, the video ID is set by this code
            if (this.player != null && this.isBrowser) {
                this.player.cueVideoById(this.videoId);
            }

            // const paragraphBlocks: Node[] = this.elementRef.nativeElement.querySelectorAll('.paragraph-block');

            this.paragraphBlocks = this.songModel.paragraphBlocks;
            switch (this.script) {
                case Transliteration.Hindi:
                    this.languageParagraphDir = 'lrt';
                    this.languageParagraphClass = 'language-ltr-paragraph';
                    this.languagePunctuationClass = 'ltrPunctuationMark';
                    break;
                case Transliteration.Urdu:
                    this.languageParagraphDir = 'rtl';
                    this.languageParagraphClass = 'urdu-paragraph';
                    this.languagePunctuationClass = 'rtlPunctuationMark';
                    break;
                case Transliteration.Latin:
                    this.languageParagraphDir = 'lrt';
                    this.languageParagraphClass = 'language-ltr-paragraph';
                    this.languagePunctuationClass = 'ltrPunctuationMark';
                    break;
            }

            this.changeDetector.detectChanges();

            this.init();

        }
    }

    toggleNastaliq() {
        const songContainerText = this.elementRef.nativeElement.querySelector('#song-container-text');
        const allRelevant = songContainerText.querySelectorAll('.relevant');

        if (allRelevant.forEach) {
            if (this.nastaliqCalligraphy) {
                allRelevant.forEach(span => this.renderer.addClass(span, 'nastaliq'));
            } else {
                allRelevant.forEach(span => this.renderer.removeClass(span, 'nastaliq'));
            }

            this.songsService.useNastaliq = this.nastaliqCalligraphy;

        }

    }

    init() {
        const songContainerText = this.elementRef.nativeElement.querySelector('#song-container-text');
        const allRelevant = songContainerText.querySelectorAll('.relevant');

        this.toggleNastaliq();

        for (let index = 0; index < allRelevant.length; index++) {

            allRelevant[index].addEventListener('click', (evt: Event) => {
                evt.stopImmediatePropagation();
                const spanSelected = allRelevant[index];
                this.songsService.itemHoverChange.next(spanSelected.id);
                this.openDialog();
            });
        }

        if (isPlatformBrowser(this.platformId)) {
            const body = $('body');
            if (body.width() < 1000) {
                body.find('.english-paragraph').hide();
            } else {
                body.find('.english-paragraph').show();
            }
        }


    }

    lessThan100Width() {
      return $('body').width() <= 1000;
    }

    toggleVisibilityLanguagePanel(evt: Event) {
        if (!this.lessThan100Width()) {
            return;
        }

        evt.stopImmediatePropagation();

        let elementClicked = $(evt.target);

        if (elementClicked.hasClass('paragraph-line')) {
            elementClicked = elementClicked.parent();
        }

        if (elementClicked.hasClass('language-ltr-paragraph') || elementClicked.hasClass('urdu-paragraph')) {
            const language = elementClicked;
            const translation = $(language).siblings().first();

            $(language).fadeToggle(150, () => {
                // $(translation).find('span').show();
                $(translation).show();
                $(translation).children().show();
            });
        }

        if (elementClicked.hasClass('english-paragraph') ) {
            const translation =  elementClicked;
            const language = $(translation).siblings().first();


            $(translation).fadeToggle(150, () => {
                $(language).show();
            });
        }


        this.changeDetector.markForCheck();
    }

    navigateToPlain() {
      this.router.navigate([this.plainTextLink], {});
    }

    ngOnDestroy() {
      // in tests, sub might be null
      if (this.sub != null) {
        this.sub.unsubscribe();
      }
    }

    onStateChange(event) {
        this.ytEvent = event.data;
    }

    savePlayer(player) {
        this.player = player;
        this.player.cueVideoById(this.videoId);
    }

}
