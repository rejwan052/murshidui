import { Injectable } from '@angular/core';
import {IEnum} from '../models/IEnum';
import {Transliteration} from '../models/Transliteration';
import {Section} from '../models/Section';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {ActivatedRoute} from '@angular/router';
import {Tag} from '../models/Tag';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Globals {
  partsOfSpeech: IEnum;
  accidenceTypes: IEnum;
  transliteration: Transliteration;
  urlKey: string;
  section: Section;
  orderSongsBy: OrderSongsBy;
  /**
   * The size in items of each song listing page
   */
  pageSize = 10;

  /**
   * the maximum number of page links to display in the paginator
   */
  maxPagesDisplayed = 5;

  shiftLowerBound = 2;
  shiftUpperBound = 4;

  currentPage: number;

  lastCoverUrl: ActivatedRoute;
  /**
   * 1-based, corresponding to what is shown in the paginator
   */
  lastCoverPage: Number;
  lastTag: Tag;
  lastTagKey: string;

}

