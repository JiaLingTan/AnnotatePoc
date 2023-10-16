import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, scan, Subject, tap } from 'rxjs';
import * as url from 'url';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  highlightedTextSub$ = new Subject<string>();
  highlightedText$: Observable<string[]>;

  constructor() {
    this.highlightedText$ = this.highlightedTextSub$
      .asObservable()
      .pipe(scan((acc, val) => acc.concat(val), []));
  }

  getHighlightedText() {
    return this.highlightedText$;
  }

  textHighlighter(element: HTMLElement) {
    if (!element) {
      throw 'Missing anchor element';
    }

    const el = element;
    // const options = defaults({}, {
    //   color: '#ffff7b',
    //   highlightedClass: 'highlighted',
    //   contextClass: 'highlighter-context',
    //   onRemoveHighlight: function () { return true; },
    //   onBeforeHighlight: function () { return true; },
    //   onAfterHighlight: function () { }
    // });

    dom(el).addClass('highlighter-context');
    //this.bindEvents(el);
  }

  // bindEvents(el: HTMLElement) {
  //   el.addEventListener('mouseup', (evt) => this.doHighlight(el));
  // }

  doHighlight() {
    const iframe = document.getElementById('iframe') as HTMLIFrameElement;
    const iframeBody = iframe.contentDocument.body;

    const el = iframeBody;
    dom(el).addClass('highlighter-context');
    const range = dom(el).getRange();

    //const timestamp = new Date();
    const wrapper = this.createWrapper();
    //wrapper.setAttribute('data-timestamp', timestamp.toString());
    this.performSave({
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
      selectedText: range.toString(),
    });

    const createdHighlights = this.highlightRange(range, wrapper, el);
    // normalizedHighlights = this.normalizeHighlights(createdHighlights);
    //
    // this.options.onAfterHighlight(range, normalizedHighlights, timestamp);
  }

  performSave(offset?: {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
    selectedText: string;
  }) {
    const serializedRange = {
      ...offset,
      nodeHTML: offset.startContainer.parentElement.innerHTML,
      nodeTagName: offset.startContainer.parentElement.tagName,
    };

    const serializedRangeArray =
      JSON.parse(localStorage.getItem('annotate')) || [];
    serializedRangeArray.push(serializedRange);

    localStorage.setItem('annotate', JSON.stringify(serializedRangeArray));
  }

  buildRange(startOffset, endOffset, nodeData, nodeHTML, nodeTagName, iframe) {
    var tagList = iframe.body.getElementsByTagName(nodeTagName);

    // find the parent element with the same innerHTML
    for (var i = 0; i < tagList.length; i++) {
      if (tagList[i].innerHTML == nodeHTML) {
        var foundEle = tagList[i];
      }
    }

    // find the node within the element by comparing node data
    var nodeList = foundEle?.childNodes;
    for (var i = 0; i < nodeList.length; i++) {
      if (nodeList[i].textContent.toString().indexOf(nodeData) !== -1) {
        var foundNode = nodeList[i];
      }
    }

    // create the range
    var range = iframe.createRange();
    range.setStart(foundNode, startOffset);
    range.setEnd(foundNode, endOffset);

    return range;
  }

  createWrapper() {
    var span = document.createElement('span');
    span.style.backgroundColor = '#ffff7b';
    span.className = 'highlighter-context';
    return span;
  }

  highlightRange(range: Range, wrapper: HTMLSpanElement, el: HTMLElement) {
    if (!range || range.collapsed) {
      return [];
    }

    var result = this.refineRangeBoundaries(range),
      endContainer = range.endContainer,
      goDeeper = result.goDeeper,
      done = false,
      node = range.startContainer,
      highlights = [],
      highlight,
      wrapperClone,
      nodeParent;

    do {
      if (goDeeper && node.nodeType === 3 && node === endContainer) {
        wrapperClone = wrapper.cloneNode(true);
        wrapperClone.setAttribute('data-highlighted', true);
        nodeParent = node.parentNode;

        // highlight if a node is inside the el
        if (dom(el).contains(nodeParent) || nodeParent === el) {
          this.highlightedTextSub$.next(node.textContent);
          highlight = dom(node).wrap(wrapperClone);
          //highlights.push(highlight);
        }

        goDeeper = false;
      }

      if (
        node === endContainer &&
        !(endContainer.hasChildNodes() && goDeeper)
      ) {
        done = true;
      }

      if (
        node &&
        [
          'SCRIPT',
          'STYLE',
          'SELECT',
          'OPTION',
          'BUTTON',
          'OBJECT',
          'APPLET',
          'VIDEO',
          'AUDIO',
          'CANVAS',
          'EMBED',
          'PARAM',
          'METER',
          'PROGRESS',
        ].indexOf('TEXT') > -1
      ) {
        if (endContainer.parentNode === node) {
          done = true;
        }
        goDeeper = false;
      }

      if (goDeeper && node.hasChildNodes()) {
        node = node.firstChild;
      } else if (node.nextSibling) {
        node = node.nextSibling;
        goDeeper = true;
      } else {
        node = node?.parentNode;
        goDeeper = false;
      }
    } while (!done);

    return highlights;
  }

  refineRangeBoundaries(range: Range) {
    var startContainer = range.startContainer as any,
      endContainer = range.endContainer as any,
      ancestor = range.commonAncestorContainer,
      goDeeper = true;

    if (range.endOffset === 0) {
      while (
        !endContainer.previousSibling &&
        endContainer.parentNode !== ancestor
      ) {
        endContainer = endContainer.parentNode;
      }
      endContainer = endContainer.previousSibling;
      //3 = Text node
    } else if (endContainer.nodeType === 3) {
      if (range.endOffset < endContainer.nodeValue.length) {
        endContainer.splitText(range.endOffset);
      }
    }

    if (startContainer.nodeType === 3) {
      if (range.startOffset === startContainer.nodeValue.length) {
        goDeeper = false;
      } else if (range.startOffset > 0) {
        startContainer = startContainer.splitText(range.startOffset);
        if (endContainer === startContainer.previousSibling) {
          endContainer = startContainer;
        }
      }
    } else if (range.startOffset < startContainer.childNodes.length) {
      startContainer = startContainer.childNodes.item(range.startOffset);
    } else {
      startContainer = startContainer?.nextSibling;
    }

    return {
      startContainer: startContainer,
      endContainer: endContainer,
      goDeeper: goDeeper,
    };
  }
}

const dom = (el: HTMLElement | Node) => ({
  addClass: (className: string) => {
    if ((el as HTMLElement).classList) {
      (el as HTMLElement).classList.add(className);
    } else {
      //el.className += ' ' + className;
    }
  },
  getRange: function () {
    const selection = dom(el).getWindow().getSelection();

    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return undefined;
  },
  getWindow: function () {
    return el.ownerDocument.defaultView;
  },
  contains: function (child) {
    return el !== child && el.contains(child);
  },
  wrap: function (wrapper: Node) {
    if (el.parentNode) {
      el.parentNode.insertBefore(wrapper, el);
    }

    wrapper.appendChild(el);
    return wrapper;
  },
});
