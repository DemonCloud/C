import VIEW from '../constant/view.define';
import ERRORS from '../constant/errors.define';

import defined from '../utils/defined';
import { requestIdleCallback } from '../utils/view/requestIdleCallback';
import { on, off, emit, registerEvent } from '../utils/universalEvent';
import { bindDomEvent, removeDomEvent, triggerEmitDomEvent } from '../utils/view/domEventSystem';
import { registerDOOMPlugin, renderDOOM, destroyDOOM } from '../utils/view/doom';
import polyfillimeInputEvent from '../utils/view/polyfillimeInputEvent';
import {
  _idt,
  _map,
  _axt,
  _axtc,
  _ayc,
  _lock,
  _extend,
  _eachArray,
  _eachObject,
  _fireEvent,
  _some,
  _slice,
  _isFn,
  _isString,
  _isArray,
  _isPlainObject,
  _isObject,
  _isDOM,
  _isArrayLike,
  _clone,
  _toString,
  _hasEvent,
  _trim,
  _cool,
  _noop,
  eventSplit,
  eventNameSpace,
} from '../utils/usestruct';

let vid = 0;
const prefix = "cubec-";

// cubec Template engine
function checkElm(el) {
  if (!(_isDOM(el) || _isArrayLike(el)))
    throw new TypeError('el must be typeof DOMElement or NodeList collections -> not ' + el);
  return true;
}

function completeFixedTemplate(stencil, name) {
  // create cubec root, make template easy to use
  return `<cubec id="${prefix}${name}">${stencil||''}</cubec>`;
}

const view = function(options = {}) {
  let id = vid++;

  let parentProps = {};
  let renderData = {};
  let renderIntime = false;

  const name = options.name || "v--"+id;
  const bounder = {};
  const usePlugins = {}; // { pluginName: pluginView }
  const useSlot = {}; // { slotName:  slotView }
  const useSlotRecycler = {};  // { slotName: slotRecycler }

  // create refs;
  this.refs = {};
  this.directRender = false;

  defined(this, {
    name : name,
    prefix : ("#"+ prefix + name + " "),
    _vid : id,
    _asb : v => (v===_idt ? bounder : {}),
    _asp : v => (v===_idt ? parentProps : {}),
    _aspu : v => (v===_idt ? usePlugins : {}),
    _assu : v => (v===_idt ? useSlot : {}),
    _assr : v => (v===_idt ? useSlotRecycler : {}),
    _assp : (v, newProps) => {
      if(v === _idt && newProps && _isPlainObject(newProps))
        parentProps = _lock(newProps);
    }
  });

  options = _extend(_clone(VIEW.DEFAULT_OPTION), options || _idt);

  // define property
  let props = _lock(_extend({}, _isPlainObject(options.props) ? options.props : {})),
      slots = _isPlainObject(options.slot) ? options.slot : {},
      vroot = options.root,
      render,
      events = options.events,
      plugins = _isPlainObject(options.plugin) ? options.plugin : {},
      connect = options.connect,
      stencil = options.template || options.render,
      models = _isArray(connect) ? connect
        : (connect instanceof view.__instance[0] || connect instanceof view.__instance[1]) ? [connect]
        : [];

  // format slots as cubecView
  _eachObject(slots, function(viewExtend, key){
    if(viewExtend._isExtender && viewExtend.constructor === view.constructor)
      useSlot[key] = viewExtend();
    if(viewExtend instanceof view || _isFn(viewExtend))
      useSlot[key] = viewExtend;
  });

  // create self plugins
  _eachObject(plugins, function(pluginOptions, pluginName){
    view.createGlobalPlugin(pluginName, pluginOptions, usePlugins);
  });

  // console.log(connect);
  stencil = _toString(_isFn(stencil) ? stencil(props) : stencil);

  // parse template
  // building the render function
  stencil = (options.cache ? _axtc : _axt)(
    completeFixedTemplate(_trim(stencil), name, this._vid),
    { view: this }
  );

  // defined view renderToString
  // switchTemplate function
  defined(this, {

    renderToString: function(data){
      if (data instanceof view.__instance[0]) data = data.get();
      // atom data format
      else if (data instanceof view.__instance[1]) data = data.toChunk();
      // console.log(stencil);
      return stencil.call(this, data || {});
    },

    switchTemplate: function(newRender){
      let switchRender = newRender;

      if(_isFn(switchRender))
        switchRender = _toString(switchRender(this.props));

      if(switchRender && _isString(switchRender))
        stencil = (options.cache ? _axtc : _axt)(
          completeFixedTemplate(_trim(switchRender), name, this._vid),
          { view: this }
        );
      else
        console.warn(ERRORS.VIEW_SWITCHTEMPLATE, newRender);
    }
  });

  render = function(data){
    // model data format
    if (data instanceof view.__instance[0]) data = data.get();
    // atom data format
    else if (data instanceof view.__instance[1]) data = data.toChunk();

    // before render hook
    // check if should prevent render
    const before = _fireEvent(this, 'beforeRender', [data]);

    if(before && before.length && _some(before, v=>!v)) return false;

    // render frame process
    // async render process
    if(renderIntime){
      renderData = data;
      return true;
    }

    renderIntime = true;
    renderData = data;

    // async render
    // directRender without virtual node render
    const createRender = function(){
      try{
        const renderString = this.renderToString(renderData);

        // use render to string
        if(this.directRender)
          this.root.innerHTML = renderString;
        // use renderDOOM
        else
          renderDOOM(this.root, renderString, this, renderData);

        this.root._vid = this._vid;

        // emit complete render and write vid
        this.emit("completeRender", [renderData, this._vid],);

        renderIntime = false;
      }catch(e){
        console.error(ERRORS.VIEW_RENDER, e, renderData);

        renderIntime = false;

        if(!_hasEvent(this,"catch")) throw e;
        else this.emit("catch", [renderData]);
      }
    }.bind(this);

    // do render
    _ayc(createRender);

    return true;
  }.bind(this);

  // if useOptions has more events
  if (vroot && checkElm(vroot)) {
    // bind events
    this.root = vroot;
    this.mount = _noop;

    _eachObject(events, registerEvent, this);

    defined(this, { render: render });

    this.connect.apply(this, models);
  } else {
    // spec with "init" event
    if(events && events.init){
      this.on("init", events.init);
      delete events.init;
    }

    // create mount method
    this.mount = function(el, data={}) {
      if (checkElm(el)) {
        // create Root Element
        this.root = vroot = el;

        // bind events
        _eachObject(events, registerEvent, this);

        defined(this, { render: render });

        this.connect.apply(this, models);

        // trigger render
        if(data&&_isObject(data)) this.render(data);

        // delete mount
        delete this.mount;
      } else {
        console.error(ERRORS.VIEW_MOUNT, data);
      }

      return this;
    };
  }

  // create view complete
  _extend(this, options, VIEW.IGNORE_KEYWORDS).emit('init').off('init');
};

