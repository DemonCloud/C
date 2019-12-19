import $ from '../../lib/jquery';
import { idSign, empty } from '../usestruct';

let _iid = 1;
const ime = {};

function compositionIn(e) {
  if(e.data && e.data.iid){
    ime[e.data.iid] = true;
  }
}

function compositionOut(e) {
  if(e.data && e.data.iid){
    ime[e.data.iid]= false;
    $(e.target).trigger('input');
  }
}

function capCursor(elm) {
  let pos = 0;

  if (elm.selectionStart != null) pos = elm.selectionStart;
  // IE Support
  else if (document.selection) {
    elm.focus();

    let sel = document.selection.createRange();
    sel.moveStart('character', -elm.value.length);
    // The caret position is selection length
    pos = sel.text.length;
  }

  return pos;
}

function setCursor(elm, pos) {
  if (elm.createTextRange) {
    let range = elm.createTextRange();
    range.move('character', pos);
    return range.select();
  }

  return elm.selectionStart
    ? elm.setSelectionRange(pos, pos, elm.focus())
    : elm.focus();
}

const polyfillimeInputEvent = function(view, delegateSelector, callback){
  let pid = _iid++;
  let pida = { iid: pid };

  let pfn = function(e){

    if(ime[pid]) return false;

    if(e.target && e.target.focus) e.target.focus();

    let pos = capCursor(e.target);

    callback.apply(this, arguments);

    if (pos) setCursor(e.target, pos);

  }.bind(this);

  callback._fn = pfn;

  $(view.root).
    on('compositionstart', pida, compositionIn).
    on('compositionend', pida, compositionOut).
    on('input', (delegateSelector[0] === idSign ? empty : view.prefix)+delegateSelector, pfn);
};

export default polyfillimeInputEvent;
