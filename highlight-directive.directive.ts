import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  map,
  Observable,
  ReplaySubject,
  scan,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Text } from '@angular/compiler';
import { HighlightService } from './src/highlight-service/highlight.service';

@Directive({
  selector: '[appHighlightDirective]',
})
export class HighlightDirectiveDirective implements AfterViewInit {
  $iframeClick: ReplaySubject<MouseEvent> = new ReplaySubject<MouseEvent>(1);
  activeSource: string | undefined;
  iframeDocument: Document | null;
  iframeBody: HTMLElement;

  private eventListeners: Array<any> = [];

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private highlightService: HighlightService,
  ) {}

  ngAfterViewInit(): void {
    const iframe = document.getElementById('iframe') as HTMLIFrameElement;

    fromEvent(iframe, 'load').subscribe(() => {
      this.activeSource = iframe?.contentWindow?.location.href;
      this.iframeDocument = iframe?.contentDocument;
      const iframeBody = this.iframeDocument?.body;

      const deserializedRange = JSON.parse(localStorage.getItem('annotate'));

      if (deserializedRange && deserializedRange.length > 0) {
        deserializedRange.forEach((element) => {
          const newRange = this.highlightService.buildRange(
            element.startOffset,
            element.endOffset,
            element.selectedText,
            element.nodeHTML,
            element.nodeTagName,
            this.iframeDocument,
          );

          const iframe = document.getElementById('iframe') as HTMLIFrameElement;
          const iframeBody = iframe.contentDocument.body;

          const el = iframeBody;
          if ((el as HTMLElement).classList) {
            (el as HTMLElement).classList.add('highlighter-context');
          }

          //const timestamp = new Date();
          const wrapper = this.highlightService.createWrapper();
          // wrapper.setAttribute('data-timestamp', timestamp.toString());

          this.highlightService.highlightRange(newRange, wrapper, el);
        });
      }

      if (iframeBody) {
        // const hltr = this.highlightService.textHighlighter(iframeBody);
        iframeBody.addEventListener('mouseup', (evt: MouseEvent) => {
          const highlightAdder = document.getElementById('adder');
          this.renderer.setStyle(highlightAdder, 'visibility', 'hidden');

          if (iframe?.contentWindow?.document?.getSelection()?.toString()) {
            this.renderer.setStyle(highlightAdder, 'top', `${evt.clientY}px`);
            this.renderer.setStyle(highlightAdder, 'left', `${evt.clientX}px`);
            this.renderer.setStyle(highlightAdder, 'visibility', 'visible');
          }
        });
      }
    });
  }
}