view.prototype = {

  constructor: view,

  on(type, fn) {
    if (_isFn(fn)) {
      _eachArray(_toString(type).split(eventSplit), function(mk) {
        let param = mk.split(eventNameSpace);

        // DOM Element events
        if (param.length === 2) {
          // console.log(this.prefix+param[1]);
          // hack for input
          if (param[0] === 'input')
            polyfillimeInputEvent(this, param[1], fn);
          else
            bindDomEvent(this, param[0], param[1], fn);
        } else {
          on.call(this, mk, fn);
        }
      }, this);
    }

    return this;
  },

  off(type, fn) {

    if (type && _isString(type)) {
      _eachArray(type.split(eventSplit), function(mk) {
        let param = mk.split(eventNameSpace);

        if (param.length === 2)
          removeDomEvent(this, param[0], param[1], fn);
        else
          off.call(this, mk, fn);
      },this);

      return this;
    }

    removeDomEvent(off.call(this));

    return this;
  },

  emit(type, args) {
    let fixType = _toString(type);
    let emitKey = fixType.split(eventNameSpace);

    if (emitKey.length === 2) {
      _eachArray(fixType.split(eventSplit), function(mk) {
        let param = mk.split(eventNameSpace);
        triggerEmitDomEvent(this, param[0], param[1], args);
      },this);
      return this;
    }

    return emit.call(this, fixType, args);
  },

  connect() {
    let items = _isArray(arguments[0]) ? arguments[0] : _slice(arguments);
    let bounder = this._asb(_idt);

    if (items.length) {
      _eachArray(items, item => {
        if ((
          item instanceof view.__instance[0] ||
          item instanceof view.__instance[1]) &&
          item._mid != null) {
          if (!bounder[item._mid]) {
            bounder[item._mid] = item;
            on.call(item, 'change', this.render);
          }
        }
      });
    }

    return this;
  },

  disconnect() {
    let items = _isArray(arguments[0]) ? arguments[0] : _slice(arguments);
    let bounder = this._asb(_idt);

    if (items.length) {
      _eachArray(items, item => {
        if ((
          item instanceof view.__instance[0] ||
          item instanceof view.__instance[1]) &&
          item._mid != null ) {
          if (bounder[item._mid]) {
            delete bounder[item._mid];
            off.call(item, 'change', this.render);
          }
        }
      });
    }

    return this;
  },

  getParentProps(name){
    const parentProps = this._asp(_idt);
    let target = parentProps;

    if(name && _isString(name))
      target = parentProps[name] || {};

    return _lock(_extend({}, target));
  },

  destroy(withRemoveRoot=false) {
    if(this.root){
      this.emit('beforeDestroy');
      // remove event
      removeDomEvent(this);
      // disconnet model
      _eachObject(this._asb(_idt), item=>this.disconnect(item));

      _eachObject(this._assr(_idt), function(recycler){
        try { requestIdleCallback(recycler); } catch(e) { /**/ }
      });
      // destroy DOOM html elements
      destroyDOOM(this.root, this, withRemoveRoot);

      this.emit('destroy');

      return this;
    }
  },

};

//include instance [model, atom]
view.__instance = [_noop, _noop];

// create Global Plugin
view.createGlobalPlugin = registerDOOMPlugin;
// create View Self Plugin
view.createPlugin = function(pugOptions){
  return _isPlainObject(pugOptions) ? pugOptions : {};
};
// create Slot view
view.createSlot = function(options={}){
  const slotOptions = _isPlainObject(options) ? options : {};

  if(slotOptions.root)
    delete slotOptions.root;
  if(!slotOptions.name)
    slotOptions.name = "_slot-"+(vid++);
  if(!slotOptions.slotWillAcceptChange || _isFn(slotOptions.slotWillAcceptChange))
    slotOptions.slotWillAcceptChange = _cool;

  return view.extend(slotOptions);
};

export default view;

