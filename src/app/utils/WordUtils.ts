import {Scripts} from '../models/Scripts';

export class WordUtils {
  public static scriptType(word: string): Scripts {

    let first: number;
    let firstChar: string;
    if (word.charAt(0) === '\'') {
      first = word.charCodeAt(1);
      firstChar = word.charAt(1);
    } else {
      first = word.charCodeAt(0);
      firstChar = word.charAt(0);
    }

    if (first === 8237) {
      first = word.charCodeAt(1);
      firstChar = word.charAt(1);
    }

    if (first >= 2305 && first <= 2416) {
      return Scripts.DEVANAGARI;
    } else if ((first < 1536 || first > 1791) && (first < 1872 || first > 1919) && (first < 2208 || first > 2303) && (firstChar < 'ﹰ' || firstChar > '\ufeff')) {
      return first >= 2560 && first <= 2687 ? Scripts.GURMUKHI : Scripts.LATIN;
    } else {
      return Scripts.NASTALIQ;
    }
  }
}
