
export class Pagination {

  hasPrevious: boolean;

  hasNext: boolean;

  /**
   * visible plages with their numbers
   */
  pages: number[];

  /**
   * Visible pages' sizes
   */
  pageSizes: number[];

  /**
   * 0-based starting, in relation to the array of pages
   */
  activePageIndex: number;

  /**
   * 0- based element index (of all elements) in which the first page of the paginator starts
   */
  absolutePageStart: number;

  /**
   * 0- based element index (of all elements) in which the last page ends
   */
  absolutePageEnd: number;


  itemCount: number;

  constructor() {
    this.pages = [];
    this.pageSizes = [];
  }

  toString() {
    return 'hasPrevious=' + this.hasPrevious + ' hasNext=' + this.hasNext + ' pages=' + this.pages + ' pageSizes=' + this.pageSizes
      + ' activePageIndex=' + this.activePageIndex + ' absolutePageStart=' + this.absolutePageStart + ' itemCount=' + this.itemCount;
  }

}
