export function doHighlight() {
  console.log("inin");
  const parentNode = document.getElementById("foo").firstChild;

  if (!CSS.highlights) {
    console.log("highlight not supported");
  }

  console.log("parent Node", parentNode);

  //  Create a couple of ranges.
  // const range1 = new Range();
  // range1.setStart(parentNode, 2);
  // range1.setEnd(parentNode, 5);
  //
  // const range2 = new Range();
  // range2.setStart(parentNode, 10);
  // range2.setEnd(parentNode, 12);

  const selection = document.getSelection();
  const range1 = selection.getRangeAt(0);

  // Create a custom highlight for these ranges.
  console.log("range", range1);
  const highlight = new Highlight(range1);

  console.log("highlight", highlight);

  // Register the ranges in the HighlightRegistry.
  CSS.highlights.set("my-custom-highlight", highlight);
}

export function doSelectionHighlight() {
  console.log("doSelectionHighlight");
  const iframe = document.getElementById("iframe");
  const iframeBody = iframe.contentDocument.body;
  const selection = iframeBody.ownerDocument.defaultView.getSelection();
  const range1 = selection.getRangeAt(0);

  if (!CSS.highlights) {
    console.log("highlight not supported");
  }

  // Create a custom highlight for these ranges.
  console.log("range", range1);
  const highlight = new Highlight(range1);

  console.log("highlight", highlight);

  // Register the ranges in the HighlightRegistry.
  CSS.highlights.set("my-custom-highlight", highlight);
  console.log(CSS.highlights);
}
