import {
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Globals} from '../../services/globals.service';
import {Transliteration} from '../../models/Transliteration';
import {SongSelector} from '../../models/SongSelector';

@Component({
    selector: 'app-song-selector-item',
    templateUrl: './song-selector-item.component.html',
    styleUrls: ['./song-selector-item.component.scss']
})
export class SongSelectorItemComponent implements OnInit {

    @Input() songSelectorItem: SongSelector;
    public imageUrl: string;
    @Input() public selectorIndex: number;



    constructor(private ref: ElementRef,  private globals: Globals) {
    }

    public transliterationAsString(): string {
       if (this.songSelectorItem.transliteration !== undefined) {
         return Transliteration[this.songSelectorItem.transliteration];
       } else if (this.globals.transliteration != null) {
           return Transliteration[this.globals.transliteration];
       } else {
           return Transliteration[Transliteration.Hindi];
       }
    }

    async ngOnInit() {
        this.imageUrl = environment.imageServer + '/video-thumbnails/' + this.songSelectorItem.urlKey + environment.jpegExtension;
    }

}
