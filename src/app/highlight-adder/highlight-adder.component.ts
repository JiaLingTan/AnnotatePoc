import { Component, Renderer2 } from '@angular/core';
import { HighlightService } from '../highlight-service/highlight.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-highlight-adder',
  templateUrl: './highlight-adder.component.html',
  styleUrls: ['./highlight-adder.component.css'],
})
export class HighlightAdderComponent {
  constructor(
    private highlightService: HighlightService,
    private renderer: Renderer2,
    private dialog: MatDialog,
  ) {}

  doHighlight() {
    const highlightAdder = document.getElementById('adder');
    this.renderer.setStyle(highlightAdder, 'visibility', 'hidden');

    this.highlightService.doHighlight();
  }

  doComment() {
    const highlightAdder = document.getElementById('adder');
    this.renderer.setStyle(highlightAdder, 'visibility', 'hidden');
    const iframe = document.getElementById('iframe') as HTMLIFrameElement;
    const iframeBody = iframe.contentDocument.body;
    const selection = iframeBody.ownerDocument.defaultView.getSelection();
    const range = selection.getRangeAt(0);
    this.createCommentIcon(range);

    this.dialog.open(CommentDialogComponent);
  }

  createCommentIcon(range: Range) {
    const icon = this.renderer.createElement('mat-icon');

    var span = document.createElement('span');
    span.insertAdjacentElement('beforeend', icon);

    range.endContainer.parentNode.appendChild(span);
  }
}
