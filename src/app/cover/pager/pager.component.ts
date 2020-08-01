import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { Subscription } from 'rxjs';
import {PaginationService} from '../../services/pagination.service';
import {Pagination} from '../../models/Pagination';
import {Globals} from '../../services/globals.service';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit, OnDestroy {


  public pagination: Pagination;
  private subscription: Subscription;

  @Output()
  pageClick: EventEmitter<any> = new EventEmitter();

  @Output()
  nextClick: EventEmitter<any> = new EventEmitter();

  @Output()
  previousClick: EventEmitter<any> = new EventEmitter();

  constructor(private globals: Globals, private paginationService: PaginationService) {
    this.subscription = this.paginationService.paginationChange.subscribe(message => {
      this.pagination = message;
      this.ngOnInit();
    });
  }

  shouldGrayPage(page: number) {
    const activeIndex = this.pagination.activePageIndex;
    const activePage = this.pagination.pages[activeIndex];
    return page === activePage;
  }

  ngOnInit() {
    this.pagination = this.paginationService.pagination;
  }

  pageClicked(page: number) {
    this.pageClick.emit(page);
  }

  nextClicked() {
    this.nextClick.emit();
  }

  previousClicked() {
    this.previousClick.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
