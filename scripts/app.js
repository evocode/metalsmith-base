import DOMUtil from './util/dom';
import Functions from './functions';

DOMUtil.ready(function() {
  // Load the function based on the body tag data-function=""
  var func = DOMUtil.getFunctionName(document.body.attributes);
  if (func !== undefined && Functions[func] !== undefined) {
    Functions[func]();
  }
});
