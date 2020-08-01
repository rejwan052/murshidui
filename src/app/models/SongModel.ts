import {InflectedLine} from './InflectedLine';
import {MasterLine} from './MasterLine';
import {ParagraphBlock} from './ParagraphBlock';
import {Transliteration} from './Transliteration';
import {Tag} from './Tag';

export class SongModel {
  plainHtml: string;
  paragraphBlocks: ParagraphBlock[];
  bollyName: string;
  urlKey: string;
  hindiTitle: string;
  urduTitle: string;
  inflectedLines: InflectedLine[];
  masterLineItems: MasterLine[];
  videoUrl: string;
  imageUrl: string;
  metaDescription: string;
  description: string;
  transliteration: Transliteration;
  tags: Tag[];
}
