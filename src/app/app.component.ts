import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightService } from './highlight-service/highlight.service';
import { Observable } from 'rxjs';

import { doHighlight } from './java-custom-highlighting.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AnnotatePoc';
  dummyURL: any;
  highlightedText$: Observable<string[]>;
  constructor(
    private sanitizer: DomSanitizer,
    private highlightedService: HighlightService,
  ) {}

  ngOnInit(): void {
    this.dummyURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      './assets/first-page.html',
    );
    this.highlightedText$ = this.highlightedService.highlightedText$;
  }

  performHighlight() {
    doHighlight();
  }
}
