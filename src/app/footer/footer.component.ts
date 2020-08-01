import {Component, ElementRef, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  ngOnInit() {}

}
