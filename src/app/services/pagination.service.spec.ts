import { PaginationService } from './pagination.service';

import {Globals} from './globals.service';
import {Pagination} from '../models/Pagination';


describe('PaginationService', () => {
  let service: PaginationService;
  beforeEach(() => {
    const globals = new Globals();
    globals.pageSize = 10;
    globals.maxPagesDisplayed = 5;
    service = new PaginationService(globals);
  });


  it('start should return pagination with 3 pages no next and full lastPageItems ', () => {
    const expected = new Pagination();
    expected.itemCount = 30;
    expected.hasPrevious = false;
    expected.hasNext = false;
    expected.activePageIndex = 0;
    expected.absolutePageStart = 0;
    expected.absolutePageEnd = 29;
    expected.pages = [1, 2, 3];
    expected.pageSizes = [10, 10, 10];

    const actual = service.start(30);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });

  it('shiftLeft should show a new full page, with next', () => {

    const input = new Pagination();
    input.itemCount = 70;
    input.hasPrevious = false;
    input.hasNext = true;
    input.activePageIndex = 3;
    input.absolutePageStart = 0;
    input.absolutePageEnd = 49;
    input.pages = [1, 2, 3, 4, 5];
    input.pageSizes = [10, 10, 10, 10, 10];


    const expected = new Pagination();
    expected.itemCount = 70;
    expected.hasPrevious = true;
    expected.hasNext = true;
    expected.activePageIndex = 3;
    expected.absolutePageStart = 10;
    expected.absolutePageEnd = 59;
    expected.pages = [2, 3, 4, 5, 6];
    expected.pageSizes = [10, 10, 10, 10, 10];

    const actual = service.shiftLeftWithSelectionInPlace(input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });

  it('shiftLeft should show a new full page, without next', () => {

    const input = new Pagination();
    input.itemCount = 60;
    input.hasPrevious = false;
    input.hasNext = true;
    input.activePageIndex = 4;
    input.absolutePageStart = 0;
    input.absolutePageEnd = 49;
    input.pages = [1, 2, 3, 4, 5];
    input.pageSizes = [10, 10, 10, 10, 10];


    const expected = new Pagination();
    expected.itemCount = 60;
    expected.hasPrevious = true;
    expected.hasNext = false;
    expected.activePageIndex = 4;
    expected.absolutePageStart = 10;
    expected.absolutePageEnd = 59;
    expected.pages = [2, 3, 4, 5, 6];
    expected.pageSizes = [10, 10, 10, 10, 10];

    console.log('test in question');
    const actual = service.shiftLeftWithSelectionInPlace(input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });

  it('shiftLeft should show a new rump page', () => {

    const input = new Pagination();
    input.itemCount = 57;
    input.hasPrevious = false;
    input.hasNext = true;
    input.activePageIndex = 3;
    input.absolutePageStart = 0;
    input.absolutePageEnd = 49;
    input.pages = [1, 2, 3, 4, 5];
    input.pageSizes = [10, 10, 10, 10, 10];


    const expected = new Pagination();
    expected.itemCount = 57;
    expected.hasPrevious = true;
    expected.hasNext = true;
    expected.activePageIndex = 3;
    expected.absolutePageStart = 10;
    expected.absolutePageEnd = 56;
    expected.pages = [2, 3, 4, 5, 6];
    expected.pageSizes = [10, 10, 10, 10, 7];

    const actual = service.shiftLeftWithSelectionInPlace(input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });


  it('shiftRight should show previous', () => {

    const input = new Pagination();
    input.itemCount = 80;
    input.hasPrevious = true;
    input.hasNext = true;
    input.activePageIndex = 1;
    input.absolutePageStart = 20;
    input.absolutePageEnd = 69;
    input.pages = [3, 4, 5, 6, 7];
    input.pageSizes = [10, 10, 10, 10, 10];


    const expected = new Pagination();
    expected.itemCount = 80;
    expected.hasPrevious = true;
    expected.hasNext = true;
    expected.activePageIndex = 1;
    expected.absolutePageStart = 10;
    expected.absolutePageEnd = 59;
    expected.pages = [2, 3, 4, 5, 6];
    expected.pageSizes = [10, 10, 10, 10, 10];

    const actual = service.shiftRightWithSelectionInPlace(input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });

  it('shiftRight should show not previous', () => {

    const input = new Pagination();
    input.itemCount = 80;
    input.hasPrevious = true;
    input.hasNext = true;
    input.activePageIndex = 0;
    input.absolutePageStart = 10;
    input.absolutePageEnd = 59;
    input.pages = [2, 3, 4, 5, 6];
    input.pageSizes = [10, 10, 10, 10, 10];


    const expected = new Pagination();
    expected.itemCount = 80;
    expected.hasPrevious = false;
    expected.hasNext = true;
    expected.activePageIndex = 0;
    expected.absolutePageStart = 0;
    expected.absolutePageEnd = 49;
    expected.pages = [1, 2, 3, 4, 5];
    expected.pageSizes = [10, 10, 10, 10, 10];
    const actual = service.shiftRightWithSelectionInPlace(input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });

  it('start should return pagination with 3 pages no next and rump lastPageItems ', () => {

    const expected = new Pagination();
    expected.itemCount = 26;
    expected.hasPrevious = false;
    expected.hasNext = false;
    expected.activePageIndex = 0;
    expected.absolutePageStart = 0;
    expected.absolutePageEnd = 25;
    expected.pages = [1, 2, 3];
    expected.pageSizes = [10, 10, 6];

    const actual = service.start(26);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });

  it('start should return pagination with 5 pages and next ', () => {

    const expected = new Pagination();
    expected.itemCount = 61;
    expected.hasPrevious = false;
    expected.hasNext = true;
    expected.activePageIndex = 0;
    expected.absolutePageStart = 0;
    expected.absolutePageEnd = 49;
    expected.pages = [1, 2, 3, 4, 5];
    expected.pageSizes = [10, 10, 10, 10, 10];

    const actual = service.start(61);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });


  it('click inside should return the same pagination with different active index ', () => {

    const input = new Pagination();
    input.itemCount = 100;
    input.hasPrevious = false;
    input.hasNext = true;
    input.activePageIndex = 0;
    input.absolutePageStart = 0;
    input.absolutePageEnd = 49;
    input.pages = [1, 2, 3, 4];
    input.pageSizes = [10, 10, 10, 10];

    const expected = new Pagination();
    expected.itemCount = 100;
    expected.hasPrevious = false;
    expected.hasNext = true;
    expected.activePageIndex = 3;
    expected.absolutePageStart = 0;
    expected.absolutePageEnd = 49;
    expected.pages = [1, 2, 3, 4];
    input.pageSizes = [10, 10, 10, 10];

    const actual = service.clickInside( 4, input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });

  it('click inside should throw exception because the number doesn\'t exist', () => {

    const input = new Pagination();
    input.itemCount = 100;
    input.hasPrevious = false;
    input.hasNext = true;
    input.activePageIndex = 0;
    input.absolutePageStart = 0;
    input.absolutePageEnd = 39;
    input.pages = [1, 2, 3, 4];
    input.pageSizes = [10, 10, 10, 10];

    // exception testing needs this "function" thing
    expect(() => {service.clickInside(5, input); } ).toThrow(new Error('the pageNumber 5 was expected to be in the pages array 1,2,3,4'));
  });

  it('click next should return change selected page but not shift', () => {

    const input = new Pagination();
    input.itemCount = 500;
    input.hasPrevious = true;
    input.hasNext = true;
    input.activePageIndex = 1;
    input.absolutePageStart = 50;
    input.absolutePageEnd = 99;
    input.pages = [6, 7, 8, 9, 10];
    input.pageSizes = [10, 10, 10, 10, 10];

    const expected = new Pagination();
    expected.itemCount = 500;
    expected.hasPrevious = true;
    expected.hasNext = true;
    expected.activePageIndex = 2;
    expected.absolutePageStart = 50;
    expected.absolutePageEnd = 99;
    expected.pages = [6, 7, 8, 9, 10];
    expected.pageSizes = [10, 10, 10, 10, 10];

    const actual = service.actionNext( input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });

  it('click next should return unshifted pagination with advanced selection ', () => {

    const input = new Pagination();
    input.itemCount = 100;
    input.hasPrevious = true;
    input.hasNext = false;
    input.activePageIndex = 4;
    input.absolutePageStart = 50;
    input.absolutePageEnd = 99;
    input.pages = [6, 7, 8, 9, 10];
    input.pageSizes = [10, 10, 10, 10, 10];

    const expected = new Pagination();
    expected.itemCount = 100;
    expected.hasPrevious = true;
    expected.hasNext = false;
    expected.activePageIndex = 5;
    expected.absolutePageStart = 50;
    expected.absolutePageEnd = 99;
    expected.pages = [6, 7, 8, 9, 10];
    expected.pageSizes = [10, 10, 10, 10, 10];

    const actual = service.actionNext( input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());

    expect(expectedSorted).toEqual(actualSorted) ;

  });


  it('click previous should return shifted pagination ', () => {

    const input = new Pagination();
    input.itemCount = 500;
    input.hasPrevious = true;
    input.hasNext = true;
    input.activePageIndex = 4;
    input.absolutePageStart = 100;
    input.absolutePageEnd = 149;
    input.pages = [11, 12, 13, 14, 15];
    input.pageSizes = [10, 10, 10, 10, 10];

    const expected = new Pagination();
    expected.itemCount = 500;
    expected.hasPrevious = true;
    expected.hasNext = true;
    expected.activePageIndex = 4;
    expected.absolutePageStart = 90;
    expected.absolutePageEnd = 139;
    expected.pages = [10, 11, 12, 13, 14];
    expected.pageSizes = [10, 10, 10, 10, 10];

    const actual = service.actionPrevious( input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());
    expect(expectedSorted).toEqual(actualSorted) ;
  });

  it('click previous should return unshifted pagination ', () => {

    const input = new Pagination();
    input.itemCount = 500;
    input.hasPrevious = true;
    input.hasNext = true;
    input.activePageIndex = 1;
    input.absolutePageStart = 100;
    input.absolutePageEnd = 149;
    input.pages = [11, 12, 13, 14, 15];
    input.pageSizes = [10, 10, 10, 10, 10];

    const expected = new Pagination();
    expected.itemCount = 500;
    expected.hasPrevious = true;
    expected.hasNext = true;
    expected.activePageIndex = 0;
    expected.absolutePageStart = 100;
    expected.absolutePageEnd = 149;
    expected.pages = [11, 12, 13, 14, 15];
    expected.pageSizes = [10, 10, 10, 10, 10];

    const actual = service.actionPrevious( input);
    const actualSorted = JSON.stringify(actual, Object.keys(actual).sort());
    const expectedSorted = JSON.stringify(expected, Object.keys(expected).sort());
    expect(expectedSorted).toEqual(actualSorted) ;
  });


});
