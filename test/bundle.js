(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Component = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// var h = require('hyperscript');
// var Component = require('./../src/component.js');

// var List = require('./nesting/nesting.js');

var _require = require('./../src/component-snabb.js');

var Component = _require.Component;
var h = _require.h;
var helpers = _require.helpers;
var div = helpers.div;
var span = helpers.span;
var a = helpers.a;
var hr = helpers.hr;

var thunk = require('./store.js').thunk;
var changeExample = require('./reducer-app.js').changeExample;
var App = Component.create({
    init: function init() {
        this.componentName = 'app';
    },
    componentDidMount: function componentDidMount() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function () {
            this.update(store.getState().examples);
        }.bind(this));
    },

    render: function render(compose) {
        return div('#app', [span('Choose:'), a({
            on: { click: thunk({ type: 'CHANGE_EXAMPLE', example: 'home' }) }
        }, ' Home'), a({
            on: { click: thunk(changeExample, 'counters') }
        }, ' Counters'), a({
            onclick: thunk(changeExample, 'list')
        }, ' List'), a({
            on: { click: thunk(changeExample, 'form') }
        }, ' Form'), hr(''), this.chooseExamples(compose)]);
    },

    chooseExamples: function chooseExamples() {
        var state = Component.store.getState();

        switch (this.props.example) {
            case 'counters':
                var Counters = require('./counter-list/counter-list.js');
                return h(Counters, { props: state.counters });
            // case 'list':
            //     return compose(List, state.list);
            case 'home':
                return h('div', 'Home');
            case 'form':
                var Form = require('./form/form.js');
                return h(Form, { props: state.form });
            default:
                return h('div', 'nothing');
        }
    }
});

module.exports = App;

},{"./../src/component-snabb.js":215,"./counter-list/counter-list.js":3,"./form/form.js":7,"./reducer-app.js":10,"./store.js":11}],2:[function(require,module,exports){
/**
 * Actions for counter list component
 */
'use strict';

var actionsTypes = require('./reducer-counter-list.js').actionTypes;

exports.addCounter = function (store) {
    store.dispatch({
        type: actionsTypes.ADD_COUNTER
    });
};
exports.resetCounter = function (store) {
    store.dispatch({
        type: actionsTypes.RESET_COUNTER
    });
};
exports.removeCounter = function (store, id) {
    store.dispatch({
        type: actionsTypes.REMOVE_COUNTER,
        id: id
    });
};
exports.incrementCounter = function (store, id) {
    store.dispatch({
        type: actionsTypes.INCREMENT_COUNTER,
        id: id
    });
};
exports.decrementCounter = function (store, id) {
    store.dispatch({
        type: actionsTypes.DECREMENT_COUNTER,
        id: id
    });
};

},{"./reducer-counter-list.js":5}],3:[function(require,module,exports){
'use strict';

// var h = require('hyperscript');
// var Component = require('./../../src/component.js');

var _require = require('./../../src/component-snabb.js');

var Component = _require.Component;
var h = _require.h;
var reuse = _require.reuse;

var thunk = require('./../store.js').thunk;

var Counter = require('./counter.js');
var actions = require('./actions.js');

var counterList = Component.create({
    init: function init() {
        this.componentName = 'counters';
    },
    componentDidMount: function componentDidMount() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function () {
            // console.log('update counters');
            this.update(store.getState().counters);
        }.bind(this));
    },

    componentWillUnmount: function componentWillUnmount() {
        this.unsubscribe();
    },

    render: function render(compose) {
        return h('div#counters', [h('button', { on: { click: thunk(actions.addCounter) } }, 'Add'), h('button', { on: { click: thunk(actions.resetCounter) } }, 'Reset'), h('hr'), h('div.counter-list', this.props.counters.map(function (item) {
            return this.counterItemView(compose, item);
        }.bind(this)))]);
    },

    counterItemView: function counterItemView(compose, item) {
        return h('div.counter-item', [h('button.remove', {
            on: { click: thunk(actions.removeCounter, item.id) }
        }, 'Remove'), reuse('counter' + item.id, Counter, item, {
            onIncrement: thunk(actions.incrementCounter, item.id),
            onDecrement: thunk(actions.decrementCounter, item.id)
        }), h('hr')]);
    }
});

module.exports = counterList;

},{"./../../src/component-snabb.js":215,"./../store.js":11,"./actions.js":2,"./counter.js":4}],4:[function(require,module,exports){
'use strict';

// var Component = require('./../../src/component.js');
// var h = require('hyperscript');

var _require = require('./../../src/component-snabb.js');

var Component = _require.Component;
var h = _require.h;
var reuse = _require.reuse;

var Counter = Component.create({
    render: function render(props, handlers) {
        return h('div#' + this.cid, [h('p', this.props.id + ' ' + this.cid), h('button', { on: { click: handlers.onIncrement } }, '+'), h('button', { on: { click: handlers.onDecrement } }, '-'), h('div', 'Count: ' + this.props.counter)]);
    }
});

module.exports = Counter;

},{"./../../src/component-snabb.js":215}],5:[function(require,module,exports){
'use strict';

var actionTypes = exports.actionTypes = {
    ADD_COUNTER: 'ADD_COUNTER',
    RESET_COUNTER: 'RESET_COUNTER',
    REMOVE_COUNTER: 'REMOVE_COUNTER',
    INCREMENT_COUNTER: 'INCREMENT_COUNTER',
    DECREMENT_COUNTER: 'DECREMENT_COUNTER'
};

exports.reducer = function countersReducer(state, action) {
    if (typeof state === 'undefined') {
        state = {
            nextId: 1,
            counters: []
        };
    }
    switch (action.type) {
        case actionTypes.ADD_COUNTER:
            return Object.assign({}, state, {
                nextId: state.nextId + 1,
                counters: state.counters.concat({
                    counter: 0,
                    id: state.nextId
                })
            });
        case actionTypes.RESET_COUNTER:
            return Object.assign({}, state, {
                nextId: 1,
                counters: []
            });
        case actionTypes.REMOVE_COUNTER:
            return Object.assign({}, state, {
                counters: state.counters.filter(function (item) {
                    return item.id !== action.id;
                })
            });
        case actionTypes.INCREMENT_COUNTER:
            return Object.assign({}, state, {
                counters: state.counters.map(function (item) {
                    if (item.id !== action.id) {
                        return item;
                    }

                    return Object.assign({}, item, {
                        counter: item.counter + 1
                    });
                })
            });
        case actionTypes.DECREMENT_COUNTER:
            return Object.assign({}, state, {
                counters: state.counters.map(function (item) {
                    if (item.id !== action.id) {
                        return item;
                    }

                    return Object.assign({}, item, {
                        counter: item.counter - 1
                    });
                })
            });
        default:
            return state;
    }
};

},{}],6:[function(require,module,exports){
'use strict';

var ActionTypes = exports.actionsTypes = {
    VALIDATE_FORM: 'VALIDATE_FORM'
};
var t = require('tcomb-validation');
var validate = t.validate;

function mysubtype(type, getValidationErrorMessage, name) {
    var Subtype = t.subtype(type, function (x) {
        return !t.String.is(getValidationErrorMessage(x));
    }, name);

    Subtype.getValidationErrorMessage = getValidationErrorMessage;
    return Subtype;
}

var NameType = mysubtype(t.String, function (s) {
    if (!s) {
        return 'Required';
    }
    if (s.length >= 3) {
        return 'Too long my friend';
    }
});
var EmailType = mysubtype(t.String, function (s) {
    if (!s) {
        return 'Required';
    }
    if (s.length <= 4) {
        return 'Not an email!!';
    }
});

var Schema = t.struct({
    name: NameType,
    email: EmailType,
    age: t.Number
});
exports.validate = function (store, e) {
    e.preventDefault();
    var result = validate({
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: Number(document.getElementById('age').value.trim())
    }, Schema);

    store.dispatch({
        type: ActionTypes.VALIDATE_FORM,
        values: result
    });
};

exports.reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = {
            errors: [],
            values: {
                name: '',
                email: '',
                age: ''
            },
            message: ''
        };
    }
    switch (action.type) {
        case ActionTypes.VALIDATE_FORM:
            return Object.assign({}, state, {
                errors: action.values.errors,
                values: action.values.value
            });
        default:
            return state;
    }
};

},{"tcomb-validation":165}],7:[function(require,module,exports){
'use strict';

// var h = require('hyperscript');
// var Component = require('./../../src/component.js');

var _require = require('./../../src/component-snabb.js');

var Component = _require.Component;
var h = _require.h;

var store = require('./../store.js');
var find = require('lodash/find');
var thunk = store.thunk;
var validate = require('./form-reducer.js').validate;
var Form = Component.create({
    init: function init() {
        this.componentName = 'form';
    },
    componentDidMount: function componentDidMount() {
        var store = Component.store;

        this.unsubscribe = store.subscribe(function () {
            this.update(store.getState().form);
        }.bind(this));
    },
    componentWillUnmount: function componentWillUnmount() {
        this.unsubscribe();
    },
    render: function render() {
        var values = this.props.values;

        return h('form', {
            on: {
                change: thunk(validate),
                submit: thunk(validate)
            }
        }, [h('label', 'Name: '), h('input#name', { props: { type: 'text', value: values.name } }), this.renderErrors('name'), h('br'), h('label', 'Email: '), h('input#email', { props: { type: 'email', value: values.email } }), this.renderErrors('email'), h('br'), h('label', 'Age: '), h('input#age', { props: { type: 'text', value: values.age } }), this.renderErrors('age'), h('br'), h('input', { props: { type: 'submit' } }, 'Submit')]);
    },
    renderErrors: function renderErrors(id) {
        var error = find(this.props.errors, function (error) {
            return error.path[0] === id;
        });

        return h('span', error ? error.message : '');
    }
});

module.exports = Form;

},{"./../../src/component-snabb.js":215,"./../store.js":11,"./form-reducer.js":6,"lodash/find":119}],8:[function(require,module,exports){
'use strict';
// var h = require('./../src/hyperscript.js');
// var Component = require('./../src/component');

var _require = require('./../src/component-snabb.js');

var Component = _require.Component;
var mount = _require.mount;

var Store = require('./store.js').store;
var root = document.getElementById('root');
var App;
Component.store = Store;
Component.dispatch = Store.dispatch;

App = require('./app.js');
// root.appendChild(new App().mount(Store.getState().examples));

mount(root, App, Store.getState().examples);

},{"./../src/component-snabb.js":215,"./app.js":1,"./store.js":11}],9:[function(require,module,exports){
'use strict';

var actionTypes = exports.actionTypes = {
    INIT: '@@LIST_INIT',
    RESET: '@@LIST_RESET',
    INCREMENT: '@@LIST_INCREMENT'
};

exports.reducer = function (state, action) {
    var initialState = [];

    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        case actionTypes.INIT:
            if (state.length === 0) {
                return [{
                    id: 0,
                    count: 1
                }, {
                    id: 1,
                    count: 9999
                }];
            }
            return state;
        case actionTypes.RESET:
            return initialState;
        case actionTypes.INCREMENT:
            state.forEach(function (counter, index) {
                if (counter.id === action.id) {
                    state[index] = {
                        id: action.id,
                        count: counter.count + 1
                    };
                }
            });
            return state;
        default:
            return state;
    }
};

},{}],10:[function(require,module,exports){
'use strict';

var ActionTypes = exports.actionsTypes = {
    CHANGE_EXAMPLE: 'CHANGE_EXAMPLE'
};

exports.changeExample = function (store, example) {
    store.dispatch({
        type: ActionTypes.CHANGE_EXAMPLE,
        example: example
    });
};

exports.reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = {
            example: 'counters'
        };
    }
    switch (action.type) {
        case ActionTypes.CHANGE_EXAMPLE:
            if (action.example === state.example) {
                return state;
            }
            return Object.assign({}, state, {
                example: action.example
            });
        default:
            return state;
    }
};

},{}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var redux = require('redux');
var applyMiddleware = redux.applyMiddleware;
var combineReducers = redux.combineReducers;
var compose = redux.compose;
// var bindActionCreators = require('redux').bindActionCreators;
// var logger = require('redux-logger');

var logger = function logger(store) {
    var getState = store.getState;

    return function (next) {
        return function (action) {
            console.info('will dispatch', action);

            // Call the next dispatch method in the middleware chain.
            var returnValue = next(action);

            console.info('state after dispatch', getState());

            // This will likely be the action itself, unless
            // a middleware further in chain changed it.
            return returnValue;
        };
    };
};

// Reducers
var reducerApp = require('./reducer-app.js').reducer;
var reducerList = require('./nesting/reducer-nesting.js').reducer;
var reducerCounterList = require('./counter-list/reducer-counter-list.js').reducer;
var reducer = combineReducers({
    examples: reducerApp,
    counters: reducerCounterList,
    list: reducerList,
    form: require('./form/form-reducer.js').reducer
});

// Store
var store = redux.createStore(reducer, compose(applyMiddleware(logger), window.devToolsExtension ? window.devToolsExtension() : function (f) {
    return f;
}));

exports.store = store;
// exports.bind = function(creators) {
//     return bindActionCreators(creators, store.dispatch);
// };

/**
 * Creates a thunk for a action or actionCreator and partial applies the store
 * @param  {Object|Function} fn [description]
 * @return {[type]}      [description]
 */
exports.thunk = function (fn) {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);

    if (typeof fn === 'function') {
        return function () {
            return fn.apply(this, [store].concat(args.concat(slice.call(arguments, 0))));
        };
    }
    if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) !== 'object' || fn === null || typeof fn === 'undefined') {
        throw new Error('action expected an object or a function, instead received ' + (fn === 'null' ? 'null' : typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
    }

    if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object') {
        return function () {
            return store.dispatch(fn);
        };
    }
};

exports.action = function (fn) {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);

    if (typeof fn === 'function') {
        return function () {
            return fn.apply(this, args.concat(slice.call(arguments, 0)));
        };
    }
    if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) !== 'object' || fn === null || typeof fn === 'undefined') {
        throw new Error('action expected an object or a function, instead received ' + (fn === 'null' ? 'null' : typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
    }

    if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object') {
        return function () {
            return store.dispatch(fn);
        };
    }
};

},{"./counter-list/reducer-counter-list.js":5,"./form/form-reducer.js":6,"./nesting/reducer-nesting.js":9,"./reducer-app.js":10,"redux":153}],12:[function(require,module,exports){
'use strict';
// var Component = exports.component = require('./src/component');

exports.app = require('./examples/main.js');

},{"./examples/main.js":8}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var isValidString = function isValidString(param) {
  return typeof param === 'string' && param.length > 0;
};

var startsWith = function startsWith(string, start) {
  return string[0] === start;
};

var isSelector = function isSelector(param) {
  return isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'));
};

var node = function node(h) {
  return function (tagName) {
    return function (first) {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      if (isSelector(first)) {
        return h.apply(undefined, [tagName + first].concat(rest));
      } else {
        return h.apply(undefined, [tagName, first].concat(rest));
      }
    };
  };
};

var TAG_NAMES = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video', 'progress'];

exports['default'] = function (h) {
  var createTag = node(h);
  var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTag: createTag };
  TAG_NAMES.forEach(function (n) {
    exported[n] = createTag(n);
  });
  return exported;
};

module.exports = exports['default'];

},{}],14:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],15:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Creates an hash object.
 *
 * @private
 * @constructor
 * @returns {Object} Returns the new hash object.
 */
function Hash() {}

// Avoid inheriting from `Object.prototype` when possible.
Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;

module.exports = Hash;

},{"./_nativeCreate":105}],16:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":80,"./_root":107}],17:[function(require,module,exports){
var mapClear = require('./_mapClear'),
    mapDelete = require('./_mapDelete'),
    mapGet = require('./_mapGet'),
    mapHas = require('./_mapHas'),
    mapSet = require('./_mapSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function MapCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.clear();
  while (++index < length) {
    var entry = values[index];
    this.set(entry[0], entry[1]);
  }
}

// Add functions to the `MapCache`.
MapCache.prototype.clear = mapClear;
MapCache.prototype['delete'] = mapDelete;
MapCache.prototype.get = mapGet;
MapCache.prototype.has = mapHas;
MapCache.prototype.set = mapSet;

module.exports = MapCache;

},{"./_mapClear":99,"./_mapDelete":100,"./_mapGet":101,"./_mapHas":102,"./_mapSet":103}],18:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":80,"./_root":107}],19:[function(require,module,exports){
var stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function Stack(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.clear();
  while (++index < length) {
    var entry = values[index];
    this.set(entry[0], entry[1]);
  }
}

// Add functions to the `Stack` cache.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_stackClear":109,"./_stackDelete":110,"./_stackGet":111,"./_stackHas":112,"./_stackSet":113}],20:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":107}],21:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":107}],22:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":80,"./_root":107}],23:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `Map#set` because it doesn't return the map instance in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

},{}],24:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],25:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],26:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],27:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],28:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],29:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],30:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignValue;

},{"./eq":118}],31:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the associative array.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function assocDelete(array, key) {
  var index = assocIndexOf(array, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = array.length - 1;
  if (index == lastIndex) {
    array.pop();
  } else {
    splice.call(array, index, 1);
  }
  return true;
}

module.exports = assocDelete;

},{"./_assocIndexOf":34}],32:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the associative array value for `key`.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function assocGet(array, key) {
  var index = assocIndexOf(array, key);
  return index < 0 ? undefined : array[index][1];
}

module.exports = assocGet;

},{"./_assocIndexOf":34}],33:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if an associative array value for `key` exists.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function assocHas(array, key) {
  return assocIndexOf(array, key) > -1;
}

module.exports = assocHas;

},{"./_assocIndexOf":34}],34:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the first occurrence of `key` is found in `array`
 * of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":118}],35:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the associative array `key` to `value`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 */
function assocSet(array, key, value) {
  var index = assocIndexOf(array, key);
  if (index < 0) {
    array.push([key, value]);
  } else {
    array[index][1] = value;
  }
}

module.exports = assocSet;

},{"./_assocIndexOf":34}],36:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":69,"./keys":137}],37:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function baseCastPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

module.exports = baseCastPath;

},{"./_stringToPath":114,"./isArray":124}],38:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseForOwn = require('./_baseForOwn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[mapTag] = cloneableTags[numberTag] =
cloneableTags[objectTag] = cloneableTags[regexpTag] =
cloneableTags[setTag] = cloneableTags[stringTag] =
cloneableTags[symbolTag] = cloneableTags[uint8Tag] =
cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] =
cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        result = baseAssign(result, value);
        return isFull ? copySymbols(value, result) : result;
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return (isFull && !isArr) ? copySymbols(value, result) : result;
}

module.exports = baseClone;

},{"./_Stack":19,"./_arrayEach":26,"./_assignValue":30,"./_baseAssign":36,"./_baseForOwn":44,"./_cloneBuffer":62,"./_copyArray":68,"./_copySymbols":71,"./_getTag":82,"./_initCloneArray":89,"./_initCloneByTag":90,"./_initCloneObject":91,"./_isHostObject":92,"./isArray":124,"./isBuffer":127,"./isObject":131}],39:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

module.exports = baseCreate;

},{"./isObject":131}],40:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":44,"./_createBaseEach":73}],41:[function(require,module,exports){
/**
 * The base implementation of methods like `_.find` and `_.findKey`, without
 * support for iteratee shorthands, which iterates over `collection` using
 * `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],42:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],43:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":74}],44:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":43,"./keys":137}],45:[function(require,module,exports){
var baseCastPath = require('./_baseCastPath'),
    isKey = require('./_isKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path + ''] : baseCastPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_baseCastPath":37,"./_isKey":95}],46:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var getPrototypeOf = Object.getPrototypeOf;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return hasOwnProperty.call(object, key) ||
    (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
}

module.exports = baseHas;

},{}],47:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return key in Object(object);
}

module.exports = baseHasIn;

},{}],48:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":49,"./isObject":131,"./isObjectLike":132}],49:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isHostObject = require('./_isHostObject'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      stack || (stack = new Stack);
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":19,"./_equalArrays":75,"./_equalByTag":76,"./_equalObjects":77,"./_getTag":82,"./_isHostObject":92,"./isArray":124,"./isTypedArray":136}],50:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack,
          result = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;

      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":19,"./_baseIsEqual":48}],51:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  var type = typeof value;
  if (type == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (type == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":53,"./_baseMatchesProperty":54,"./identity":122,"./isArray":124,"./property":140}],52:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = Object.keys;

/**
 * The base implementation of `_.keys` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  return nativeKeys(Object(object));
}

module.exports = baseKeys;

},{}],53:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === value &&
        (value !== undefined || (key in Object(object)));
    };
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":50,"./_getMatchData":79}],54:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":48,"./get":120,"./hasIn":121}],55:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],56:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":45}],57:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],58:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],59:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
 * of key-value pairs for `object` corresponding to the property names of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the new array of key-value pairs.
 */
function baseToPairs(object, props) {
  return arrayMap(props, function(key) {
    return [key, object[key]];
  });
}

module.exports = baseToPairs;

},{"./_arrayMap":27}],60:[function(require,module,exports){
/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

module.exports = checkGlobal;

},{}],61:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":21}],62:[function(require,module,exports){
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{}],63:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map) {
  return arrayReduce(mapToArray(map), addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":23,"./_arrayReduce":28,"./_mapToArray":104}],64:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],65:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set) {
  return arrayReduce(setToArray(set), addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":24,"./_arrayReduce":28,"./_setToArray":108}],66:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":20}],67:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":61}],68:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],69:[function(require,module,exports){
var copyObjectWith = require('./_copyObjectWith');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object) {
  return copyObjectWith(source, props, object);
}

module.exports = copyObject;

},{"./_copyObjectWith":70}],70:[function(require,module,exports){
var assignValue = require('./_assignValue');

/**
 * This function is like `copyObject` except that it accepts a function to
 * customize copied values.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObjectWith(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : source[key];

    assignValue(object, key, newValue);
  }
  return object;
}

module.exports = copyObjectWith;

},{"./_assignValue":30}],71:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":69,"./_getSymbols":81}],72:[function(require,module,exports){
var isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return rest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = typeof customizer == 'function'
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_isIterateeCall":94,"./rest":141}],73:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":125}],74:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],75:[function(require,module,exports){
var arraySome = require('./_arraySome');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var index = -1,
      isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      isUnordered = bitmask & UNORDERED_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked) {
    return stacked == other;
  }
  var result = true;
  stack.set(array, other);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isUnordered) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack);
          })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  return result;
}

module.exports = equalArrays;

},{"./_arraySome":29}],76:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object) ? other != +other : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      // Recursively compare objects (susceptible to call stack limits).
      return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask | UNORDERED_COMPARE_FLAG, stack.set(object, other));

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":20,"./_Uint8Array":21,"./_equalArrays":75,"./_mapToArray":104,"./_setToArray":108}],77:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    keys = require('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : baseHas(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  return result;
}

module.exports = equalObjects;

},{"./_baseHas":46,"./keys":137}],78:[function(require,module,exports){
var baseProperty = require('./_baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./_baseProperty":55}],79:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    toPairs = require('./toPairs');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = toPairs(object),
      length = result.length;

  while (length--) {
    result[length][2] = isStrictComparable(result[length][1]);
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":98,"./toPairs":144}],80:[function(require,module,exports){
var isNative = require('./isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./isNative":130}],81:[function(require,module,exports){
/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = getOwnPropertySymbols || function() {
  return [];
};

module.exports = getSymbols;

},{}],82:[function(require,module,exports){
var Map = require('./_Map'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
var mapCtorString = Map ? funcToString.call(Map) : '',
    setCtorString = Set ? funcToString.call(Set) : '',
    weakMapCtorString = WeakMap ? funcToString.call(WeakMap) : '';

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
  return objectToString.call(value);
}

// Fallback for IE 11 providing `toStringTag` values for maps, sets, and weakmaps.
if ((Map && getTag(new Map) != mapTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : null,
        ctorString = typeof Ctor == 'function' ? funcToString.call(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case mapCtorString: return mapTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_Map":16,"./_Set":18,"./_WeakMap":22}],83:[function(require,module,exports){
var baseCastPath = require('./_baseCastPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    isString = require('./isString'),
    last = require('./last'),
    parent = require('./_parent');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  if (object == null) {
    return false;
  }
  var result = hasFunc(object, path);
  if (!result && !isKey(path)) {
    path = baseCastPath(path);
    object = parent(object, path);
    if (object != null) {
      path = last(path);
      result = hasFunc(object, path);
    }
  }
  var length = object ? object.length : undefined;
  return result || (
    !!length && isLength(length) && isIndex(path, length) &&
    (isArray(object) || isString(object) || isArguments(object))
  );
}

module.exports = hasPath;

},{"./_baseCastPath":37,"./_isIndex":93,"./_isKey":95,"./_parent":106,"./isArguments":123,"./isArray":124,"./isLength":129,"./isString":134,"./last":138}],84:[function(require,module,exports){
var hashHas = require('./_hashHas');

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(hash, key) {
  return hashHas(hash, key) && delete hash[key];
}

module.exports = hashDelete;

},{"./_hashHas":86}],85:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @param {Object} hash The hash to query.
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(hash, key) {
  if (nativeCreate) {
    var result = hash[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":105}],86:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @param {Object} hash The hash to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(hash, key) {
  return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
}

module.exports = hashHas;

},{"./_nativeCreate":105}],87:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 */
function hashSet(hash, key, value) {
  hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
}

module.exports = hashSet;

},{"./_nativeCreate":105}],88:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isLength = require('./isLength'),
    isString = require('./isString');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  if (isLength(length) &&
      (isArray(object) || isString(object) || isArguments(object))) {
    return baseTimes(length, String);
  }
  return null;
}

module.exports = indexKeys;

},{"./_baseTimes":58,"./isArguments":123,"./isArray":124,"./isLength":129,"./isString":134}],89:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],90:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":61,"./_cloneMap":63,"./_cloneRegExp":64,"./_cloneSet":65,"./_cloneSymbol":66,"./_cloneTypedArray":67}],91:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    isPrototype = require('./_isPrototype');

/** Built-in value references. */
var getPrototypeOf = Object.getPrototypeOf;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototypeOf(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":39,"./_isPrototype":97}],92:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],93:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],94:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./_isIndex":93,"./eq":118,"./isArrayLike":125,"./isObject":131}],95:[function(require,module,exports){
var isArray = require('./isArray');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (typeof value == 'number') {
    return true;
  }
  return !isArray(value) &&
    (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object)));
}

module.exports = isKey;

},{"./isArray":124}],96:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'number' || type == 'boolean' ||
    (type == 'string' && value != '__proto__') || value == null;
}

module.exports = isKeyable;

},{}],97:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],98:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":131}],99:[function(require,module,exports){
var Hash = require('./_Hash'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': Map ? new Map : [],
    'string': new Hash
  };
}

module.exports = mapClear;

},{"./_Hash":15,"./_Map":16}],100:[function(require,module,exports){
var Map = require('./_Map'),
    assocDelete = require('./_assocDelete'),
    hashDelete = require('./_hashDelete'),
    isKeyable = require('./_isKeyable');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapDelete(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map['delete'](key) : assocDelete(data.map, key);
}

module.exports = mapDelete;

},{"./_Map":16,"./_assocDelete":31,"./_hashDelete":84,"./_isKeyable":96}],101:[function(require,module,exports){
var Map = require('./_Map'),
    assocGet = require('./_assocGet'),
    hashGet = require('./_hashGet'),
    isKeyable = require('./_isKeyable');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapGet(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashGet(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map.get(key) : assocGet(data.map, key);
}

module.exports = mapGet;

},{"./_Map":16,"./_assocGet":32,"./_hashGet":85,"./_isKeyable":96}],102:[function(require,module,exports){
var Map = require('./_Map'),
    assocHas = require('./_assocHas'),
    hashHas = require('./_hashHas'),
    isKeyable = require('./_isKeyable');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapHas(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashHas(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map.has(key) : assocHas(data.map, key);
}

module.exports = mapHas;

},{"./_Map":16,"./_assocHas":33,"./_hashHas":86,"./_isKeyable":96}],103:[function(require,module,exports){
var Map = require('./_Map'),
    assocSet = require('./_assocSet'),
    hashSet = require('./_hashSet'),
    isKeyable = require('./_isKeyable');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache object.
 */
function mapSet(key, value) {
  var data = this.__data__;
  if (isKeyable(key)) {
    hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
  } else if (Map) {
    data.map.set(key, value);
  } else {
    assocSet(data.map, key, value);
  }
  return this;
}

module.exports = mapSet;

},{"./_Map":16,"./_assocSet":35,"./_hashSet":87,"./_isKeyable":96}],104:[function(require,module,exports){
/**
 * Converts `map` to an array.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the converted array.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],105:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":80}],106:[function(require,module,exports){
var baseSlice = require('./_baseSlice'),
    get = require('./get');

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length == 1 ? object : get(object, baseSlice(path, 0, -1));
}

module.exports = parent;

},{"./_baseSlice":57,"./get":120}],107:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./_checkGlobal":60}],108:[function(require,module,exports){
/**
 * Converts `set` to an array.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the converted array.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],109:[function(require,module,exports){
/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = { 'array': [], 'map': null };
}

module.exports = stackClear;

},{}],110:[function(require,module,exports){
var assocDelete = require('./_assocDelete');

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      array = data.array;

  return array ? assocDelete(array, key) : data.map['delete'](key);
}

module.exports = stackDelete;

},{"./_assocDelete":31}],111:[function(require,module,exports){
var assocGet = require('./_assocGet');

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  var data = this.__data__,
      array = data.array;

  return array ? assocGet(array, key) : data.map.get(key);
}

module.exports = stackGet;

},{"./_assocGet":32}],112:[function(require,module,exports){
var assocHas = require('./_assocHas');

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  var data = this.__data__,
      array = data.array;

  return array ? assocHas(array, key) : data.map.has(key);
}

module.exports = stackHas;

},{"./_assocHas":33}],113:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    assocSet = require('./_assocSet');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache object.
 */
function stackSet(key, value) {
  var data = this.__data__,
      array = data.array;

  if (array) {
    if (array.length < (LARGE_ARRAY_SIZE - 1)) {
      assocSet(array, key, value);
    } else {
      data.array = null;
      data.map = new MapCache(array);
    }
  }
  var map = data.map;
  if (map) {
    map.set(key, value);
  }
  return this;
}

module.exports = stackSet;

},{"./_MapCache":17,"./_assocSet":35}],114:[function(require,module,exports){
var toString = require('./toString');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
function stringToPath(string) {
  var result = [];
  toString(string).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = stringToPath;

},{"./toString":145}],115:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    isArrayLike = require('./isArrayLike'),
    isPrototype = require('./_isPrototype'),
    keys = require('./keys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * Assigns own enumerable properties of source objects to the destination
 * object. Source objects are applied from left to right. Subsequent sources
 * overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Foo() {
 *   this.c = 3;
 * }
 *
 * function Bar() {
 *   this.e = 5;
 * }
 *
 * Foo.prototype.d = 4;
 * Bar.prototype.f = 6;
 *
 * _.assign({ 'a': 1 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3, 'e': 5 }
 */
var assign = createAssigner(function(object, source) {
  if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;

},{"./_assignValue":30,"./_copyObject":69,"./_createAssigner":72,"./_isPrototype":97,"./isArrayLike":125,"./keys":137}],116:[function(require,module,exports){
var baseClone = require('./_baseClone');

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

module.exports = cloneDeep;

},{"./_baseClone":38}],117:[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],118:[function(require,module,exports){
/**
 * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],119:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    baseFind = require('./_baseFind'),
    baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three arguments:
 * (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @category Collection
 * @param {Array|Object} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
function find(collection, predicate) {
  predicate = baseIteratee(predicate, 3);
  if (isArray(collection)) {
    var index = baseFindIndex(collection, predicate);
    return index > -1 ? collection[index] : undefined;
  }
  return baseFind(collection, predicate, baseEach);
}

module.exports = find;

},{"./_baseEach":40,"./_baseFind":41,"./_baseFindIndex":42,"./_baseIteratee":51,"./isArray":124}],120:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined` the `defaultValue` is used in its place.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":45}],121:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b.c');
 * // => true
 *
 * _.hasIn(object, ['a', 'b', 'c']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":47,"./_hasPath":83}],122:[function(require,module,exports){
/**
 * This method returns the first argument given to it.
 *
 * @static
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],123:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

},{"./isArrayLikeObject":126}],124:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type {Function}
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],125:[function(require,module,exports){
var getLength = require('./_getLength'),
    isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./_getLength":78,"./isFunction":128,"./isLength":129}],126:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":125,"./isObjectLike":132}],127:[function(require,module,exports){
var constant = require('./constant'),
    root = require('./_root');

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = (freeModule && freeModule.exports === freeExports)
  ? freeExports
  : undefined;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = !Buffer ? constant(false) : function(value) {
  return value instanceof Buffer;
};

module.exports = isBuffer;

},{"./_root":107,"./constant":117}],128:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

},{"./isObject":131}],129:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],130:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

/** Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns). */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(funcToString.call(value));
  }
  return isObjectLike(value) &&
    (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
}

module.exports = isNative;

},{"./_isHostObject":92,"./isFunction":128,"./isObjectLike":132}],131:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],132:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],133:[function(require,module,exports){
var isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototypeOf = Object.getPrototypeOf;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  var Ctor = proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_isHostObject":92,"./isObjectLike":132}],134:[function(require,module,exports){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

},{"./isArray":124,"./isObjectLike":132}],135:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":132}],136:[function(require,module,exports){
var isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = isTypedArray;

},{"./isLength":129,"./isObjectLike":132}],137:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    baseKeys = require('./_baseKeys'),
    indexKeys = require('./_indexKeys'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  var isProto = isPrototype(object);
  if (!(isProto || isArrayLike(object))) {
    return baseKeys(object);
  }
  var indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if (baseHas(object, key) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"./_baseHas":46,"./_baseKeys":52,"./_indexKeys":88,"./_isIndex":93,"./_isPrototype":97,"./isArrayLike":125}],138:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],139:[function(require,module,exports){
/**
 * A no-operation function that returns `undefined` regardless of the
 * arguments it receives.
 *
 * @static
 * @memberOf _
 * @category Util
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

},{}],140:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":55,"./_basePropertyDeep":56,"./_isKey":95}],141:[function(require,module,exports){
var apply = require('./_apply'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, array);
      case 1: return func.call(this, args[0], array);
      case 2: return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

module.exports = rest;

},{"./_apply":25,"./toInteger":142}],142:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

module.exports = toInteger;

},{"./toNumber":143}],143:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isFunction":128,"./isObject":131}],144:[function(require,module,exports){
var baseToPairs = require('./_baseToPairs'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable key-value pairs for `object` which
 * can be consumed by `_.fromPairs`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.toPairs(new Foo);
 * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
 */
function toPairs(object) {
  return baseToPairs(object, keys(object));
}

module.exports = toPairs;

},{"./_baseToPairs":59,"./keys":137}],145:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (value == null) {
    return '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toString;

},{"./_Symbol":20,"./isSymbol":135}],146:[function(require,module,exports){
var toString = require('./toString');

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given the ID is appended to it.
 *
 * @static
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;

},{"./toString":145}],147:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MiniSignalBinding = (function () {
  function MiniSignalBinding(fn, once, thisArg) {
    if (once === undefined) once = false;

    _classCallCheck(this, MiniSignalBinding);

    this._fn = fn;
    this._once = once;
    this._thisArg = thisArg;
    this._next = this._prev = this._owner = null;
  }

  _createClass(MiniSignalBinding, [{
    key: 'detach',
    value: function detach() {
      if (this._owner === null) return false;
      this._owner.detach(this);
      return true;
    }
  }]);

  return MiniSignalBinding;
})();

function _addMiniSignalBinding(self, node) {
  if (!self._head) {
    self._head = node;
    self._tail = node;
  } else {
    self._tail._next = node;
    node._prev = self._tail;
    self._tail = node;
  }

  node._owner = self;

  return node;
}

var MiniSignal = (function () {
  function MiniSignal() {
    _classCallCheck(this, MiniSignal);

    this._head = this._tail = undefined;
  }

  _createClass(MiniSignal, [{
    key: 'handlers',
    value: function handlers() {
      var exists = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var node = this._head;

      if (exists) return !!node;

      var ee = [];

      while (node) {
        ee.push(node);
        node = node._next;
      }

      return ee;
    }
  }, {
    key: 'has',
    value: function has(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#has(): First arg must be a MiniSignalBinding object.');
      }

      return node._owner === this;
    }
  }, {
    key: 'dispatch',
    value: function dispatch() {
      var node = this._head;

      if (!node) return false;

      while (node) {
        if (node._once) this.detach(node);
        node._fn.apply(node._thisArg, arguments);
        node = node._next;
      }

      return true;
    }
  }, {
    key: 'add',
    value: function add(fn) {
      var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#add(): First arg must be a Function.');
      }
      return _addMiniSignalBinding(this, new MiniSignalBinding(fn, false, thisArg));
    }
  }, {
    key: 'once',
    value: function once(fn) {
      var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#once(): First arg must be a Function.');
      }
      return _addMiniSignalBinding(this, new MiniSignalBinding(fn, true, thisArg));
    }
  }, {
    key: 'detach',
    value: function detach(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#detach(): First arg must be a MiniSignalBinding object.');
      }
      if (node._owner !== this) return this;

      if (node._prev) node._prev._next = node._next;
      if (node._next) node._next._prev = node._prev;

      if (node === this._head) {
        this._head = node._next;
        if (node._next === null) {
          this._tail = null;
        }
      } else if (node === this._tail) {
        this._tail = node._prev;
        this._tail._next = null;
      }

      node._owner = null;
      return this;
    }
  }, {
    key: 'detachAll',
    value: function detachAll() {
      var node = this._head;
      if (!node) return this;

      this._head = this._tail = null;

      while (node) {
        node._owner = null;
        node = node._next;
      }
      return this;
    }
  }]);

  return MiniSignal;
})();

MiniSignal.MiniSignalBinding = MiniSignalBinding;

exports['default'] = MiniSignal;
module.exports = exports['default'];

},{}],148:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;
exports["default"] = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var store = createStore(reducer, initialState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":151}],149:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],150:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports["default"] = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2["default"])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key);
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
      if (warningMessage) {
        (0, _warning2["default"])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
}).call(this,require('_process'))

},{"./createStore":152,"./utils/warning":154,"_process":214,"lodash/isPlainObject":133}],151:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing functions from right to
 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
 */
function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function () {
    if (funcs.length === 0) {
      return arguments.length <= 0 ? undefined : arguments[0];
    }

    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1);

    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}
},{}],152:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports["default"] = createStore;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [initialState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, initialState, enhancer) {
  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, initialState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = initialState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all states changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2["default"])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  };
}
},{"lodash/isPlainObject":133}],153:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2["default"];
exports.combineReducers = _combineReducers2["default"];
exports.bindActionCreators = _bindActionCreators2["default"];
exports.applyMiddleware = _applyMiddleware2["default"];
exports.compose = _compose2["default"];
}).call(this,require('_process'))

},{"./applyMiddleware":148,"./bindActionCreators":149,"./combineReducers":150,"./compose":151,"./createStore":152,"./utils/warning":154,"_process":214}],154:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that you can use this stack
    // to find the callsite that caused this warning to fire.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],155:[function(require,module,exports){
var VNode = require('./vnode');
var is = require('./is');

function addNS(data, children) {
  data.ns = 'http://www.w3.org/2000/svg';
  if (children !== undefined) {
    for (var i = 0; i < children.length; ++i) {
      addNS(children[i].data, children[i].children);
    }
  }
}

module.exports = function h(sel, b, c) {
  var data = {}, children, text, i;
  if (arguments.length === 3) {
    data = b;
    if (is.array(c)) { children = c; }
    else if (is.primitive(c)) { text = c; }
  } else if (arguments.length === 2) {
    if (is.array(b)) { children = b; }
    else if (is.primitive(b)) { text = b; }
    else { data = b; }
  }
  if (is.array(children)) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i]);
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
    addNS(data, children);
  }
  return VNode(sel, data, children, text, undefined);
};

},{"./is":157,"./vnode":164}],156:[function(require,module,exports){
function createElement(tagName) {
    return document.createElement(tagName);
}

function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}

function createTextNode(text) {
    return document.createTextNode(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
    // console.log('parent', parentNode);
    // console.log('newnode', newNode);
    // console.log('referencenode', referenceNode);
    parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
    node.removeChild(child);
}

function appendChild(node, child) {
    node.appendChild(child);
}

function parentNode(node) {
    return node.parentElement;
}

function nextSibling(node) {
    return node.nextSibling;
}

function tagName(node) {
    return node.tagName;
}

function setTextContent(node, text) {
    node.textContent = text;
}

module.exports = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    appendChild: appendChild,
    removeChild: removeChild,
    insertBefore: insertBefore,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent
};

},{}],157:[function(require,module,exports){
module.exports = {
  array: Array.isArray,
  primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
};

},{}],158:[function(require,module,exports){
var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", 
                "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", 
                "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", 
                "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", 
                "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", 
                "truespeed", "typemustmatch", "visible"];
    
var booleanAttrsDict = {};
for(var i=0, len = booleanAttrs.length; i < len; i++) {
  booleanAttrsDict[booleanAttrs[i]] = true;
}
    
function updateAttrs(oldVnode, vnode) {
  var key, cur, old, elm = vnode.elm,
      oldAttrs = oldVnode.data.attrs || {}, attrs = vnode.data.attrs || {};
  
  // update modified attributes, add new attributes
  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      // TODO: add support to namespaced attributes (setAttributeNS)
      if(!cur && booleanAttrsDict[key])
        elm.removeAttribute(key);
      else
        elm.setAttribute(key, cur);
    }
  }
  //remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}

module.exports = {create: updateAttrs, update: updateAttrs};

},{}],159:[function(require,module,exports){
function updateClass(oldVnode, vnode) {
  var cur, name, elm = vnode.elm,
      oldClass = oldVnode.data.class || {},
      klass = vnode.data.class || {};
  for (name in oldClass) {
    if (!klass[name]) {
      elm.classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name);
    }
  }
}

module.exports = {create: updateClass, update: updateClass};

},{}],160:[function(require,module,exports){
var is = require('../is');

function arrInvoker(arr) {
  return function() {
    // Special case when length is two, for performance
    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1));
  };
}

function fnInvoker(o) {
  return function(ev) { o.fn(ev); };
}

function updateEventListeners(oldVnode, vnode) {
  var name, cur, old, elm = vnode.elm,
      oldOn = oldVnode.data.on || {}, on = vnode.data.on;
  if (!on) return;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    if (old === undefined) {
      if (is.array(cur)) {
        elm.addEventListener(name, arrInvoker(cur));
      } else {
        cur = {fn: cur};
        on[name] = cur;
        elm.addEventListener(name, fnInvoker(cur));
      }
    } else if (is.array(old)) {
      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
      old.length = cur.length;
      for (var i = 0; i < old.length; ++i) old[i] = cur[i];
      on[name]  = old;
    } else {
      old.fn = cur;
      on[name] = old;
    }
  }
}

module.exports = {create: updateEventListeners, update: updateEventListeners};

},{"../is":157}],161:[function(require,module,exports){
function updateProps(oldVnode, vnode) {
  var key, cur, old, elm = vnode.elm,
      oldProps = oldVnode.data.props || {}, props = vnode.data.props || {};
  for (key in oldProps) {
    if (!props[key]) {
      delete elm[key];
    }
  }
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

module.exports = {create: updateProps, update: updateProps};

},{}],162:[function(require,module,exports){
var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
var nextFrame = function(fn) { raf(function() { raf(fn); }); };

function setNextFrame(obj, prop, val) {
  nextFrame(function() { obj[prop] = val; });
}

function updateStyle(oldVnode, vnode) {
  var cur, name, elm = vnode.elm,
      oldStyle = oldVnode.data.style || {},
      style = vnode.data.style || {},
      oldHasDel = 'delayed' in oldStyle;
  for (name in oldStyle) {
    if (!style[name]) {
      elm.style[name] = '';
    }
  }
  for (name in style) {
    cur = style[name];
    if (name === 'delayed') {
      for (name in style.delayed) {
        cur = style.delayed[name];
        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
          setNextFrame(elm.style, name, cur);
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) {
      elm.style[name] = cur;
    }
  }
}

function applyDestroyStyle(vnode) {
  var style, name, elm = vnode.elm, s = vnode.data.style;
  if (!s || !(style = s.destroy)) return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}

function applyRemoveStyle(vnode, rm) {
  var s = vnode.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  var name, elm = vnode.elm, idx, i = 0, maxDur = 0,
      compStyle, style = s.remove, amount = 0, applied = [];
  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }
  compStyle = getComputedStyle(elm);
  var props = compStyle['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if(applied.indexOf(props[i]) !== -1) amount++;
  }
  elm.addEventListener('transitionend', function(ev) {
    if (ev.target === elm) --amount;
    if (amount === 0) rm();
  });
}

module.exports = {create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle};

},{}],163:[function(require,module,exports){
// jshint newcap: false
/* global require, module, document, Node */
'use strict';

var VNode = require('./vnode');
var is = require('./is');
var domApi = require('./htmldomapi.js');

function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }

var emptyNode = VNode('', {}, [], undefined, undefined);

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, map = {}, key;
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

function init(modules, api) {
  var i, j, cbs = {};

  if (isUndef(api)) api = domApi;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
    }
  }

  function emptyNodeAt(elm) {
    return VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    return function() {
      if (--listeners === 0) {
        var parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }

  function createElm(vnode, insertedVnodeQueue) {
    var i, thunk, data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode);
      if (isDef(i = data.vnode)) {
          thunk = vnode;
          vnode = i;
      }
    }
    var elm, children = vnode.children, sel = vnode.sel;
    if (isDef(sel)) {
      // Parse selector
      var hashIdx = sel.indexOf('#');
      var dotIdx = sel.indexOf('.', hashIdx);
      var hash = hashIdx > 0 ? hashIdx : sel.length;
      var dot = dotIdx > 0 ? dotIdx : sel.length;
      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                                                          : api.createElement(tag);
      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
      if (dotIdx > 0) elm.className = sel.slice(dot+1).replace(/\./g, ' ');
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
        }
      } else if (is.primitive(vnode.text)) {
        api.appendChild(elm, api.createTextNode(vnode.text));
      }
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      elm = vnode.elm = api.createTextNode(vnode.text);
    }
    if (isDef(thunk)) thunk.elm = vnode.elm;
    return vnode.elm;
  }

  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j, data = vnode.data;
    // console.log('invokeDestroyHook', vnode)
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
      if (isDef(i = data.vnode)) invokeDestroyHook(i);
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var i, listeners, rm, ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else { // Text node
          api.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    var oldStartIdx = 0, newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef(idxInOld)) { // New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    var i, hook;
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }
    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i;
    if (isDef(i = vnode.data) && isDef(i = i.vnode)) {
      patchVnode(oldVnode, i, insertedVnodeQueue);
      vnode.elm = i.elm;
      return;
    }
    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;
    if (oldVnode === vnode) return;
    if (!sameVnode(oldVnode, vnode)) {
      var parentElm = api.parentNode(oldVnode.elm);
      elm = createElm(vnode, insertedVnodeQueue);
      api.insertBefore(parentElm, elm, oldVnode.elm);
      removeVnodes(parentElm, [oldVnode], 0, 0);
      return;
    }
    if (isDef(vnode.data)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      i = vnode.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        api.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      api.setTextContent(elm, vnode.text);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }

  return function(oldVnode, vnode) {
    var i, elm, parent;
    var insertedVnodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (isUndef(oldVnode.sel)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);

      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vnode;
  };
}

module.exports = {init: init};

},{"./htmldomapi.js":156,"./is":157,"./vnode":164}],164:[function(require,module,exports){
module.exports = function(sel, data, children, text, elm) {
  var key = data === undefined ? undefined : data.key;
  return {sel: sel, data: data, children: children,
          text: text, elm: elm, key: key};
};

},{}],165:[function(require,module,exports){
'use strict';

var t = require('tcomb');
var stringify = t.stringify;

var ValidationError = t.struct({
  message: t.Str,
  actual: t.Any,
  expected: t.Any,
  path: t.list(t.union([t.Str, t.Num]))
}, 'ValidationError');

function getDefaultValidationErrorMessage(actual, expected, path) {
  var expectedName = t.getTypeName(expected);
  var to = path.length ? '/' + path.join('/') + ': ' + expectedName : expectedName;
  return 'Invalid value ' + stringify(actual) + ' supplied to ' + to;
}

function getValidationErrorMessage(actual, expected, path, context) {
  if (t.Function.is(expected.getValidationErrorMessage)) {
    return expected.getValidationErrorMessage(actual, path, context);
  }
  else {
    return getDefaultValidationErrorMessage(actual, expected, path);
  }
}

ValidationError.of = function (actual, expected, path, context) {
  return new ValidationError({
    message: getValidationErrorMessage(actual, expected, path, context),
    actual: actual,
    expected: expected,
    path: path
  });
};

var ValidationResult = t.struct({
  errors: t.list(ValidationError),
  value: t.Any
}, 'ValidationResult');

ValidationResult.prototype.isValid = function () {
  return !(this.errors.length);
};

ValidationResult.prototype.firstError = function () {
  return this.isValid() ? null : this.errors[0];
};

ValidationResult.prototype.toString = function () {
  if (this.isValid()) {
    return '[ValidationResult, true, ' + stringify(this.value) + ']';
  }
  else {
    return '[ValidationResult, false, (' + this.errors.map(function (err) {
      return err.message;
    }).join(', ') + ')]';
  }
};

function validate(x, type, options) {
  options = options || {};
  var path = t.Array.is(options) ? options : options.path || [];
  return new ValidationResult(recurse(x, type, path, options));
}

function recurse(x, type, path, options) {
  if (t.isType(type)) {
    return validators[type.meta.kind](x, type, path, options);
  }
  else {
    return validators.es6classes(x, type, path, options);
  }
}

var validators = validate.validators = {};

validators.es6classes = function validateES6Classes(x, type, path, options) {
  return {
    value: x,
    errors: x instanceof type ? [] : [ValidationError.of(x, type, path, options.context)]
  };
};

// irreducibles and enums
validators.irreducible =
validators.enums = function validateIrreducible(x, type, path, options) {
  return {
    value: x,
    errors: type.is(x) ? [] : [ValidationError.of(x, type, path, options.context)]
  };
};

validators.list = function validateList(x, type, path, options) {

  // x should be an array
  if (!t.Arr.is(x)) {
    return {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
  }

  var ret = {value: [], errors: []};
  // every item should be of type `type.meta.type`
  for (var i = 0, len = x.length; i < len; i++ ) {
    var item = recurse(x[i], type.meta.type, path.concat(i), options);
    ret.value[i] = item.value;
    ret.errors = ret.errors.concat(item.errors);
  }
  return ret;
};

validators.subtype = function validateSubtype(x, type, path, options) {

  // x should be a valid inner type
  var ret = recurse(x, type.meta.type, path, options);
  if (ret.errors.length) {
    return ret;
  }

  // x should satisfy the predicate
  if (!type.meta.predicate(ret.value)) {
    ret.errors = [ValidationError.of(x, type, path, options.context)];
  }

  return ret;

};

validators.maybe = function validateMaybe(x, type, path, options) {
  return t.Nil.is(x) ?
    {value: null, errors: []} :
    recurse(x, type.meta.type, path, options);
};

validators.struct = function validateStruct(x, type, path, options) {

  // x should be an object
  if (!t.Obj.is(x)) {
    return {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
  }

  // [optimization]
  if (type.is(x)) {
    return {value: x, errors: []};
  }

  var ret = {value: {}, errors: []};
  var props = type.meta.props;
  // every item should be of type `props[name]`
  for (var name in props) {
    if (props.hasOwnProperty(name)) {
      var prop = recurse(x[name], props[name], path.concat(name), options);
      ret.value[name] = prop.value;
      ret.errors = ret.errors.concat(prop.errors);
    }
  }
  if (options.strict) {
    for (var field in x) {
      if (x.hasOwnProperty(field) && !props.hasOwnProperty(field) && !t.Nil.is(x[field])) {
        ret.errors.push(ValidationError.of(x[field], t.Nil, path.concat(field), options.context));
      }
    }
  }
  if (!ret.errors.length) {
    ret.value = new type(ret.value);
  }
  return ret;
};

validators.tuple = function validateTuple(x, type, path, options) {

  var types = type.meta.types;
  var len = types.length;

  // x should be an array of at most `len` items
  if (!t.Arr.is(x) || x.length > len) {
    return {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
  }

  var ret = {value: [], errors: []};
  // every item should be of type `types[i]`
  for (var i = 0; i < len; i++) {
    var item = recurse(x[i], types[i], path.concat(i), options);
    ret.value[i] = item.value;
    ret.errors = ret.errors.concat(item.errors);
  }
  return ret;
};

validators.dict = function validateDict(x, type, path, options) {

  // x should be an object
  if (!t.Obj.is(x)) {
    return {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
  }

  var ret = {value: {}, errors: []};
  // every key should be of type `domain`
  // every value should be of type `codomain`
  for (var k in x) {
    if (x.hasOwnProperty(k)) {
      var subpath = path.concat(k);
      var key = recurse(k, type.meta.domain, subpath, options);
      var item = recurse(x[k], type.meta.codomain, subpath, options);
      ret.value[k] = item.value;
      ret.errors = ret.errors.concat(key.errors, item.errors);
    }
  }
  return ret;
};

validators.union = function validateUnion(x, type, path, options) {
  var ctor = type.dispatch(x);
  return t.Func.is(ctor) ?
    recurse(x, ctor, path.concat(type.meta.types.indexOf(ctor)), options) :
    {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
};

validators.intersection = function validateIntersection(x, type, path, options) {

  var types = type.meta.types;
  var len = types.length;

  var ret = {value: x, errors: []};
  // x should be of type `types[i]` for all i
  for (var i = 0; i < len; i++) {
    var item = recurse(x, types[i], path, options);
    ret.errors = ret.errors.concat(item.errors);
  }
  return ret;
};

t.mixin(t, {
  ValidationError: ValidationError,
  ValidationResult: ValidationResult,
  validate: validate
});

module.exports = t;

},{"tcomb":166}],166:[function(require,module,exports){
/*! @preserve
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 Giulio Canti
 *
 */

// core
var t = require('./lib/assert');

// types
t.Any = require('./lib/Any');
t.Array = require('./lib/Array');
t.Boolean = require('./lib/Boolean');
t.Date = require('./lib/Date');
t.Error = require('./lib/Error');
t.Function = require('./lib/Function');
t.Nil = require('./lib/Nil');
t.Number = require('./lib/Number');
t.Object = require('./lib/Object');
t.RegExp = require('./lib/RegExp');
t.String = require('./lib/String');

// short alias are deprecated
t.Arr = t.Array;
t.Bool = t.Boolean;
t.Dat = t.Date;
t.Err = t.Error;
t.Func = t.Function;
t.Num = t.Number;
t.Obj = t.Object;
t.Re = t.RegExp;
t.Str = t.String;

// combinators
t.dict = require('./lib/dict');
t.declare = require('./lib/declare');
t.enums = require('./lib/enums');
t.irreducible = require('./lib/irreducible');
t.list = require('./lib/list');
t.maybe = require('./lib/maybe');
t.refinement = require('./lib/refinement');
t.struct = require('./lib/struct');
t.tuple = require('./lib/tuple');
t.union = require('./lib/union');
t.func = require('./lib/func');
t.intersection = require('./lib/intersection');
t.subtype = t.refinement;

// functions
t.assert = t;
t.update = require('./lib/update');
t.mixin = require('./lib/mixin');
t.isType = require('./lib/isType');
t.is = require('./lib/is');
t.getTypeName = require('./lib/getTypeName');
t.match = require('./lib/match');

module.exports = t;

},{"./lib/Any":167,"./lib/Array":168,"./lib/Boolean":169,"./lib/Date":170,"./lib/Error":171,"./lib/Function":172,"./lib/Nil":173,"./lib/Number":174,"./lib/Object":175,"./lib/RegExp":176,"./lib/String":177,"./lib/assert":178,"./lib/declare":180,"./lib/dict":181,"./lib/enums":182,"./lib/func":185,"./lib/getTypeName":187,"./lib/intersection":188,"./lib/irreducible":189,"./lib/is":190,"./lib/isType":201,"./lib/list":204,"./lib/match":205,"./lib/maybe":206,"./lib/mixin":207,"./lib/refinement":208,"./lib/struct":210,"./lib/tuple":211,"./lib/union":212,"./lib/update":213}],167:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Any', function () { return true; });

},{"./irreducible":189}],168:[function(require,module,exports){
var irreducible = require('./irreducible');
var isArray = require('./isArray');

module.exports = irreducible('Array', isArray);

},{"./irreducible":189,"./isArray":191}],169:[function(require,module,exports){
var irreducible = require('./irreducible');
var isBoolean = require('./isBoolean');

module.exports = irreducible('Boolean', isBoolean);

},{"./irreducible":189,"./isBoolean":192}],170:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Date', function (x) { return x instanceof Date; });

},{"./irreducible":189}],171:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Error', function (x) { return x instanceof Error; });

},{"./irreducible":189}],172:[function(require,module,exports){
var irreducible = require('./irreducible');
var isFunction = require('./isFunction');

module.exports = irreducible('Function', isFunction);

},{"./irreducible":189,"./isFunction":193}],173:[function(require,module,exports){
var irreducible = require('./irreducible');
var isNil = require('./isNil');

module.exports = irreducible('Nil', isNil);

},{"./irreducible":189,"./isNil":196}],174:[function(require,module,exports){
var irreducible = require('./irreducible');
var isNumber = require('./isNumber');

module.exports = irreducible('Number', isNumber);

},{"./irreducible":189,"./isNumber":197}],175:[function(require,module,exports){
var irreducible = require('./irreducible');
var isObject = require('./isObject');

module.exports = irreducible('Object', isObject);

},{"./irreducible":189,"./isObject":198}],176:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('RegExp', function (x) { return x instanceof RegExp; });

},{"./irreducible":189}],177:[function(require,module,exports){
var irreducible = require('./irreducible');
var isString = require('./isString');

module.exports = irreducible('String', isString);

},{"./irreducible":189,"./isString":199}],178:[function(require,module,exports){
var isFunction = require('./isFunction');
var isNil = require('./isNil');
var fail = require('./fail');
var stringify = require('./stringify');

function assert(guard, message) {
  if (guard !== true) {
    if (isFunction(message)) { // handle lazy messages
      message = message();
    }
    else if (isNil(message)) { // use a default message
      message = 'Assert failed (turn on "Pause on exceptions" in your Source panel)';
    }
    assert.fail(message);
  }
}

assert.fail = fail;
assert.stringify = stringify;

module.exports = assert;
},{"./fail":183,"./isFunction":193,"./isNil":196,"./stringify":209}],179:[function(require,module,exports){
(function (process){
var isType = require('./isType');
var isStruct = require('./isStruct');
var getFunctionName = require('./getFunctionName');
var assert = require('./assert');
var stringify = require('./stringify');

// creates an instance of a type, handling the optional new operator
module.exports = function create(type, value, path) {
  if (isType(type)) {
    // for structs the new operator is allowed
    return isStruct(type) ? new type(value, path) : type(value, path);
  }

  if (process.env.NODE_ENV !== 'production') {
    // here type should be a class constructor and value some instance, just check membership and return the value
    path = path || [getFunctionName(type)];
    assert(value instanceof type, function () { return 'Invalid value ' + stringify(value) + ' supplied to ' + path.join('/'); });
  }

  return value;
};
}).call(this,require('_process'))

},{"./assert":178,"./getFunctionName":186,"./isStruct":200,"./isType":201,"./stringify":209,"_process":214}],180:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isType = require('./isType');
var isNil = require('./isNil');
var mixin = require('./mixin');
var getTypeName = require('./getTypeName');

// All the .declare-d types should be clearly different from each other thus they should have
// different names when a name was not explicitly provided.
var nextDeclareUniqueId = 1;

module.exports = function declare(name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isTypeName(name), function () { return 'Invalid argument name ' + name + ' supplied to declare([name]) (expected a string)'; });
  }

  var type;

  function Declare(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      assert(!isNil(type), function () { return 'Type declared but not defined, don\'t forget to call .define on every declared type'; });
    }
    return type(value, path);
  }

  Declare.define = function (spec) {
    if (process.env.NODE_ENV !== 'production') {
      assert(isType(spec), function () { return 'Invalid argument type ' + assert.stringify(spec) +  ' supplied to define(type) (expected a type)'; });
      assert(isNil(type), function () { return 'Declare.define(type) can only be invoked once'; });
      assert(isNil(spec.meta.name) && Object.keys(spec.prototype).length === 0, function () { return 'Invalid argument type ' + assert.stringify(spec) + ' supplied to define(type) (expected a fresh, unnamed type)'; });
    }

    type = spec;
    mixin(Declare, type, true); // true because it overwrites Declare.displayName
    if (name) {
      type.displayName = Declare.displayName = name;
      Declare.meta.name = name;
    }
    // ensure identity is still false
    Declare.meta.identity = false;
    Declare.prototype = type.prototype;
    return Declare;
  };

  Declare.displayName = name || ( getTypeName(Declare) + "$" + nextDeclareUniqueId++ );
  // in general I can't say if this type will be an identity, for safety setting to false
  Declare.meta = { identity: false };
  Declare.prototype = null;
  return Declare;
};

}).call(this,require('_process'))

},{"./assert":178,"./getTypeName":187,"./isNil":196,"./isType":201,"./isTypeName":202,"./mixin":207,"_process":214}],181:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var getTypeName = require('./getTypeName');
var isIdentity = require('./isIdentity');
var isObject = require('./isObject');
var create = require('./create');
var is = require('./is');

function getDefaultName(domain, codomain) {
  return '{[key: ' + getTypeName(domain) + ']: ' + getTypeName(codomain) + '}';
}

function dict(domain, codomain, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(domain), function () { return 'Invalid argument domain ' + assert.stringify(domain) + ' supplied to dict(domain, codomain, [name]) combinator (expected a type)'; });
    assert(isFunction(codomain), function () { return 'Invalid argument codomain ' + assert.stringify(codomain) + ' supplied to dict(domain, codomain, [name]) combinator (expected a type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to dict(domain, codomain, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(domain, codomain);
  var domainNameCache = getTypeName(domain);
  var codomainNameCache = getTypeName(codomain);
  var identity = isIdentity(domain) && isIdentity(codomain);

  function Dict(value, path) {

    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value; // just trust the input if elements must not be hydrated
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isObject(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
    }

    var idempotent = true; // will remain true if I can reutilise the input
    var ret = {}; // make a temporary copy, will be discarded if idempotent remains true
    for (var k in value) {
      if (value.hasOwnProperty(k)) {
        k = create(domain, k, ( process.env.NODE_ENV !== 'production' ? path.concat(domainNameCache) : null ));
        var actual = value[k];
        var instance = create(codomain, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(k + ': ' + codomainNameCache) : null ));
        idempotent = idempotent && ( actual === instance );
        ret[k] = instance;
      }
    }

    if (idempotent) { // implements idempotency
      ret = value;
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(ret);
    }

    return ret;
  }

  Dict.meta = {
    kind: 'dict',
    domain: domain,
    codomain: codomain,
    name: name,
    identity: identity
  };

  Dict.displayName = displayName;

  Dict.is = function (x) {
    if (!isObject(x)) {
      return false;
    }
    for (var k in x) {
      if (x.hasOwnProperty(k)) {
        if (!is(k, domain) || !is(x[k], codomain)) {
          return false;
        }
      }
    }
    return true;
  };

  Dict.update = function (instance, patch) {
    return Dict(assert.update(instance, patch));
  };

  return Dict;
}

dict.getDefaultName = getDefaultName;
module.exports = dict;

}).call(this,require('_process'))

},{"./assert":178,"./create":179,"./getTypeName":187,"./is":190,"./isFunction":193,"./isIdentity":194,"./isObject":198,"./isTypeName":202,"_process":214}],182:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var forbidNewOperator = require('./forbidNewOperator');
var isString = require('./isString');
var isObject = require('./isObject');

function getDefaultName(map) {
  return Object.keys(map).map(function (k) { return assert.stringify(k); }).join(' | ');
}

function enums(map, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isObject(map), function () { return 'Invalid argument map ' + assert.stringify(map) + ' supplied to enums(map, [name]) combinator (expected a dictionary of String -> String | Number)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to enums(map, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(map);

  function Enums(value, path) {

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Enums);
      path = path || [displayName];
      assert(Enums.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected one of ' + assert.stringify(Object.keys(map)) + ')'; });
    }

    return value;
  }

  Enums.meta = {
    kind: 'enums',
    map: map,
    name: name,
    identity: true
  };

  Enums.displayName = displayName;

  Enums.is = function (x) {
    return map.hasOwnProperty(x);
  };

  return Enums;
}

enums.of = function (keys, name) {
  keys = isString(keys) ? keys.split(' ') : keys;
  var value = {};
  keys.forEach(function (k) {
    value[k] = k;
  });
  return enums(value, name);
};

enums.getDefaultName = getDefaultName;
module.exports = enums;


}).call(this,require('_process'))

},{"./assert":178,"./forbidNewOperator":184,"./isObject":198,"./isString":199,"./isTypeName":202,"_process":214}],183:[function(require,module,exports){
module.exports = function fail(message) {
  throw new TypeError('[tcomb] ' + message);
};
},{}],184:[function(require,module,exports){
var assert = require('./assert');
var getTypeName = require('./getTypeName');

module.exports = function forbidNewOperator(x, type) {
  assert(!(x instanceof type), function () { return 'Cannot use the new operator to instantiate the type ' + getTypeName(type); });
};
},{"./assert":178,"./getTypeName":187}],185:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var FunctionType = require('./Function');
var isArray = require('./isArray');
var list = require('./list');
var isObject = require('./isObject');
var create = require('./create');
var isNil = require('./isNil');
var isBoolean = require('./isBoolean');
var tuple = require('./tuple');
var getFunctionName = require('./getFunctionName');
var getTypeName = require('./getTypeName');

function getDefaultName(domain, codomain) {
  return '(' + domain.map(getTypeName).join(', ') + ') => ' + getTypeName(codomain);
}

function isInstrumented(f) {
  return FunctionType.is(f) && isObject(f.instrumentation);
}

function func(domain, codomain, name) {

  domain = isArray(domain) ? domain : [domain]; // handle handy syntax for unary functions

  if (process.env.NODE_ENV !== 'production') {
    assert(list(FunctionType).is(domain), function () { return 'Invalid argument domain ' + assert.stringify(domain) + ' supplied to func(domain, codomain, [name]) combinator (expected an array of types)'; });
    assert(FunctionType.is(codomain), function () { return 'Invalid argument codomain ' + assert.stringify(codomain) + ' supplied to func(domain, codomain, [name]) combinator (expected a type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to func(domain, codomain, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(domain, codomain);

  function FuncType(value, curried) {

    if (!isInstrumented(value)) { // automatically instrument the function
      return FuncType.of(value, curried);
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(FuncType.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + displayName; });
    }

    return value;
  }

  FuncType.meta = {
    kind: 'func',
    domain: domain,
    codomain: codomain,
    name: name,
    identity: true
  };

  FuncType.displayName = displayName;

  FuncType.is = function (x) {
    return isInstrumented(x) &&
      x.instrumentation.domain.length === domain.length &&
      x.instrumentation.domain.every(function (type, i) {
        return type === domain[i];
      }) &&
      x.instrumentation.codomain === codomain;
  };

  FuncType.of = function (f, curried) {

    if (process.env.NODE_ENV !== 'production') {
      assert(FunctionType.is(f), function () { return 'Invalid argument f supplied to func.of ' + displayName + ' (expected a function)'; });
      assert(isNil(curried) || isBoolean(curried), function () { return 'Invalid argument curried ' + assert.stringify(curried) + ' supplied to func.of ' + displayName + ' (expected a boolean)'; });
    }

    if (FuncType.is(f)) { // makes FuncType.of idempotent
      return f;
    }

    function fn() {
      var args = Array.prototype.slice.call(arguments);
      var len = curried ?
        args.length :
        domain.length;
      var argsType = tuple(domain.slice(0, len));

      args = argsType(args); // type check arguments

      if (len === domain.length) {
        return create(codomain, f.apply(this, args));
      }
      else {
        var g = Function.prototype.bind.apply(f, [this].concat(args));
        var newdomain = func(domain.slice(len), codomain);
        return newdomain.of(g, curried);
      }
    }

    fn.instrumentation = {
      domain: domain,
      codomain: codomain,
      f: f
    };

    fn.displayName = getFunctionName(f);

    return fn;

  };

  return FuncType;

}

func.getDefaultName = getDefaultName;
module.exports = func;

}).call(this,require('_process'))

},{"./Function":172,"./assert":178,"./create":179,"./getFunctionName":186,"./getTypeName":187,"./isArray":191,"./isBoolean":192,"./isNil":196,"./isObject":198,"./isTypeName":202,"./list":204,"./tuple":211,"_process":214}],186:[function(require,module,exports){
module.exports = function getFunctionName(f) {
  return f.displayName || f.name || '<function' + f.length + '>';
};
},{}],187:[function(require,module,exports){
var isType = require('./isType');
var getFunctionName = require('./getFunctionName');

module.exports = function getTypeName(constructor) {
  if (isType(constructor)) {
    return constructor.displayName;
  }
  return getFunctionName(constructor);
};
},{"./getFunctionName":186,"./isType":201}],188:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var isArray = require('./isArray');
var forbidNewOperator = require('./isIdentity');
var is = require('./is');
var getTypeName = require('./getTypeName');

function getDefaultName(types) {
  return types.map(getTypeName).join(' & ');
}

function intersection(types, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to intersection(types, [name]) combinator (expected an array of at least 2 types)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to intersection(types, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(types);

  function Intersection(value, path) {

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Intersection);
      path = path || [displayName];
      assert(Intersection.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
    }

    return value;
  }

  Intersection.meta = {
    kind: 'intersection',
    types: types,
    name: name,
    identity: true
  };

  Intersection.displayName = displayName;

  Intersection.is = function (x) {
    return types.every(function (type) {
      return is(x, type);
    });
  };

  Intersection.update = function (instance, patch) {
    return Intersection(assert.update(instance, patch));
  };

  return Intersection;
}

intersection.getDefaultName = getDefaultName;
module.exports = intersection;


}).call(this,require('_process'))

},{"./assert":178,"./getTypeName":187,"./is":190,"./isArray":191,"./isFunction":193,"./isIdentity":194,"./isTypeName":202,"_process":214}],189:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isString = require('./isString');
var isFunction = require('./isFunction');
var forbidNewOperator = require('./forbidNewOperator');

module.exports = function irreducible(name, predicate) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isString(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to irreducible(name, predicate) (expected a string)'; });
    assert(isFunction(predicate), 'Invalid argument predicate ' + assert.stringify(predicate) + ' supplied to irreducible(name, predicate) (expected a function)');
  }

  function Irreducible(value, path) {

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Irreducible);
      path = path || [name];
      assert(predicate(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
    }

    return value;
  }

  Irreducible.meta = {
    kind: 'irreducible',
    name: name,
    predicate: predicate,
    identity: true
  };

  Irreducible.displayName = name;

  Irreducible.is = predicate;

  return Irreducible;
};

}).call(this,require('_process'))

},{"./assert":178,"./forbidNewOperator":184,"./isFunction":193,"./isString":199,"_process":214}],190:[function(require,module,exports){
var isType = require('./isType');

// returns true if x is an instance of type
module.exports = function is(x, type) {
  if (isType(type)) {
    return type.is(x);
  }
  return x instanceof type; // type should be a class constructor
};

},{"./isType":201}],191:[function(require,module,exports){
module.exports = function isArray(x) {
  return x instanceof Array;
};
},{}],192:[function(require,module,exports){
module.exports = function isBoolean(x) {
  return x === true || x === false;
};
},{}],193:[function(require,module,exports){
module.exports = function isFunction(x) {
  return typeof x === 'function';
};
},{}],194:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var Boolean = require('./Boolean');
var isType = require('./isType');
var getTypeName = require('./getTypeName');

// return true if the type constructor behaves like the identity function
module.exports = function isIdentity(type) {
  if (isType(type)) {
    if (process.env.NODE_ENV !== 'production') {
      assert(Boolean.is(type.meta.identity), function () { return 'Invalid meta identity ' + assert.stringify(type.meta.identity) + ' supplied to type ' + getTypeName(type); });
    }
    return type.meta.identity;
  }
  // for tcomb the other constructors, like ES6 classes, are identity-like
  return true;
};
}).call(this,require('_process'))

},{"./Boolean":169,"./assert":178,"./getTypeName":187,"./isType":201,"_process":214}],195:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isMaybe(x) {
  return isType(x) && ( x.meta.kind === 'maybe' );
};
},{"./isType":201}],196:[function(require,module,exports){
module.exports = function isNil(x) {
  return x === null || x === void 0;
};
},{}],197:[function(require,module,exports){
module.exports = function isNumber(x) {
  return typeof x === 'number' && isFinite(x) && !isNaN(x);
};
},{}],198:[function(require,module,exports){
var isNil = require('./isNil');
var isArray = require('./isArray');

module.exports = function isObject(x) {
  return !isNil(x) && typeof x === 'object' && !isArray(x);
};
},{"./isArray":191,"./isNil":196}],199:[function(require,module,exports){
module.exports = function isString(x) {
  return typeof x === 'string';
};
},{}],200:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isStruct(x) {
  return isType(x) && ( x.meta.kind === 'struct' );
};
},{"./isType":201}],201:[function(require,module,exports){
var isFunction = require('./isFunction');
var isObject = require('./isObject');

module.exports = function isType(x) {
  return isFunction(x) && isObject(x.meta);
};
},{"./isFunction":193,"./isObject":198}],202:[function(require,module,exports){
var isNil = require('./isNil');
var isString = require('./isString');

module.exports = function isTypeName(name) {
  return isNil(name) || isString(name);
};
},{"./isNil":196,"./isString":199}],203:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isUnion(x) {
  return isType(x) && ( x.meta.kind === 'union' );
};
},{"./isType":201}],204:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var getTypeName = require('./getTypeName');
var isIdentity = require('./isIdentity');
var create = require('./create');
var is = require('./is');
var isArray = require('./isArray');

function getDefaultName(type) {
  return 'Array<' + getTypeName(type) + '>';
}

function list(type, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to list(type, [name]) combinator (expected a type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to list(type, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(type);
  var typeNameCache = getTypeName(type);
  var identity = isIdentity(type); // the list is identity iif type is identity

  function List(value, path) {

    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value; // just trust the input if elements must not be hydrated
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isArray(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an array of ' + typeNameCache + ')'; });
    }

    var idempotent = true; // will remain true if I can reutilise the input
    var ret = []; // make a temporary copy, will be discarded if idempotent remains true
    for (var i = 0, len = value.length; i < len; i++ ) {
      var actual = value[i];
      var instance = create(type, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(i + ': ' + typeNameCache) : null ));
      idempotent = idempotent && ( actual === instance );
      ret.push(instance);
    }

    if (idempotent) { // implements idempotency
      ret = value;
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(ret);
    }

    return ret;
  }

  List.meta = {
    kind: 'list',
    type: type,
    name: name,
    identity: identity
  };

  List.displayName = displayName;

  List.is = function (x) {
    return isArray(x) && x.every(function (e) {
      return is(e, type);
    });
  };

  List.update = function (instance, patch) {
    return List(assert.update(instance, patch));
  };

  return List;
}

list.getDefaultName = getDefaultName;
module.exports = list;

}).call(this,require('_process'))

},{"./assert":178,"./create":179,"./getTypeName":187,"./is":190,"./isArray":191,"./isFunction":193,"./isIdentity":194,"./isTypeName":202,"_process":214}],205:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isFunction = require('./isFunction');
var isType = require('./isType');
var Any = require('./Any');

module.exports = function match(x) {
  var type, guard, f, count;
  for (var i = 1, len = arguments.length; i < len; ) {
    type = arguments[i];
    guard = arguments[i + 1];
    f = arguments[i + 2];

    if (isFunction(f) && !isType(f)) {
      i = i + 3;
    }
    else {
      f = guard;
      guard = Any.is;
      i = i + 2;
    }

    if (process.env.NODE_ENV !== 'production') {
      count = (count || 0) + 1;
      assert(isType(type), function () { return 'Invalid type in clause #' + count; });
      assert(isFunction(guard), function () { return 'Invalid guard in clause #' + count; });
      assert(isFunction(f), function () { return 'Invalid block in clause #' + count; });
    }

    if (type.is(x) && guard(x)) {
      return f(x);
    }
  }
  assert.fail('Match error');
};

}).call(this,require('_process'))

},{"./Any":167,"./assert":178,"./isFunction":193,"./isType":201,"_process":214}],206:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var isMaybe = require('./isMaybe');
var isIdentity = require('./isIdentity');
var Any = require('./Any');
var create = require('./create');
var Nil = require('./Nil');
var forbidNewOperator = require('./forbidNewOperator');
var is = require('./is');
var getTypeName = require('./getTypeName');

function getDefaultName(type) {
  return '?' + getTypeName(type);
}

function maybe(type, name) {

  if (isMaybe(type) || type === Any || type === Nil) { // makes the combinator idempotent and handle Any, Nil
    return type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to maybe(type, [name]) combinator (expected a type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to maybe(type, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(type);

  function Maybe(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Maybe);
    }
    return Nil.is(value) ? value : create(type, value, path);
  }

  Maybe.meta = {
    kind: 'maybe',
    type: type,
    name: name,
    identity: isIdentity(type)
  };

  Maybe.displayName = displayName;

  Maybe.is = function (x) {
    return Nil.is(x) || is(x, type);
  };

  return Maybe;
}

maybe.getDefaultName = getDefaultName;
module.exports = maybe;

}).call(this,require('_process'))

},{"./Any":167,"./Nil":173,"./assert":178,"./create":179,"./forbidNewOperator":184,"./getTypeName":187,"./is":190,"./isFunction":193,"./isIdentity":194,"./isMaybe":195,"./isTypeName":202,"_process":214}],207:[function(require,module,exports){
(function (process){
var isNil = require('./isNil');
var assert = require('./assert');

// safe mixin, cannot override props unless specified
module.exports = function mixin(target, source, overwrite) {
  if (isNil(source)) { return target; }
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      if (overwrite !== true) {
        if (process.env.NODE_ENV !== 'production') {
          assert(!target.hasOwnProperty(k), function () { return 'Invalid call to mixin(target, source, [overwrite]): cannot overwrite property "' + k + '" of target object'; });
        }
      }
      target[k] = source[k];
    }
  }
  return target;
};
}).call(this,require('_process'))

},{"./assert":178,"./isNil":196,"_process":214}],208:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var forbidNewOperator = require('./forbidNewOperator');
var isIdentity = require('./isIdentity');
var create = require('./create');
var is = require('./is');
var getTypeName = require('./getTypeName');
var getFunctionName = require('./getFunctionName');

function getDefaultName(type, predicate) {
  return '{' + getTypeName(type) + ' | ' + getFunctionName(predicate) + '}';
}

function refinement(type, predicate, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to refinement(type, predicate, [name]) combinator (expected a type)'; });
    assert(isFunction(predicate), function () { return 'Invalid argument predicate supplied to refinement(type, predicate, [name]) combinator (expected a function)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to refinement(type, predicate, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(type, predicate);
  var identity = isIdentity(type);

  function Refinement(value, path) {

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Refinement);
      path = path || [displayName];
    }

    var x = create(type, value, path);

    if (process.env.NODE_ENV !== 'production') {
      assert(predicate(x), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
    }

    return x;
  }

  Refinement.meta = {
    kind: 'subtype',
    type: type,
    predicate: predicate,
    name: name,
    identity: identity
  };

  Refinement.displayName = displayName;

  Refinement.is = function (x) {
    return is(x, type) && predicate(x);
  };

  Refinement.update = function (instance, patch) {
    return Refinement(assert.update(instance, patch));
  };

  return Refinement;
}

refinement.getDefaultName = getDefaultName;
module.exports = refinement;

}).call(this,require('_process'))

},{"./assert":178,"./create":179,"./forbidNewOperator":184,"./getFunctionName":186,"./getTypeName":187,"./is":190,"./isFunction":193,"./isIdentity":194,"./isTypeName":202,"_process":214}],209:[function(require,module,exports){
module.exports = function stringify(x) {
  try { // handle "Converting circular structure to JSON" error
    return JSON.stringify(x, null, 2);
  }
  catch (e) {
    return String(x);
  }
};
},{}],210:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var String = require('./String');
var Function = require('./Function');
var isArray = require('./isArray');
var isObject = require('./isObject');
var create = require('./create');
var mixin = require('./mixin');
var isStruct = require('./isStruct');
var getTypeName = require('./getTypeName');
var dict = require('./dict');

function getDefaultName(props) {
  return '{' + Object.keys(props).map(function (prop) {
    return prop + ': ' + getTypeName(props[prop]);
  }).join(', ') + '}';
}

function extend(mixins, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(mixins) && mixins.every(function (x) {
      return isObject(x) || isStruct(x);
    }), function () { return 'Invalid argument mixins supplied to extend(mixins, name), expected an array of objects or structs'; });
  }
  var props = {};
  var prototype = {};
  mixins.forEach(function (struct) {
    if (isObject(struct)) {
      mixin(props, struct);
    }
    else {
      mixin(props, struct.meta.props);
      mixin(prototype, struct.prototype);
    }
  });
  var ret = struct(props, name);
  mixin(ret.prototype, prototype);
  return ret;
}

function struct(props, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(dict(String, Function).is(props), function () { return 'Invalid argument props ' + assert.stringify(props) + ' supplied to struct(props, [name]) combinator (expected a dictionary String -> Type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to struct(props, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(props);

  function Struct(value, path) {

    if (Struct.is(value)) { // implements idempotency
      return value;
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isObject(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an object)'; });
    }

    if (!(this instanceof Struct)) { // `new` is optional
      return new Struct(value, path);
    }

    for (var k in props) {
      if (props.hasOwnProperty(k)) {
        var expected = props[k];
        var actual = value[k];
        this[k] = create(expected, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(k + ': ' + getTypeName(expected)) : null ));
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(this);
    }

  }

  Struct.meta = {
    kind: 'struct',
    props: props,
    name: name,
    identity: false
  };

  Struct.displayName = displayName;

  Struct.is = function (x) {
    return x instanceof Struct;
  };

  Struct.update = function (instance, patch) {
    return new Struct(assert.update(instance, patch));
  };

  Struct.extend = function (structs, name) {
    return extend([Struct].concat(structs), name);
  };

  return Struct;
}

struct.getDefaultName = getDefaultName;
struct.extend = extend;
module.exports = struct;

}).call(this,require('_process'))

},{"./Function":172,"./String":177,"./assert":178,"./create":179,"./dict":181,"./getTypeName":187,"./isArray":191,"./isObject":198,"./isStruct":200,"./isTypeName":202,"./mixin":207,"_process":214}],211:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var getTypeName = require('./getTypeName');
var isIdentity = require('./isIdentity');
var isArray = require('./isArray');
var create = require('./create');
var is = require('./is');

function getDefaultName(types) {
  return '[' + types.map(getTypeName).join(', ') + ']';
}

function tuple(types, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction), function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to tuple(types, [name]) combinator (expected an array of types)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to tuple(types, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(types);
  var identity = types.every(isIdentity);

  function Tuple(value, path) {

    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value;
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isArray(value) && value.length === types.length, function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an array of length ' + types.length + ')'; });
    }

    var idempotent = true;
    var ret = [];
    for (var i = 0, len = types.length; i < len; i++) {
      var expected = types[i];
      var actual = value[i];
      var instance = create(expected, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(i + ': ' + getTypeName(expected)) : null ));
      idempotent = idempotent && ( actual === instance );
      ret.push(instance);
    }

    if (idempotent) { // implements idempotency
      ret = value;
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(ret);
    }

    return ret;
  }

  Tuple.meta = {
    kind: 'tuple',
    types: types,
    name: name,
    identity: identity
  };

  Tuple.displayName = displayName;

  Tuple.is = function (x) {
    return isArray(x) &&
      x.length === types.length &&
      types.every(function (type, i) {
        return is(x[i], type);
      });
  };

  Tuple.update = function (instance, patch) {
    return Tuple(assert.update(instance, patch));
  };

  return Tuple;
}

tuple.getDefaultName = getDefaultName;
module.exports = tuple;
}).call(this,require('_process'))

},{"./assert":178,"./create":179,"./getTypeName":187,"./is":190,"./isArray":191,"./isFunction":193,"./isIdentity":194,"./isTypeName":202,"_process":214}],212:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var getTypeName = require('./getTypeName');
var isIdentity = require('./isIdentity');
var isArray = require('./isArray');
var create = require('./create');
var is = require('./is');
var forbidNewOperator = require('./forbidNewOperator');
var isType = require('./isType');
var isUnion = require('./isUnion');
var isNil = require('./isNil');

function getDefaultName(types) {
  return types.map(getTypeName).join(' | ');
}

function union(types, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to union(types, [name]) combinator (expected an array of at least 2 types)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to union(types, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(types);
  var identity = types.every(isIdentity);

  function Union(value, path) {

    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value;
      }
    }

    var type = Union.dispatch(value);
    if (!type && Union.is(value)) {
      return value;
    }

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Union);
      path = path || [displayName];
      assert(isType(type), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (no constructor returned by dispatch)'; });
      path[path.length - 1] += '(' + getTypeName(type) + ')';
    }

    return create(type, value, path);
  }

  Union.meta = {
    kind: 'union',
    types: types,
    name: name,
    identity: identity
  };

  Union.displayName = displayName;

  Union.is = function (x) {
    return types.some(function (type) {
      return is(x, type);
    });
  };

  Union.dispatch = function (x) { // default dispatch implementation
    for (var i = 0, len = types.length; i < len; i++ ) {
      var type = types[i];
      if (isUnion(type)) { // handle union of unions
        var t = type.dispatch(x);
        if (!isNil(t)) {
          return t;
        }
      }
      else if (is(x, type)) {
        return type;
      }
    }
  };

  Union.update = function (instance, patch) {
    return Union(assert.update(instance, patch));
  };

  return Union;
}

union.getDefaultName = getDefaultName;
module.exports = union;


}).call(this,require('_process'))

},{"./assert":178,"./create":179,"./forbidNewOperator":184,"./getTypeName":187,"./is":190,"./isArray":191,"./isFunction":193,"./isIdentity":194,"./isNil":196,"./isType":201,"./isTypeName":202,"./isUnion":203,"_process":214}],213:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isObject = require('./isObject');
var isFunction = require('./isFunction');
var isArray = require('./isArray');
var isNumber = require('./isNumber');
var mixin = require('./mixin');

function getShallowCopy(x) {
  if (isArray(x)) {
    return x.concat();
  }
  if (x instanceof Date || x instanceof RegExp) {
    return x;
  }
  if (isObject(x)) {
    return mixin({}, x);
  }
  return x;
}

function update(instance, patch) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isObject(patch), function () { return 'Invalid argument patch ' + assert.stringify(patch) + ' supplied to function update(instance, patch): expected an object containing commands'; });
  }

  var value = getShallowCopy(instance);
  var isChanged = false;
  for (var k in patch) {
    if (patch.hasOwnProperty(k)) {
      if (update.commands.hasOwnProperty(k)) {
        value = update.commands[k](patch[k], value);
        isChanged = true;
      }
      else {
        var newValue = update(value[k], patch[k]);
        isChanged = isChanged || ( newValue !== value[k] );
        value[k] = newValue;
      }
    }
  }
  return isChanged ? value : instance;
}

// built-in commands

function $apply(f, value) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(f), 'Invalid argument f supplied to immutability helper { $apply: f } (expected a function)');
  }
  return f(value);
}

function $push(elements, arr) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(elements), 'Invalid argument elements supplied to immutability helper { $push: elements } (expected an array)');
    assert(isArray(arr), 'Invalid value supplied to immutability helper $push (expected an array)');
  }
  return arr.concat(elements);
}

function $remove(keys, obj) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(keys), 'Invalid argument keys supplied to immutability helper { $remove: keys } (expected an array)');
    assert(isObject(obj), 'Invalid value supplied to immutability helper $remove (expected an object)');
  }
  for (var i = 0, len = keys.length; i < len; i++ ) {
    delete obj[keys[i]];
  }
  return obj;
}

function $set(value) {
  return value;
}

function $splice(splices, arr) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(splices) && splices.every(isArray), 'Invalid argument splices supplied to immutability helper { $splice: splices } (expected an array of arrays)');
    assert(isArray(arr), 'Invalid value supplied to immutability helper $splice (expected an array)');
  }
  return splices.reduce(function (acc, splice) {
    acc.splice.apply(acc, splice);
    return acc;
  }, arr);
}

function $swap(config, arr) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isObject(config), 'Invalid argument config supplied to immutability helper { $swap: config } (expected an object)');
    assert(isNumber(config.from), 'Invalid argument config.from supplied to immutability helper { $swap: config } (expected a number)');
    assert(isNumber(config.to), 'Invalid argument config.to supplied to immutability helper { $swap: config } (expected a number)');
    assert(isArray(arr), 'Invalid value supplied to immutability helper $swap (expected an array)');
  }
  var element = arr[config.to];
  arr[config.to] = arr[config.from];
  arr[config.from] = element;
  return arr;
}

function $unshift(elements, arr) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(elements), 'Invalid argument elements supplied to immutability helper {$unshift: elements} (expected an array)');
    assert(isArray(arr), 'Invalid value supplied to immutability helper $unshift (expected an array)');
  }
  return elements.concat(arr);
}

function $merge(obj, value) {
  return mixin(mixin({}, value), obj, true);
}

update.commands = {
  $apply: $apply,
  $push: $push,
  $remove: $remove,
  $set: $set,
  $splice: $splice,
  $swap: $swap,
  $unshift: $unshift,
  $merge: $merge
};

module.exports = update;

}).call(this,require('_process'))

},{"./assert":178,"./isArray":191,"./isFunction":193,"./isNumber":197,"./isObject":198,"./mixin":207,"_process":214}],214:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],215:[function(require,module,exports){
'use strict';

var snabbdom = require('snabbdom');
var patch = snabbdom.init([require('snabbdom/modules/class'), require('snabbdom/modules/props'), require('snabbdom/modules/attributes'), require('snabbdom/modules/style'), require('snabbdom/modules/eventlisteners')]);
var hyper = require('snabbdom/h');
var helpers = require('hyperscript-helpers')(hyper);
var Signal = require('mini-signals');
var uniqueId = require('lodash/uniqueId');
var noop = require('lodash/noop');
var assign = require('lodash/assign');
var clone = require('lodash/cloneDeep');
var inherits = require('inherits');

function Component() {
    if (!(this instanceof Component)) {
        return new Component();
    }
    this.componentName = 'component';
    this.props = {};
    this.vnode = null;
    this.thunk = false;
    this.mountedVnode = null;
    this.isMounted = false;
    this.signals = {
        willMount: new Signal(),
        didMount: new Signal(),
        willUpdate: new Signal(),
        didUpdate: new Signal(),
        willUnmount: new Signal()
    };
    this.init();
    this.cid = uniqueId(this.componentName + '_');
}

Component.create = function (proto) {
    var Child = function Child() {
        if (!(this instanceof Component)) {
            return new Child();
        }
        Component.apply(this, arguments);
    };

    inherits(Child, Component);
    assign(Child.prototype, proto);
    return Child;
};

Component.prototype.init = noop;

Component.prototype.render = noop;

Component.prototype.componentWillMount = noop;

Component.prototype.componentDidMount = noop;

Component.prototype.componentWillUnmount = noop;

Component.prototype.componentWillUpdate = noop;

Component.prototype.componentDidUpdate = noop;

Component.prototype.shouldComponentUpdate = function (nextProps) {
    if (this.props === nextProps) {
        return false;
    }
    return true;
};

function hooks(context, vnode) {
    var compHooks = vnode.data.hook;

    if (vnode.data.hook) {
        console.warn('vnode vnode already has hooks defined');
    } else {
        compHooks = vnode.data.hook = {};
    }

    compHooks.create = function (emptyVNode, vnode) {
        // console.log('create', context.cid);
        if (context.thunk) {
            context.mountedVnode.data.vnode = vnode;
            context.mountedVnode.elm = vnode.elm;
        } else {
            context.mountedVnode = vnode;
        }

        if (!context.isMounted) {
            context.signals.willMount.dispatch();
            context.componentWillMount();
            console.debug('componentWillMount', context.cid);
        }
    };
    compHooks.insert = function (vnode) {
        // console.log('insert ', context.cid);
        if (context.isMounted) {
            context.signals.didUpdate.dispatch();
            context.componentDidUpdate();
            console.debug('componentDidUpdate ', context.cid);
        } else {
            context.isMounted = true;
            context.signals.didMount.dispatch();
            context.componentDidMount();
            console.debug('componentDidMount', context.cid);
        }
    };
    compHooks.destroy = function (vnode) {
        if (vnode === context.mountedVnode) {
            context.signals.willUnmount.dispatch();
            context.componentWillUnmount();
            context.isMounted = false;
            console.debug('unmount ', context.cid, vnode);
        }
    };
    compHooks.prepatch = function (old, newNode) {
        // console.debug('prepatch ', context.cid, clone(old), clone(newNode));
    };
    compHooks.postpatch = function (old, newNode) {
        // console.debug('postpach ', context.cid, newNode);
        context.signals.didUpdate.dispatch();
        context.componentDidUpdate();
        console.debug('componentDidUpdate ', context.cid);
    };
}

Component.prototype.mount = function (props, handlers) {
    // console.debug('Mount: ', this.cid, props);
    if (this.isMounted) {
        console.error('Render again?');
    }
    this.props = props;
    this.handlers = handlers;
    this.vnode = this.render(props, handlers);
    if (!this.vnode) {
        console.warn('empty render ?!?');
    }
    hooks(this, this.vnode);
    return this.vnode;
};

Component.prototype.update = function (nextProps, handlers) {
    var oldRoot = this.vnode;
    var vnode;

    // update handlers
    if (typeof handlers !== 'undefined') {
        this.handlers = handlers;
    }

    // protect update with empty props
    if (!nextProps) {
        nextProps = this.props;
    }

    if (this.isMounted) {
        if (this.shouldComponentUpdate(nextProps)) {
            this.signals.willUpdate.dispatch(nextProps);
            this.componentWillUpdate(nextProps);
            // console.debug('Update: ', this.cid, nextProps);
            this.props = nextProps;

            // Replace DOM
            vnode = this.render(this.props, this.handlers);
            if (!this.vnode) {
                console.warn('empty render ?!?');
            }
            hooks(this, vnode);
            this.vnode = patch(oldRoot, vnode);
            this.mountedVnode.data.vnode = this.vnode;
        } else {
            console.debug('Skiped: ', this.cid);
        }
    } else {
        console.warn('Why update when not mounted? ', this.cid);
    }
};

// module.exports.h = hyper;
module.exports.helpers = helpers;
module.exports.patch = patch;
module.exports.Component = Component;
module.exports.mount = function (elem, comp, state) {
    var vnode = comp().mount(state);
    var temp = document.createElement('span');
    temp.id = 'jaskhdjsahdkjahsdjk';
    patch(elem.appendChild(temp), vnode);
    return vnode;
};

module.exports.h = function () {
    var component = arguments[0];
    var props = arguments[1] && arguments[1].props || {};
    var handlers = arguments[1] && arguments[1].on || {};
    var children = arguments[2];

    if (component.super_ === Component) {
        if (props.key) {
            return exports.reuse(props.key, component, props, handlers, children);
        }
        return component().mount(props, handlers, children);
    }
    return hyper.apply(null, arguments);
};

function init(thunkVnode) {
    var data = thunkVnode.data;

    // console.log('INIT thunk', thunkVnode);
    thunkVnode.data.hook.destroy = function () {
        // console.log('destroy unmount', thunkVnode.sel, data.instance.cid);
        data.instance.signals.willUnmount.dispatch();
        data.instance.componentWillUnmount();
    };

    data.instance = data.type();
    data.instance.thunk = true;
    data.instance.mountedVnode = thunkVnode;
    data.instance.mount(data.args[0], data.args[1]);
    data.vnode = data.instance.vnode;
}

function prepatch(oldVnode, vnode) {
    var patch;
    // console.log('prepatch old', clone(oldVnode));
    // console.log('prepatch vnode', clone(vnode));

    if (oldVnode.data.type === vnode.data.type) {
        console.warn('reuse');
        oldVnode.data.instance.update(vnode.data.args[0], vnode.data.args[1]);
        console.warn('finish reuse');
        patch = oldVnode.data.instance.vnode;
        vnode.data = oldVnode.data;
        vnode.data.vnode = patch;
    } else {
        console.warn('didnt reuse');
    }
}

exports.reuse = function (name, fn /* args */) {
    var i;
    var args = [];

    for (i = 2; i < arguments.length; ++i) {
        args[i - 2] = arguments[i];
    }

    return hyper('thunk' + name, {
        hook: { init: init, prepatch: prepatch },
        instance: null,
        type: fn,
        args: args
    });
};

},{"hyperscript-helpers":13,"inherits":14,"lodash/assign":115,"lodash/cloneDeep":116,"lodash/noop":139,"lodash/uniqueId":146,"mini-signals":147,"snabbdom":163,"snabbdom/h":155,"snabbdom/modules/attributes":158,"snabbdom/modules/class":159,"snabbdom/modules/eventlisteners":160,"snabbdom/modules/props":161,"snabbdom/modules/style":162}]},{},[12])(12)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZXMvYXBwLmpzIiwiZXhhbXBsZXMvY291bnRlci1saXN0L2FjdGlvbnMuanMiLCJleGFtcGxlcy9jb3VudGVyLWxpc3QvY291bnRlci1saXN0LmpzIiwiZXhhbXBsZXMvY291bnRlci1saXN0L2NvdW50ZXIuanMiLCJleGFtcGxlcy9jb3VudGVyLWxpc3QvcmVkdWNlci1jb3VudGVyLWxpc3QuanMiLCJleGFtcGxlcy9mb3JtL2Zvcm0tcmVkdWNlci5qcyIsImV4YW1wbGVzL2Zvcm0vZm9ybS5qcyIsImV4YW1wbGVzL21haW4uanMiLCJleGFtcGxlcy9uZXN0aW5nL3JlZHVjZXItbmVzdGluZy5qcyIsImV4YW1wbGVzL3JlZHVjZXItYXBwLmpzIiwiZXhhbXBsZXMvc3RvcmUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9oeXBlcnNjcmlwdC1oZWxwZXJzL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0hhc2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19NYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19NYXBDYWNoZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N0YWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fVWludDhBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1dlYWtNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hZGRNYXBFbnRyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FkZFNldEVudHJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXBwbHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UmVkdWNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlTb21lLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0RlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc29jR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ2FzdFBhdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ2xvbmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRmluZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGaW5kSW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUhhc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzRXF1YWwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNFcXVhbERlZXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNNYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJdGVyYXRlZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5RGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTbGljZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1BhaXJzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2hlY2tHbG9iYWwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUFycmF5QnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lUmVnRXhwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0V2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQXNzaWduZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbEFycmF5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbE9iamVjdHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRNYXRjaERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pbmRleEtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUJ5VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNIb3N0T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSXRlcmF0ZWVDYWxsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzU3RyaWN0Q29tcGFyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3BhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2Nsb25lRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvY29uc3RhbnQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9maW5kLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9nZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2hhc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc05hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNQbGFpbk9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2xhc3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL25vb3AuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9yZXN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b0ludGVnZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b1BhaXJzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdW5pcXVlSWQuanMiLCJub2RlX21vZHVsZXMvbWluaS1zaWduYWxzL2xpYi9taW5pLXNpZ25hbHMuanMiLCJub2RlX21vZHVsZXMvcmVkdXgvbGliL2FwcGx5TWlkZGxld2FyZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC9saWIvYmluZEFjdGlvbkNyZWF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4L2xpYi9jb21iaW5lUmVkdWNlcnMuanMiLCJub2RlX21vZHVsZXMvcmVkdXgvbGliL2NvbXBvc2UuanMiLCJub2RlX21vZHVsZXMvcmVkdXgvbGliL2NyZWF0ZVN0b3JlLmpzIiwibm9kZV9tb2R1bGVzL3JlZHV4L2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1eC9saWIvdXRpbHMvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9zbmFiYmRvbS9oLmpzIiwibm9kZV9tb2R1bGVzL3NuYWJiZG9tL2h0bWxkb21hcGkuanMiLCJub2RlX21vZHVsZXMvc25hYmJkb20vaXMuanMiLCJub2RlX21vZHVsZXMvc25hYmJkb20vbW9kdWxlcy9hdHRyaWJ1dGVzLmpzIiwibm9kZV9tb2R1bGVzL3NuYWJiZG9tL21vZHVsZXMvY2xhc3MuanMiLCJub2RlX21vZHVsZXMvc25hYmJkb20vbW9kdWxlcy9ldmVudGxpc3RlbmVycy5qcyIsIm5vZGVfbW9kdWxlcy9zbmFiYmRvbS9tb2R1bGVzL3Byb3BzLmpzIiwibm9kZV9tb2R1bGVzL3NuYWJiZG9tL21vZHVsZXMvc3R5bGUuanMiLCJub2RlX21vZHVsZXMvc25hYmJkb20vc25hYmJkb20uanMiLCJub2RlX21vZHVsZXMvc25hYmJkb20vdm5vZGUuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvQW55LmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvQm9vbGVhbi5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvRGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvRXJyb3IuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL0Z1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9OaWwuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL051bWJlci5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9SZWdFeHAuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2RlY2xhcmUuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2RpY3QuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2VudW1zLmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9mYWlsLmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9mb3JiaWROZXdPcGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvZnVuYy5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvZ2V0RnVuY3Rpb25OYW1lLmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9nZXRUeXBlTmFtZS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvaW50ZXJzZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9pcnJlZHVjaWJsZS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvaXMuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2lzQm9vbGVhbi5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvaXNJZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvaXNNYXliZS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvaXNOaWwuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2lzTnVtYmVyLmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9pc09iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvaXNTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2lzU3RydWN0LmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9pc1R5cGUuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2lzVHlwZU5hbWUuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2lzVW5pb24uanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL2xpc3QuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL21hdGNoLmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi9tYXliZS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvbWl4aW4uanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL3JlZmluZW1lbnQuanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL3N0cmluZ2lmeS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvc3RydWN0LmpzIiwibm9kZV9tb2R1bGVzL3Rjb21iLXZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL3Rjb21iL2xpYi90dXBsZS5qcyIsIm5vZGVfbW9kdWxlcy90Y29tYi12YWxpZGF0aW9uL25vZGVfbW9kdWxlcy90Y29tYi9saWIvdW5pb24uanMiLCJub2RlX21vZHVsZXMvdGNvbWItdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvdGNvbWIvbGliL3VwZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2NvbXBvbmVudC1zbmFiYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7O2VBT2dDLFFBQVEsNkJBQVI7O0lBQTFCO0lBQVc7SUFBRztJQUNkLE1BQXFCLFFBQXJCO0lBQUssT0FBZ0IsUUFBaEI7SUFBTSxJQUFVLFFBQVY7SUFBRyxLQUFPLFFBQVA7O0FBQ3BCLElBQUksUUFBUSxRQUFRLFlBQVIsRUFBc0IsS0FBdEI7QUFDWixJQUFJLGdCQUFnQixRQUFRLGtCQUFSLEVBQTRCLGFBQTVCO0FBQ3BCLElBQUksTUFBTSxVQUFVLE1BQVYsQ0FBaUI7QUFDdkIsVUFBTSxnQkFBVztBQUNiLGFBQUssYUFBTCxHQUFxQixLQUFyQixDQURhO0tBQVg7QUFHTix1QkFBbUIsNkJBQVc7QUFDMUIsWUFBSSxRQUFRLFVBQVUsS0FBVixDQURjOztBQUcxQixhQUFLLFdBQUwsR0FBbUIsTUFBTSxTQUFOLENBQWdCLFlBQVc7QUFDMUMsaUJBQUssTUFBTCxDQUFZLE1BQU0sUUFBTixHQUFpQixRQUFqQixDQUFaLENBRDBDO1NBQVgsQ0FFakMsSUFGaUMsQ0FFNUIsSUFGNEIsQ0FBaEIsQ0FBbkIsQ0FIMEI7S0FBWDs7QUFRbkIsWUFBUSxnQkFBUyxPQUFULEVBQWtCO0FBQ3RCLGVBQU8sSUFBSSxNQUFKLEVBQVksQ0FDZixLQUFLLFNBQUwsQ0FEZSxFQUVmLEVBQUU7QUFDRSxnQkFBSSxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sZ0JBQU4sRUFBd0IsU0FBUyxNQUFULEVBQWhDLENBQVAsRUFBTjtTQURKLEVBRUcsT0FGSCxDQUZlLEVBS2YsRUFBRTtBQUNFLGdCQUFJLEVBQUUsT0FBTyxNQUFNLGFBQU4sRUFBcUIsVUFBckIsQ0FBUCxFQUFOO1NBREosRUFFRyxXQUZILENBTGUsRUFRZixFQUFFO0FBQ0UscUJBQVMsTUFBTSxhQUFOLEVBQXFCLE1BQXJCLENBQVQ7U0FESixFQUVHLE9BRkgsQ0FSZSxFQVdmLEVBQUU7QUFDRSxnQkFBSSxFQUFFLE9BQU8sTUFBTSxhQUFOLEVBQXFCLE1BQXJCLENBQVAsRUFBTjtTQURKLEVBRUcsT0FGSCxDQVhlLEVBY2YsR0FBRyxFQUFILENBZGUsRUFlZixLQUFLLGNBQUwsQ0FBb0IsT0FBcEIsQ0FmZSxDQUFaLENBQVAsQ0FEc0I7S0FBbEI7O0FBb0JSLG9CQUFnQiwwQkFBVztBQUN2QixZQUFJLFFBQVEsVUFBVSxLQUFWLENBQWdCLFFBQWhCLEVBQVIsQ0FEbUI7O0FBR3ZCLGdCQUFRLEtBQUssS0FBTCxDQUFXLE9BQVg7QUFDSixpQkFBSyxVQUFMO0FBQ0ksb0JBQUksV0FBVyxRQUFRLGdDQUFSLENBQVgsQ0FEUjtBQUVJLHVCQUFPLEVBQUUsUUFBRixFQUFZLEVBQUUsT0FBTyxNQUFNLFFBQU4sRUFBckIsQ0FBUCxDQUZKOzs7QUFESixpQkFNUyxNQUFMO0FBQ0ksdUJBQU8sRUFBRSxLQUFGLEVBQVMsTUFBVCxDQUFQLENBREo7QUFOSixpQkFRUyxNQUFMO0FBQ0ksb0JBQUksT0FBTyxRQUFRLGdCQUFSLENBQVAsQ0FEUjtBQUVJLHVCQUFPLEVBQUUsSUFBRixFQUFRLEVBQUUsT0FBTyxNQUFNLElBQU4sRUFBakIsQ0FBUCxDQUZKO0FBUko7QUFZUSx1QkFBTyxFQUFFLEtBQUYsRUFBUyxTQUFULENBQVAsQ0FESjtBQVhKLFNBSHVCO0tBQVg7Q0FoQ1YsQ0FBTjs7QUFvREosT0FBTyxPQUFQLEdBQWlCLEdBQWpCOzs7Ozs7QUM1REE7O0FBRUEsSUFBSSxlQUFlLFFBQVEsMkJBQVIsRUFBcUMsV0FBckM7O0FBRW5CLFFBQVEsVUFBUixHQUFxQixVQUFTLEtBQVQsRUFBZ0I7QUFDakMsVUFBTSxRQUFOLENBQWU7QUFDWCxjQUFNLGFBQWEsV0FBYjtLQURWLEVBRGlDO0NBQWhCO0FBS3JCLFFBQVEsWUFBUixHQUF1QixVQUFTLEtBQVQsRUFBZ0I7QUFDbkMsVUFBTSxRQUFOLENBQWU7QUFDWCxjQUFNLGFBQWEsYUFBYjtLQURWLEVBRG1DO0NBQWhCO0FBS3ZCLFFBQVEsYUFBUixHQUF3QixVQUFTLEtBQVQsRUFBZ0IsRUFBaEIsRUFBb0I7QUFDeEMsVUFBTSxRQUFOLENBQWU7QUFDWCxjQUFNLGFBQWEsY0FBYjtBQUNOLFlBQUksRUFBSjtLQUZKLEVBRHdDO0NBQXBCO0FBTXhCLFFBQVEsZ0JBQVIsR0FBMkIsVUFBUyxLQUFULEVBQWdCLEVBQWhCLEVBQW9CO0FBQzNDLFVBQU0sUUFBTixDQUFlO0FBQ1gsY0FBTSxhQUFhLGlCQUFiO0FBQ04sWUFBSSxFQUFKO0tBRkosRUFEMkM7Q0FBcEI7QUFNM0IsUUFBUSxnQkFBUixHQUEyQixVQUFTLEtBQVQsRUFBZ0IsRUFBaEIsRUFBb0I7QUFDM0MsVUFBTSxRQUFOLENBQWU7QUFDWCxjQUFNLGFBQWEsaUJBQWI7QUFDTixZQUFJLEVBQUo7S0FGSixFQUQyQztDQUFwQjs7O0FDN0IzQjs7Ozs7ZUFLOEIsUUFBUSxnQ0FBUjs7SUFBeEI7SUFBVztJQUFHOztBQUNwQixJQUFJLFFBQVEsUUFBUSxlQUFSLEVBQXlCLEtBQXpCOztBQUVaLElBQUksVUFBVSxRQUFRLGNBQVIsQ0FBVjtBQUNKLElBQUksVUFBVSxRQUFRLGNBQVIsQ0FBVjs7QUFFSixJQUFJLGNBQWMsVUFBVSxNQUFWLENBQWlCO0FBQy9CLFVBQU0sZ0JBQVc7QUFDYixhQUFLLGFBQUwsR0FBcUIsVUFBckIsQ0FEYTtLQUFYO0FBR04sdUJBQW1CLDZCQUFXO0FBQzFCLFlBQUksUUFBUSxVQUFVLEtBQVYsQ0FEYzs7QUFHMUIsYUFBSyxXQUFMLEdBQW1CLE1BQU0sU0FBTixDQUFnQixZQUFXOztBQUUxQyxpQkFBSyxNQUFMLENBQVksTUFBTSxRQUFOLEdBQWlCLFFBQWpCLENBQVosQ0FGMEM7U0FBWCxDQUdqQyxJQUhpQyxDQUc1QixJQUg0QixDQUFoQixDQUFuQixDQUgwQjtLQUFYOztBQVNuQiwwQkFBc0IsZ0NBQVc7QUFDN0IsYUFBSyxXQUFMLEdBRDZCO0tBQVg7O0FBSXRCLFlBQVEsZ0JBQVMsT0FBVCxFQUFrQjtBQUN0QixlQUFPLEVBQUUsY0FBRixFQUFrQixDQUNyQixFQUFFLFFBQUYsRUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLE1BQU0sUUFBUSxVQUFSLENBQWIsRUFBTixFQUFkLEVBQTBELEtBQTFELENBRHFCLEVBRXJCLEVBQUUsUUFBRixFQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sTUFBTSxRQUFRLFlBQVIsQ0FBYixFQUFOLEVBQWQsRUFBNEQsT0FBNUQsQ0FGcUIsRUFHckIsRUFBRSxJQUFGLENBSHFCLEVBSXJCLEVBQUUsa0JBQUYsRUFBc0IsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixHQUFwQixDQUF3QixVQUFTLElBQVQsRUFBZTtBQUN6RCxtQkFBTyxLQUFLLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEIsSUFBOUIsQ0FBUCxDQUR5RDtTQUFmLENBRTVDLElBRjRDLENBRXZDLElBRnVDLENBQXhCLENBQXRCLENBSnFCLENBQWxCLENBQVAsQ0FEc0I7S0FBbEI7O0FBV1IscUJBQWlCLHlCQUFTLE9BQVQsRUFBa0IsSUFBbEIsRUFBd0I7QUFDckMsZUFBTyxFQUFFLGtCQUFGLEVBQXNCLENBQ3pCLEVBQUUsZUFBRixFQUFtQjtBQUNmLGdCQUFJLEVBQUUsT0FBTyxNQUFNLFFBQVEsYUFBUixFQUF1QixLQUFLLEVBQUwsQ0FBcEMsRUFBTjtTQURKLEVBRUcsUUFGSCxDQUR5QixFQUl6QixNQUFNLFlBQVksS0FBSyxFQUFMLEVBQVMsT0FBM0IsRUFBb0MsSUFBcEMsRUFBMEM7QUFDdEMseUJBQWEsTUFBTSxRQUFRLGdCQUFSLEVBQTBCLEtBQUssRUFBTCxDQUE3QztBQUNBLHlCQUFhLE1BQU0sUUFBUSxnQkFBUixFQUEwQixLQUFLLEVBQUwsQ0FBN0M7U0FGSixDQUp5QixFQVF6QixFQUFFLElBQUYsQ0FSeUIsQ0FBdEIsQ0FBUCxDQURxQztLQUF4QjtDQTVCSCxDQUFkOztBQTBDSixPQUFPLE9BQVAsR0FBaUIsV0FBakI7OztBQ3JEQTs7Ozs7ZUFLOEIsUUFBUSxnQ0FBUjs7SUFBeEI7SUFBVztJQUFHOztBQUNwQixJQUFJLFVBQVUsVUFBVSxNQUFWLENBQWlCO0FBQzNCLFlBQVEsZ0JBQVMsS0FBVCxFQUFnQixRQUFoQixFQUEwQjtBQUM5QixlQUFPLEVBQUUsU0FBUyxLQUFLLEdBQUwsRUFBVSxDQUN4QixFQUFFLEdBQUYsRUFBTyxLQUFLLEtBQUwsQ0FBVyxFQUFYLEdBQWdCLEdBQWhCLEdBQXNCLEtBQUssR0FBTCxDQURMLEVBRXhCLEVBQUUsUUFBRixFQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sU0FBUyxXQUFULEVBQWIsRUFBZCxFQUFxRCxHQUFyRCxDQUZ3QixFQUd4QixFQUFFLFFBQUYsRUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLFNBQVMsV0FBVCxFQUFiLEVBQWQsRUFBcUQsR0FBckQsQ0FId0IsRUFJeEIsRUFBRSxLQUFGLEVBQVMsWUFBWSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBSkcsQ0FBckIsQ0FBUCxDQUQ4QjtLQUExQjtDQURFLENBQVY7O0FBV0osT0FBTyxPQUFQLEdBQWlCLE9BQWpCOzs7QUNqQkE7O0FBQ0EsSUFBSSxjQUFjLFFBQVEsV0FBUixHQUFzQjtBQUNwQyxpQkFBYSxhQUFiO0FBQ0EsbUJBQWUsZUFBZjtBQUNBLG9CQUFnQixnQkFBaEI7QUFDQSx1QkFBbUIsbUJBQW5CO0FBQ0EsdUJBQW1CLG1CQUFuQjtDQUxjOztBQVFsQixRQUFRLE9BQVIsR0FBa0IsU0FBUyxlQUFULENBQXlCLEtBQXpCLEVBQWdDLE1BQWhDLEVBQXdDO0FBQ3RELFFBQUksT0FBTyxLQUFQLEtBQWlCLFdBQWpCLEVBQThCO0FBQzlCLGdCQUFRO0FBQ0osb0JBQVEsQ0FBUjtBQUNBLHNCQUFVLEVBQVY7U0FGSixDQUQ4QjtLQUFsQztBQU1BLFlBQVEsT0FBTyxJQUFQO0FBQ0osYUFBSyxZQUFZLFdBQVo7QUFDRCxtQkFBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQWxCLEVBQXlCO0FBQzVCLHdCQUFRLE1BQU0sTUFBTixHQUFlLENBQWY7QUFDUiwwQkFBVSxNQUFNLFFBQU4sQ0FBZSxNQUFmLENBQXNCO0FBQzVCLDZCQUFTLENBQVQ7QUFDQSx3QkFBSSxNQUFNLE1BQU47aUJBRkUsQ0FBVjthQUZHLENBQVAsQ0FESjtBQURKLGFBU1MsWUFBWSxhQUFaO0FBQ0QsbUJBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFsQixFQUF5QjtBQUM1Qix3QkFBUSxDQUFSO0FBQ0EsMEJBQVUsRUFBVjthQUZHLENBQVAsQ0FESjtBQVRKLGFBY1MsWUFBWSxjQUFaO0FBQ0QsbUJBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFsQixFQUF5QjtBQUM1QiwwQkFBVSxNQUFNLFFBQU4sQ0FBZSxNQUFmLENBQXNCLFVBQVMsSUFBVCxFQUFlO0FBQzNDLDJCQUFPLEtBQUssRUFBTCxLQUFZLE9BQU8sRUFBUCxDQUR3QjtpQkFBZixDQUFoQzthQURHLENBQVAsQ0FESjtBQWRKLGFBb0JTLFlBQVksaUJBQVo7QUFDRCxtQkFBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQWxCLEVBQXlCO0FBQzVCLDBCQUFVLE1BQU0sUUFBTixDQUFlLEdBQWYsQ0FBbUIsVUFBUyxJQUFULEVBQWU7QUFDeEMsd0JBQUksS0FBSyxFQUFMLEtBQVksT0FBTyxFQUFQLEVBQVc7QUFDdkIsK0JBQU8sSUFBUCxDQUR1QjtxQkFBM0I7O0FBSUEsMkJBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixJQUFsQixFQUF3QjtBQUMzQixpQ0FBUyxLQUFLLE9BQUwsR0FBZSxDQUFmO3FCQUROLENBQVAsQ0FMd0M7aUJBQWYsQ0FBN0I7YUFERyxDQUFQLENBREo7QUFwQkosYUFnQ1MsWUFBWSxpQkFBWjtBQUNELG1CQUFPLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBbEIsRUFBeUI7QUFDNUIsMEJBQVUsTUFBTSxRQUFOLENBQWUsR0FBZixDQUFtQixVQUFTLElBQVQsRUFBZTtBQUN4Qyx3QkFBSSxLQUFLLEVBQUwsS0FBWSxPQUFPLEVBQVAsRUFBVztBQUN2QiwrQkFBTyxJQUFQLENBRHVCO3FCQUEzQjs7QUFJQSwyQkFBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLElBQWxCLEVBQXdCO0FBQzNCLGlDQUFTLEtBQUssT0FBTCxHQUFlLENBQWY7cUJBRE4sQ0FBUCxDQUx3QztpQkFBZixDQUE3QjthQURHLENBQVAsQ0FESjtBQWhDSjtBQTZDUSxtQkFBTyxLQUFQLENBREo7QUE1Q0osS0FQc0Q7Q0FBeEM7OztBQ1RsQjs7QUFDQSxJQUFJLGNBQWMsUUFBUSxZQUFSLEdBQXVCO0FBQ3JDLG1CQUFlLGVBQWY7Q0FEYztBQUdsQixJQUFJLElBQUksUUFBUSxrQkFBUixDQUFKO0FBQ0osSUFBSSxXQUFXLEVBQUUsUUFBRjs7QUFFZixTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUIseUJBQXpCLEVBQW9ELElBQXBELEVBQTBEO0FBQ3RELFFBQUksVUFBVSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLFVBQVMsQ0FBVCxFQUFZO0FBQ3RDLGVBQU8sQ0FBQyxFQUFFLE1BQUYsQ0FBUyxFQUFULENBQVksMEJBQTBCLENBQTFCLENBQVosQ0FBRCxDQUQrQjtLQUFaLEVBRTNCLElBRlcsQ0FBVixDQURrRDs7QUFLdEQsWUFBUSx5QkFBUixHQUFvQyx5QkFBcEMsQ0FMc0Q7QUFNdEQsV0FBTyxPQUFQLENBTnNEO0NBQTFEOztBQVNBLElBQUksV0FBVyxVQUFVLEVBQUUsTUFBRixFQUFVLFVBQVMsQ0FBVCxFQUFZO0FBQzNDLFFBQUksQ0FBQyxDQUFELEVBQUk7QUFDSixlQUFPLFVBQVAsQ0FESTtLQUFSO0FBR0EsUUFBSSxFQUFFLE1BQUYsSUFBWSxDQUFaLEVBQWU7QUFDZixlQUFPLG9CQUFQLENBRGU7S0FBbkI7Q0FKK0IsQ0FBL0I7QUFRSixJQUFJLFlBQVksVUFBVSxFQUFFLE1BQUYsRUFBVSxVQUFTLENBQVQsRUFBWTtBQUM1QyxRQUFJLENBQUMsQ0FBRCxFQUFJO0FBQ0osZUFBTyxVQUFQLENBREk7S0FBUjtBQUdBLFFBQUksRUFBRSxNQUFGLElBQVksQ0FBWixFQUFlO0FBQ2YsZUFBTyxnQkFBUCxDQURlO0tBQW5CO0NBSmdDLENBQWhDOztBQVNKLElBQUksU0FBUyxFQUFFLE1BQUYsQ0FBUztBQUNsQixVQUFNLFFBQU47QUFDQSxXQUFPLFNBQVA7QUFDQSxTQUFLLEVBQUUsTUFBRjtDQUhJLENBQVQ7QUFLSixRQUFRLFFBQVIsR0FBbUIsVUFBUyxLQUFULEVBQWdCLENBQWhCLEVBQW1CO0FBQ2xDLE1BQUUsY0FBRixHQURrQztBQUVsQyxRQUFJLFNBQVMsU0FBUztBQUNsQixjQUFNLFNBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxLQUFoQyxDQUFzQyxJQUF0QyxFQUFOO0FBQ0EsZUFBTyxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUMsS0FBakMsQ0FBdUMsSUFBdkMsRUFBUDtBQUNBLGFBQUssT0FBTyxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsS0FBL0IsQ0FBcUMsSUFBckMsRUFBUCxDQUFMO0tBSFMsRUFJVixNQUpVLENBQVQsQ0FGOEI7O0FBUWxDLFVBQU0sUUFBTixDQUFlO0FBQ1gsY0FBTSxZQUFZLGFBQVo7QUFDTixnQkFBUSxNQUFSO0tBRkosRUFSa0M7Q0FBbkI7O0FBY25CLFFBQVEsT0FBUixHQUFrQixVQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0I7QUFDdEMsUUFBSSxPQUFPLEtBQVAsS0FBaUIsV0FBakIsRUFBOEI7QUFDOUIsZ0JBQVE7QUFDSixvQkFBUSxFQUFSO0FBQ0Esb0JBQVE7QUFDSixzQkFBTSxFQUFOO0FBQ0EsdUJBQU8sRUFBUDtBQUNBLHFCQUFLLEVBQUw7YUFISjtBQUtBLHFCQUFTLEVBQVQ7U0FQSixDQUQ4QjtLQUFsQztBQVdBLFlBQVEsT0FBTyxJQUFQO0FBQ0osYUFBSyxZQUFZLGFBQVo7QUFDRCxtQkFBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQWxCLEVBQXlCO0FBQzVCLHdCQUFRLE9BQU8sTUFBUCxDQUFjLE1BQWQ7QUFDUix3QkFBUSxPQUFPLE1BQVAsQ0FBYyxLQUFkO2FBRkwsQ0FBUCxDQURKO0FBREo7QUFPUSxtQkFBTyxLQUFQLENBREo7QUFOSixLQVpzQztDQUF4Qjs7O0FDcERsQjs7Ozs7ZUFJdUIsUUFBUSxnQ0FBUjs7SUFBakI7SUFBVzs7QUFDakIsSUFBSSxRQUFRLFFBQVEsZUFBUixDQUFSO0FBQ0osSUFBSSxPQUFPLFFBQVEsYUFBUixDQUFQO0FBQ0osSUFBSSxRQUFRLE1BQU0sS0FBTjtBQUNaLElBQUksV0FBVyxRQUFRLG1CQUFSLEVBQTZCLFFBQTdCO0FBQ2YsSUFBSSxPQUFPLFVBQVUsTUFBVixDQUFpQjtBQUN4QixVQUFNLGdCQUFXO0FBQ2IsYUFBSyxhQUFMLEdBQXFCLE1BQXJCLENBRGE7S0FBWDtBQUdOLHVCQUFtQiw2QkFBVztBQUMxQixZQUFJLFFBQVEsVUFBVSxLQUFWLENBRGM7O0FBRzFCLGFBQUssV0FBTCxHQUFtQixNQUFNLFNBQU4sQ0FBZ0IsWUFBVztBQUMxQyxpQkFBSyxNQUFMLENBQVksTUFBTSxRQUFOLEdBQWlCLElBQWpCLENBQVosQ0FEMEM7U0FBWCxDQUVqQyxJQUZpQyxDQUU1QixJQUY0QixDQUFoQixDQUFuQixDQUgwQjtLQUFYO0FBT25CLDBCQUFzQixnQ0FBVztBQUM3QixhQUFLLFdBQUwsR0FENkI7S0FBWDtBQUd0QixZQUFRLGtCQUFXO0FBQ2YsWUFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FERTs7QUFHZixlQUFPLEVBQUUsTUFBRixFQUFVO0FBQ2IsZ0JBQUk7QUFDQSx3QkFBUSxNQUFNLFFBQU4sQ0FBUjtBQUNBLHdCQUFRLE1BQU0sUUFBTixDQUFSO2FBRko7U0FERyxFQUtKLENBQ0MsRUFBRSxPQUFGLEVBQVcsUUFBWCxDQURELEVBRUMsRUFBRSxZQUFGLEVBQWdCLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTixFQUFjLE9BQU8sT0FBTyxJQUFQLEVBQTlCLEVBQWxCLENBRkQsRUFHQyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FIRCxFQUlDLEVBQUUsSUFBRixDQUpELEVBS0MsRUFBRSxPQUFGLEVBQVcsU0FBWCxDQUxELEVBTUMsRUFBRSxhQUFGLEVBQWlCLEVBQUUsT0FBTyxFQUFFLE1BQU0sT0FBTixFQUFlLE9BQU8sT0FBTyxLQUFQLEVBQS9CLEVBQW5CLENBTkQsRUFPQyxLQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FQRCxFQVFDLEVBQUUsSUFBRixDQVJELEVBU0MsRUFBRSxPQUFGLEVBQVcsT0FBWCxDQVRELEVBVUMsRUFBRSxXQUFGLEVBQWUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFOLEVBQWMsT0FBTyxPQUFPLEdBQVAsRUFBOUIsRUFBakIsQ0FWRCxFQVdDLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQVhELEVBWUMsRUFBRSxJQUFGLENBWkQsRUFhQyxFQUFFLE9BQUYsRUFBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLFFBQU4sRUFBVCxFQUFiLEVBQTBDLFFBQTFDLENBYkQsQ0FMSSxDQUFQLENBSGU7S0FBWDtBQXdCUixrQkFBYyxzQkFBUyxFQUFULEVBQWE7QUFDdkIsWUFBSSxRQUFRLEtBQUssS0FBSyxLQUFMLENBQVcsTUFBWCxFQUFtQixVQUFTLEtBQVQsRUFBZ0I7QUFDaEQsbUJBQU8sTUFBTSxJQUFOLENBQVcsQ0FBWCxNQUFrQixFQUFsQixDQUR5QztTQUFoQixDQUFoQyxDQURtQjs7QUFLdkIsZUFBTyxFQUFFLE1BQUYsRUFBVSxRQUFRLE1BQU0sT0FBTixHQUFnQixFQUF4QixDQUFqQixDQUx1QjtLQUFiO0NBdENQLENBQVA7O0FBK0NKLE9BQU8sT0FBUCxHQUFpQixJQUFqQjs7O0FDeERBOzs7O2VBRzJCLFFBQVEsNkJBQVI7O0lBQXJCO0lBQVc7O0FBQ2pCLElBQUksUUFBUSxRQUFRLFlBQVIsRUFBc0IsS0FBdEI7QUFDWixJQUFJLE9BQU8sU0FBUyxjQUFULENBQXdCLE1BQXhCLENBQVA7QUFDSixJQUFJLEdBQUo7QUFDQSxVQUFVLEtBQVYsR0FBa0IsS0FBbEI7QUFDQSxVQUFVLFFBQVYsR0FBcUIsTUFBTSxRQUFOOztBQUVyQixNQUFNLFFBQVEsVUFBUixDQUFOOzs7QUFHQSxNQUFNLElBQU4sRUFBWSxHQUFaLEVBQWlCLE1BQU0sUUFBTixHQUFpQixRQUFqQixDQUFqQjs7O0FDYkE7O0FBQ0EsSUFBSSxjQUFjLFFBQVEsV0FBUixHQUFzQjtBQUNwQyxVQUFNLGFBQU47QUFDQSxXQUFPLGNBQVA7QUFDQSxlQUFXLGtCQUFYO0NBSGM7O0FBTWxCLFFBQVEsT0FBUixHQUFrQixVQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0I7QUFDdEMsUUFBSSxlQUFlLEVBQWYsQ0FEa0M7O0FBR3RDLFFBQUksT0FBTyxLQUFQLEtBQWlCLFdBQWpCLEVBQThCO0FBQzlCLGdCQUFRLFlBQVIsQ0FEOEI7S0FBbEM7O0FBSUEsWUFBUSxPQUFPLElBQVA7QUFDSixhQUFLLFlBQVksSUFBWjtBQUNELGdCQUFJLE1BQU0sTUFBTixLQUFpQixDQUFqQixFQUFvQjtBQUNwQix1QkFBTyxDQUFDO0FBQ0osd0JBQUksQ0FBSjtBQUNBLDJCQUFPLENBQVA7aUJBRkcsRUFHSjtBQUNDLHdCQUFJLENBQUo7QUFDQSwyQkFBTyxJQUFQO2lCQUxHLENBQVAsQ0FEb0I7YUFBeEI7QUFTQSxtQkFBTyxLQUFQLENBVko7QUFESixhQVlTLFlBQVksS0FBWjtBQUNELG1CQUFPLFlBQVAsQ0FESjtBQVpKLGFBY1MsWUFBWSxTQUFaO0FBQ0Qsa0JBQU0sT0FBTixDQUFjLFVBQVMsT0FBVCxFQUFrQixLQUFsQixFQUF5QjtBQUNuQyxvQkFBSSxRQUFRLEVBQVIsS0FBZSxPQUFPLEVBQVAsRUFBVztBQUMxQiwwQkFBTSxLQUFOLElBQWU7QUFDWCw0QkFBSSxPQUFPLEVBQVA7QUFDSiwrQkFBTyxRQUFRLEtBQVIsR0FBZ0IsQ0FBaEI7cUJBRlgsQ0FEMEI7aUJBQTlCO2FBRFUsQ0FBZCxDQURKO0FBU0ksbUJBQU8sS0FBUCxDQVRKO0FBZEo7QUF5QlEsbUJBQU8sS0FBUCxDQURKO0FBeEJKLEtBUHNDO0NBQXhCOzs7QUNQbEI7O0FBQ0EsSUFBSSxjQUFjLFFBQVEsWUFBUixHQUF1QjtBQUNyQyxvQkFBZ0IsZ0JBQWhCO0NBRGM7O0FBSWxCLFFBQVEsYUFBUixHQUF3QixVQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDN0MsVUFBTSxRQUFOLENBQWU7QUFDWCxjQUFNLFlBQVksY0FBWjtBQUNOLGlCQUFTLE9BQVQ7S0FGSixFQUQ2QztDQUF6Qjs7QUFPeEIsUUFBUSxPQUFSLEdBQWtCLFVBQVMsS0FBVCxFQUFnQixNQUFoQixFQUF3QjtBQUN0QyxRQUFJLE9BQU8sS0FBUCxLQUFpQixXQUFqQixFQUE4QjtBQUM5QixnQkFBUTtBQUNKLHFCQUFTLFVBQVQ7U0FESixDQUQ4QjtLQUFsQztBQUtBLFlBQVEsT0FBTyxJQUFQO0FBQ0osYUFBSyxZQUFZLGNBQVo7QUFDRCxnQkFBSSxPQUFPLE9BQVAsS0FBbUIsTUFBTSxPQUFOLEVBQWU7QUFDbEMsdUJBQU8sS0FBUCxDQURrQzthQUF0QztBQUdBLG1CQUFPLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBbEIsRUFBeUI7QUFDNUIseUJBQVMsT0FBTyxPQUFQO2FBRE4sQ0FBUCxDQUpKO0FBREo7QUFTUSxtQkFBTyxLQUFQLENBREo7QUFSSixLQU5zQztDQUF4Qjs7O0FDWmxCOzs7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFSO0FBQ0osSUFBSSxrQkFBa0IsTUFBTSxlQUFOO0FBQ3RCLElBQUksa0JBQWtCLE1BQU0sZUFBTjtBQUN0QixJQUFJLFVBQVUsTUFBTSxPQUFOOzs7O0FBSWQsSUFBSSxTQUFTLFNBQVMsTUFBVCxDQUFnQixLQUFoQixFQUF1QjtBQUNoQyxRQUFJLFdBQVcsTUFBTSxRQUFOLENBRGlCOztBQUdoQyxXQUFPLFVBQUMsSUFBRDtlQUFVLFVBQUMsTUFBRCxFQUFZO0FBQ3pCLG9CQUFRLElBQVIsQ0FBYSxlQUFiLEVBQThCLE1BQTlCOzs7QUFEeUIsZ0JBSXJCLGNBQWMsS0FBSyxNQUFMLENBQWQsQ0FKcUI7O0FBTXpCLG9CQUFRLElBQVIsQ0FBYSxzQkFBYixFQUFxQyxVQUFyQzs7OztBQU55QixtQkFVbEIsV0FBUCxDQVZ5QjtTQUFaO0tBQVYsQ0FIeUI7Q0FBdkI7OztBQWtCYixJQUFJLGFBQWEsUUFBUSxrQkFBUixFQUE0QixPQUE1QjtBQUNqQixJQUFJLGNBQWMsUUFBUSw4QkFBUixFQUF3QyxPQUF4QztBQUNsQixJQUFJLHFCQUFxQixRQUFRLHdDQUFSLEVBQWtELE9BQWxEO0FBQ3pCLElBQUksVUFBVSxnQkFBZ0I7QUFDMUIsY0FBVSxVQUFWO0FBQ0EsY0FBVSxrQkFBVjtBQUNBLFVBQU0sV0FBTjtBQUNBLFVBQU0sUUFBUSx3QkFBUixFQUFrQyxPQUFsQztDQUpJLENBQVY7OztBQVFKLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0IsT0FBbEIsRUFBMkIsUUFDbkMsZ0JBQWdCLE1BQWhCLENBRG1DLEVBRW5DLE9BQU8saUJBQVAsR0FBMkIsT0FBTyxpQkFBUCxFQUEzQixHQUF3RCxVQUFTLENBQVQsRUFBWTtBQUNoRSxXQUFPLENBQVAsQ0FEZ0U7Q0FBWixDQUZoRCxDQUFSOztBQU9KLFFBQVEsS0FBUixHQUFnQixLQUFoQjs7Ozs7Ozs7OztBQVVBLFFBQVEsS0FBUixHQUFnQixVQUFTLEVBQVQsRUFBYTtBQUN6QixRQUFJLFFBQVEsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBRGE7QUFFekIsUUFBSSxPQUFPLE1BQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsQ0FBdEIsQ0FBUCxDQUZxQjs7QUFJekIsUUFBSSxPQUFPLEVBQVAsS0FBYyxVQUFkLEVBQTBCO0FBQzFCLGVBQU8sWUFBVztBQUNkLG1CQUFPLEdBQUcsS0FBSCxDQUFTLElBQVQsRUFBZSxDQUFDLEtBQUQsRUFBUSxNQUFSLENBQWUsS0FBSyxNQUFMLENBQVksTUFBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixDQUF0QixDQUFaLENBQWYsQ0FBZixDQUFQLENBRGM7U0FBWCxDQURtQjtLQUE5QjtBQUtBLFFBQUksUUFBTywrQ0FBUCxLQUFjLFFBQWQsSUFBMEIsT0FBTyxJQUFQLElBQWUsT0FBTyxFQUFQLEtBQWMsV0FBZCxFQUEyQjtBQUNwRSxjQUFNLElBQUksS0FBSixDQUFVLGdFQUFnRSxPQUFPLE1BQVAsR0FBZ0IsTUFBaEIsVUFBZ0MsOENBQWhDLENBQWhFLENBQWhCLENBRG9FO0tBQXhFOztBQUlBLFFBQUksUUFBTywrQ0FBUCxLQUFjLFFBQWQsRUFBd0I7QUFDeEIsZUFBTyxZQUFXO0FBQ2QsbUJBQU8sTUFBTSxRQUFOLENBQWUsRUFBZixDQUFQLENBRGM7U0FBWCxDQURpQjtLQUE1QjtDQWJZOztBQW9CaEIsUUFBUSxNQUFSLEdBQWlCLFVBQVMsRUFBVCxFQUFhO0FBQzFCLFFBQUksUUFBUSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FEYztBQUUxQixRQUFJLE9BQU8sTUFBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixDQUF0QixDQUFQLENBRnNCOztBQUkxQixRQUFJLE9BQU8sRUFBUCxLQUFjLFVBQWQsRUFBMEI7QUFDMUIsZUFBTyxZQUFXO0FBQ2QsbUJBQU8sR0FBRyxLQUFILENBQVMsSUFBVCxFQUFlLEtBQUssTUFBTCxDQUFZLE1BQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsQ0FBdEIsQ0FBWixDQUFmLENBQVAsQ0FEYztTQUFYLENBRG1CO0tBQTlCO0FBS0EsUUFBSSxRQUFPLCtDQUFQLEtBQWMsUUFBZCxJQUEwQixPQUFPLElBQVAsSUFBZSxPQUFPLEVBQVAsS0FBYyxXQUFkLEVBQTJCO0FBQ3BFLGNBQU0sSUFBSSxLQUFKLENBQVUsZ0VBQWdFLE9BQU8sTUFBUCxHQUFnQixNQUFoQixVQUFnQyw4Q0FBaEMsQ0FBaEUsQ0FBaEIsQ0FEb0U7S0FBeEU7O0FBSUEsUUFBSSxRQUFPLCtDQUFQLEtBQWMsUUFBZCxFQUF3QjtBQUN4QixlQUFPLFlBQVc7QUFDZCxtQkFBTyxNQUFNLFFBQU4sQ0FBZSxFQUFmLENBQVAsQ0FEYztTQUFYLENBRGlCO0tBQTVCO0NBYmE7OztBQzNFakI7OztBQUVBLFFBQVEsR0FBUixHQUFjLFFBQVEsb0JBQVIsQ0FBZDs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxREE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDakhBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBOztBQUVBLElBQUksV0FBVyxRQUFRLFVBQVIsQ0FBWDtBQUNKLElBQUksUUFBUSxTQUFTLElBQVQsQ0FBYyxDQUN0QixRQUFRLHdCQUFSLENBRHNCLEVBRXRCLFFBQVEsd0JBQVIsQ0FGc0IsRUFHdEIsUUFBUSw2QkFBUixDQUhzQixFQUl0QixRQUFRLHdCQUFSLENBSnNCLEVBS3RCLFFBQVEsaUNBQVIsQ0FMc0IsQ0FBZCxDQUFSO0FBT0osSUFBSSxRQUFRLFFBQVEsWUFBUixDQUFSO0FBQ0osSUFBSSxVQUFVLFFBQVEscUJBQVIsRUFBK0IsS0FBL0IsQ0FBVjtBQUNKLElBQUksU0FBUyxRQUFRLGNBQVIsQ0FBVDtBQUNKLElBQUksV0FBVyxRQUFRLGlCQUFSLENBQVg7QUFDSixJQUFJLE9BQU8sUUFBUSxhQUFSLENBQVA7QUFDSixJQUFJLFNBQVMsUUFBUSxlQUFSLENBQVQ7QUFDSixJQUFJLFFBQVEsUUFBUSxrQkFBUixDQUFSO0FBQ0osSUFBSSxXQUFXLFFBQVEsVUFBUixDQUFYOztBQUVKLFNBQVMsU0FBVCxHQUFxQjtBQUNqQixRQUFJLEVBQUUsZ0JBQWdCLFNBQWhCLENBQUYsRUFBOEI7QUFDOUIsZUFBTyxJQUFJLFNBQUosRUFBUCxDQUQ4QjtLQUFsQztBQUdBLFNBQUssYUFBTCxHQUFxQixXQUFyQixDQUppQjtBQUtqQixTQUFLLEtBQUwsR0FBYSxFQUFiLENBTGlCO0FBTWpCLFNBQUssS0FBTCxHQUFhLElBQWIsQ0FOaUI7QUFPakIsU0FBSyxLQUFMLEdBQWEsS0FBYixDQVBpQjtBQVFqQixTQUFLLFlBQUwsR0FBb0IsSUFBcEIsQ0FSaUI7QUFTakIsU0FBSyxTQUFMLEdBQWlCLEtBQWpCLENBVGlCO0FBVWpCLFNBQUssT0FBTCxHQUFlO0FBQ1gsbUJBQVcsSUFBSSxNQUFKLEVBQVg7QUFDQSxrQkFBVSxJQUFJLE1BQUosRUFBVjtBQUNBLG9CQUFZLElBQUksTUFBSixFQUFaO0FBQ0EsbUJBQVcsSUFBSSxNQUFKLEVBQVg7QUFDQSxxQkFBYSxJQUFJLE1BQUosRUFBYjtLQUxKLENBVmlCO0FBaUJqQixTQUFLLElBQUwsR0FqQmlCO0FBa0JqQixTQUFLLEdBQUwsR0FBVyxTQUFTLEtBQUssYUFBTCxHQUFxQixHQUFyQixDQUFwQixDQWxCaUI7Q0FBckI7O0FBcUJBLFVBQVUsTUFBVixHQUFtQixVQUFTLEtBQVQsRUFBZ0I7QUFDL0IsUUFBSSxRQUFRLFNBQVIsS0FBUSxHQUFXO0FBQ25CLFlBQUksRUFBRSxnQkFBZ0IsU0FBaEIsQ0FBRixFQUE4QjtBQUM5QixtQkFBTyxJQUFJLEtBQUosRUFBUCxDQUQ4QjtTQUFsQztBQUdBLGtCQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsRUFBc0IsU0FBdEIsRUFKbUI7S0FBWCxDQURtQjs7QUFRL0IsYUFBUyxLQUFULEVBQWdCLFNBQWhCLEVBUitCO0FBUy9CLFdBQU8sTUFBTSxTQUFOLEVBQWlCLEtBQXhCLEVBVCtCO0FBVS9CLFdBQU8sS0FBUCxDQVYrQjtDQUFoQjs7QUFhbkIsVUFBVSxTQUFWLENBQW9CLElBQXBCLEdBQTJCLElBQTNCOztBQUVBLFVBQVUsU0FBVixDQUFvQixNQUFwQixHQUE2QixJQUE3Qjs7QUFFQSxVQUFVLFNBQVYsQ0FBb0Isa0JBQXBCLEdBQXlDLElBQXpDOztBQUVBLFVBQVUsU0FBVixDQUFvQixpQkFBcEIsR0FBd0MsSUFBeEM7O0FBRUEsVUFBVSxTQUFWLENBQW9CLG9CQUFwQixHQUEyQyxJQUEzQzs7QUFFQSxVQUFVLFNBQVYsQ0FBb0IsbUJBQXBCLEdBQTBDLElBQTFDOztBQUVBLFVBQVUsU0FBVixDQUFvQixrQkFBcEIsR0FBeUMsSUFBekM7O0FBRUEsVUFBVSxTQUFWLENBQW9CLHFCQUFwQixHQUE0QyxVQUFTLFNBQVQsRUFBb0I7QUFDNUQsUUFBSSxLQUFLLEtBQUwsS0FBZSxTQUFmLEVBQTBCO0FBQzFCLGVBQU8sS0FBUCxDQUQwQjtLQUE5QjtBQUdBLFdBQU8sSUFBUCxDQUo0RDtDQUFwQjs7QUFPNUMsU0FBUyxLQUFULENBQWUsT0FBZixFQUF3QixLQUF4QixFQUErQjtBQUMzQixRQUFJLFlBQVksTUFBTSxJQUFOLENBQVcsSUFBWCxDQURXOztBQUczQixRQUFJLE1BQU0sSUFBTixDQUFXLElBQVgsRUFBaUI7QUFDakIsZ0JBQVEsSUFBUixDQUFhLHVDQUFiLEVBRGlCO0tBQXJCLE1BRU87QUFDSCxvQkFBWSxNQUFNLElBQU4sQ0FBVyxJQUFYLEdBQWtCLEVBQWxCLENBRFQ7S0FGUDs7QUFNQSxjQUFVLE1BQVYsR0FBbUIsVUFBUyxVQUFULEVBQXFCLEtBQXJCLEVBQTRCOztBQUUzQyxZQUFJLFFBQVEsS0FBUixFQUFlO0FBQ2Ysb0JBQVEsWUFBUixDQUFxQixJQUFyQixDQUEwQixLQUExQixHQUFrQyxLQUFsQyxDQURlO0FBRWYsb0JBQVEsWUFBUixDQUFxQixHQUFyQixHQUEyQixNQUFNLEdBQU4sQ0FGWjtTQUFuQixNQUdPO0FBQ0gsb0JBQVEsWUFBUixHQUF1QixLQUF2QixDQURHO1NBSFA7O0FBT0EsWUFBSSxDQUFDLFFBQVEsU0FBUixFQUFtQjtBQUNwQixvQkFBUSxPQUFSLENBQWdCLFNBQWhCLENBQTBCLFFBQTFCLEdBRG9CO0FBRXBCLG9CQUFRLGtCQUFSLEdBRm9CO0FBR3BCLG9CQUFRLEtBQVIsQ0FBYyxvQkFBZCxFQUFvQyxRQUFRLEdBQVIsQ0FBcEMsQ0FIb0I7U0FBeEI7S0FUZSxDQVRRO0FBd0IzQixjQUFVLE1BQVYsR0FBbUIsVUFBUyxLQUFULEVBQWdCOztBQUUvQixZQUFJLFFBQVEsU0FBUixFQUFtQjtBQUNuQixvQkFBUSxPQUFSLENBQWdCLFNBQWhCLENBQTBCLFFBQTFCLEdBRG1CO0FBRW5CLG9CQUFRLGtCQUFSLEdBRm1CO0FBR25CLG9CQUFRLEtBQVIsQ0FBYyxxQkFBZCxFQUFxQyxRQUFRLEdBQVIsQ0FBckMsQ0FIbUI7U0FBdkIsTUFJTztBQUNILG9CQUFRLFNBQVIsR0FBb0IsSUFBcEIsQ0FERztBQUVILG9CQUFRLE9BQVIsQ0FBZ0IsUUFBaEIsQ0FBeUIsUUFBekIsR0FGRztBQUdILG9CQUFRLGlCQUFSLEdBSEc7QUFJSCxvQkFBUSxLQUFSLENBQWMsbUJBQWQsRUFBbUMsUUFBUSxHQUFSLENBQW5DLENBSkc7U0FKUDtLQUZlLENBeEJRO0FBcUMzQixjQUFVLE9BQVYsR0FBb0IsVUFBUyxLQUFULEVBQWdCO0FBQ2hDLFlBQUksVUFBVSxRQUFRLFlBQVIsRUFBc0I7QUFDaEMsb0JBQVEsT0FBUixDQUFnQixXQUFoQixDQUE0QixRQUE1QixHQURnQztBQUVoQyxvQkFBUSxvQkFBUixHQUZnQztBQUdoQyxvQkFBUSxTQUFSLEdBQW9CLEtBQXBCLENBSGdDO0FBSWhDLG9CQUFRLEtBQVIsQ0FBYyxVQUFkLEVBQTBCLFFBQVEsR0FBUixFQUFhLEtBQXZDLEVBSmdDO1NBQXBDO0tBRGdCLENBckNPO0FBNkMzQixjQUFVLFFBQVYsR0FBcUIsVUFBUyxHQUFULEVBQWMsT0FBZCxFQUF1Qjs7S0FBdkIsQ0E3Q007QUFnRDNCLGNBQVUsU0FBVixHQUFzQixVQUFTLEdBQVQsRUFBYyxPQUFkLEVBQXVCOztBQUV6QyxnQkFBUSxPQUFSLENBQWdCLFNBQWhCLENBQTBCLFFBQTFCLEdBRnlDO0FBR3pDLGdCQUFRLGtCQUFSLEdBSHlDO0FBSXpDLGdCQUFRLEtBQVIsQ0FBYyxxQkFBZCxFQUFxQyxRQUFRLEdBQVIsQ0FBckMsQ0FKeUM7S0FBdkIsQ0FoREs7Q0FBL0I7O0FBd0RBLFVBQVUsU0FBVixDQUFvQixLQUFwQixHQUE0QixVQUFTLEtBQVQsRUFBZ0IsUUFBaEIsRUFBMEI7O0FBRWxELFFBQUksS0FBSyxTQUFMLEVBQWdCO0FBQ2hCLGdCQUFRLEtBQVIsQ0FBYyxlQUFkLEVBRGdCO0tBQXBCO0FBR0EsU0FBSyxLQUFMLEdBQWEsS0FBYixDQUxrRDtBQU1sRCxTQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0FOa0Q7QUFPbEQsU0FBSyxLQUFMLEdBQWEsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixRQUFuQixDQUFiLENBUGtEO0FBUWxELFFBQUksQ0FBQyxLQUFLLEtBQUwsRUFBWTtBQUNiLGdCQUFRLElBQVIsQ0FBYSxrQkFBYixFQURhO0tBQWpCO0FBR0EsVUFBTSxJQUFOLEVBQVksS0FBSyxLQUFMLENBQVosQ0FYa0Q7QUFZbEQsV0FBTyxLQUFLLEtBQUwsQ0FaMkM7Q0FBMUI7O0FBZTVCLFVBQVUsU0FBVixDQUFvQixNQUFwQixHQUE2QixVQUFTLFNBQVQsRUFBb0IsUUFBcEIsRUFBOEI7QUFDdkQsUUFBSSxVQUFVLEtBQUssS0FBTCxDQUR5QztBQUV2RCxRQUFJLEtBQUo7OztBQUZ1RCxRQUtuRCxPQUFPLFFBQVAsS0FBb0IsV0FBcEIsRUFBaUM7QUFDakMsYUFBSyxRQUFMLEdBQWdCLFFBQWhCLENBRGlDO0tBQXJDOzs7QUFMdUQsUUFVbkQsQ0FBQyxTQUFELEVBQVk7QUFDWixvQkFBWSxLQUFLLEtBQUwsQ0FEQTtLQUFoQjs7QUFJQSxRQUFJLEtBQUssU0FBTCxFQUFnQjtBQUNoQixZQUFJLEtBQUsscUJBQUwsQ0FBMkIsU0FBM0IsQ0FBSixFQUEyQztBQUN2QyxpQkFBSyxPQUFMLENBQWEsVUFBYixDQUF3QixRQUF4QixDQUFpQyxTQUFqQyxFQUR1QztBQUV2QyxpQkFBSyxtQkFBTCxDQUF5QixTQUF6Qjs7QUFGdUMsZ0JBSXZDLENBQUssS0FBTCxHQUFhLFNBQWI7OztBQUp1QyxpQkFPdkMsR0FBUSxLQUFLLE1BQUwsQ0FBWSxLQUFLLEtBQUwsRUFBWSxLQUFLLFFBQUwsQ0FBaEMsQ0FQdUM7QUFRdkMsZ0JBQUksQ0FBQyxLQUFLLEtBQUwsRUFBWTtBQUNiLHdCQUFRLElBQVIsQ0FBYSxrQkFBYixFQURhO2FBQWpCO0FBR0Esa0JBQU0sSUFBTixFQUFZLEtBQVosRUFYdUM7QUFZdkMsaUJBQUssS0FBTCxHQUFhLE1BQU0sT0FBTixFQUFlLEtBQWYsQ0FBYixDQVp1QztBQWF2QyxpQkFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLEtBQXZCLEdBQStCLEtBQUssS0FBTCxDQWJRO1NBQTNDLE1BY087QUFDSCxvQkFBUSxLQUFSLENBQWMsVUFBZCxFQUEwQixLQUFLLEdBQUwsQ0FBMUIsQ0FERztTQWRQO0tBREosTUFrQk87QUFDSCxnQkFBUSxJQUFSLENBQWEsK0JBQWIsRUFBOEMsS0FBSyxHQUFMLENBQTlDLENBREc7S0FsQlA7Q0FkeUI7OztBQXNDN0IsT0FBTyxPQUFQLENBQWUsT0FBZixHQUF5QixPQUF6QjtBQUNBLE9BQU8sT0FBUCxDQUFlLEtBQWYsR0FBdUIsS0FBdkI7QUFDQSxPQUFPLE9BQVAsQ0FBZSxTQUFmLEdBQTJCLFNBQTNCO0FBQ0EsT0FBTyxPQUFQLENBQWUsS0FBZixHQUF1QixVQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCLEtBQXJCLEVBQTRCO0FBQy9DLFFBQUksUUFBUSxPQUFPLEtBQVAsQ0FBYSxLQUFiLENBQVIsQ0FEMkM7QUFFL0MsUUFBSSxPQUFPLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUFQLENBRjJDO0FBRy9DLFNBQUssRUFBTCxHQUFVLHFCQUFWLENBSCtDO0FBSS9DLFVBQU0sS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQU4sRUFBOEIsS0FBOUIsRUFKK0M7QUFLL0MsV0FBTyxLQUFQLENBTCtDO0NBQTVCOztBQVF2QixPQUFPLE9BQVAsQ0FBZSxDQUFmLEdBQW1CLFlBQVc7QUFDMUIsUUFBSSxZQUFZLFVBQVUsQ0FBVixDQUFaLENBRHNCO0FBRTFCLFFBQUksUUFBUSxVQUFVLENBQVYsS0FBZ0IsVUFBVSxDQUFWLEVBQWEsS0FBYixJQUFzQixFQUF0QyxDQUZjO0FBRzFCLFFBQUksV0FBVyxVQUFVLENBQVYsS0FBZ0IsVUFBVSxDQUFWLEVBQWEsRUFBYixJQUFtQixFQUFuQyxDQUhXO0FBSTFCLFFBQUksV0FBVyxVQUFVLENBQVYsQ0FBWCxDQUpzQjs7QUFNMUIsUUFBSSxVQUFVLE1BQVYsS0FBcUIsU0FBckIsRUFBZ0M7QUFDaEMsWUFBSSxNQUFNLEdBQU4sRUFBVztBQUNYLG1CQUFPLFFBQVEsS0FBUixDQUFjLE1BQU0sR0FBTixFQUFXLFNBQXpCLEVBQW9DLEtBQXBDLEVBQTJDLFFBQTNDLEVBQXFELFFBQXJELENBQVAsQ0FEVztTQUFmO0FBR0EsZUFBTyxZQUFZLEtBQVosQ0FBa0IsS0FBbEIsRUFBeUIsUUFBekIsRUFBbUMsUUFBbkMsQ0FBUCxDQUpnQztLQUFwQztBQU1BLFdBQU8sTUFBTSxLQUFOLENBQVksSUFBWixFQUFrQixTQUFsQixDQUFQLENBWjBCO0NBQVg7O0FBZW5CLFNBQVMsSUFBVCxDQUFjLFVBQWQsRUFBMEI7QUFDdEIsUUFBSSxPQUFPLFdBQVcsSUFBWDs7O0FBRFcsY0FJdEIsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXFCLE9BQXJCLEdBQStCLFlBQVc7O0FBRXRDLGFBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsV0FBdEIsQ0FBa0MsUUFBbEMsR0FGc0M7QUFHdEMsYUFBSyxRQUFMLENBQWMsb0JBQWQsR0FIc0M7S0FBWCxDQUpUOztBQVV0QixTQUFLLFFBQUwsR0FBZ0IsS0FBSyxJQUFMLEVBQWhCLENBVnNCO0FBV3RCLFNBQUssUUFBTCxDQUFjLEtBQWQsR0FBc0IsSUFBdEIsQ0FYc0I7QUFZdEIsU0FBSyxRQUFMLENBQWMsWUFBZCxHQUE2QixVQUE3QixDQVpzQjtBQWF0QixTQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBcEIsRUFBa0MsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFsQyxFQWJzQjtBQWN0QixTQUFLLEtBQUwsR0FBYSxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBZFM7Q0FBMUI7O0FBaUJBLFNBQVMsUUFBVCxDQUFrQixRQUFsQixFQUE0QixLQUE1QixFQUFtQztBQUMvQixRQUFJLEtBQUo7Ozs7QUFEK0IsUUFLM0IsU0FBUyxJQUFULENBQWMsSUFBZCxLQUF1QixNQUFNLElBQU4sQ0FBVyxJQUFYLEVBQWlCO0FBQ3hDLGdCQUFRLElBQVIsQ0FBYSxPQUFiLEVBRHdDO0FBRXhDLGlCQUFTLElBQVQsQ0FBYyxRQUFkLENBQXVCLE1BQXZCLENBQThCLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBZ0IsQ0FBaEIsQ0FBOUIsRUFBa0QsTUFBTSxJQUFOLENBQVcsSUFBWCxDQUFnQixDQUFoQixDQUFsRCxFQUZ3QztBQUd4QyxnQkFBUSxJQUFSLENBQWEsY0FBYixFQUh3QztBQUl4QyxnQkFBUSxTQUFTLElBQVQsQ0FBYyxRQUFkLENBQXVCLEtBQXZCLENBSmdDO0FBS3hDLGNBQU0sSUFBTixHQUFhLFNBQVMsSUFBVCxDQUwyQjtBQU14QyxjQUFNLElBQU4sQ0FBVyxLQUFYLEdBQW1CLEtBQW5CLENBTndDO0tBQTVDLE1BT087QUFDSCxnQkFBUSxJQUFSLENBQWEsYUFBYixFQURHO0tBUFA7Q0FMSjs7QUFpQkEsUUFBUSxLQUFSLEdBQWdCLFVBQVMsSUFBVCxFQUFlLGFBQWYsRUFBK0I7QUFDM0MsUUFBSSxDQUFKLENBRDJDO0FBRTNDLFFBQUksT0FBTyxFQUFQLENBRnVDOztBQUkzQyxTQUFLLElBQUksQ0FBSixFQUFPLElBQUksVUFBVSxNQUFWLEVBQWtCLEVBQUUsQ0FBRixFQUFLO0FBQ25DLGFBQUssSUFBSSxDQUFKLENBQUwsR0FBYyxVQUFVLENBQVYsQ0FBZCxDQURtQztLQUF2Qzs7QUFJQSxXQUFPLE1BQU0sVUFBVSxJQUFWLEVBQWdCO0FBQ3pCLGNBQU0sRUFBRSxNQUFNLElBQU4sRUFBWSxVQUFVLFFBQVYsRUFBcEI7QUFDQSxrQkFBVSxJQUFWO0FBQ0EsY0FBTSxFQUFOO0FBQ0EsY0FBTSxJQUFOO0tBSkcsQ0FBUCxDQVIyQztDQUEvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbi8vIHZhciBoID0gcmVxdWlyZSgnaHlwZXJzY3JpcHQnKTtcbi8vIHZhciBDb21wb25lbnQgPSByZXF1aXJlKCcuLy4uL3NyYy9jb21wb25lbnQuanMnKTtcblxuLy8gdmFyIExpc3QgPSByZXF1aXJlKCcuL25lc3RpbmcvbmVzdGluZy5qcycpO1xuXG52YXIgeyBDb21wb25lbnQsIGgsIGhlbHBlcnMgfSA9IHJlcXVpcmUoJy4vLi4vc3JjL2NvbXBvbmVudC1zbmFiYi5qcycpO1xudmFyIHsgZGl2LCBzcGFuLCBhLCBociB9ID0gaGVscGVycztcbnZhciB0aHVuayA9IHJlcXVpcmUoJy4vc3RvcmUuanMnKS50aHVuaztcbnZhciBjaGFuZ2VFeGFtcGxlID0gcmVxdWlyZSgnLi9yZWR1Y2VyLWFwcC5qcycpLmNoYW5nZUV4YW1wbGU7XG52YXIgQXBwID0gQ29tcG9uZW50LmNyZWF0ZSh7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50TmFtZSA9ICdhcHAnO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RvcmUgPSBDb21wb25lbnQuc3RvcmU7XG5cbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSA9IHN0b3JlLnN1YnNjcmliZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHN0b3JlLmdldFN0YXRlKCkuZXhhbXBsZXMpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKGNvbXBvc2UpIHtcbiAgICAgICAgcmV0dXJuIGRpdignI2FwcCcsIFtcbiAgICAgICAgICAgIHNwYW4oJ0Nob29zZTonKSxcbiAgICAgICAgICAgIGEoe1xuICAgICAgICAgICAgICAgIG9uOiB7IGNsaWNrOiB0aHVuayh7IHR5cGU6ICdDSEFOR0VfRVhBTVBMRScsIGV4YW1wbGU6ICdob21lJyB9KSB9XG4gICAgICAgICAgICB9LCAnIEhvbWUnKSxcbiAgICAgICAgICAgIGEoe1xuICAgICAgICAgICAgICAgIG9uOiB7IGNsaWNrOiB0aHVuayhjaGFuZ2VFeGFtcGxlLCAnY291bnRlcnMnKSB9XG4gICAgICAgICAgICB9LCAnIENvdW50ZXJzJyksXG4gICAgICAgICAgICBhKHtcbiAgICAgICAgICAgICAgICBvbmNsaWNrOiB0aHVuayhjaGFuZ2VFeGFtcGxlLCAnbGlzdCcpXG4gICAgICAgICAgICB9LCAnIExpc3QnKSxcbiAgICAgICAgICAgIGEoe1xuICAgICAgICAgICAgICAgIG9uOiB7IGNsaWNrOiB0aHVuayhjaGFuZ2VFeGFtcGxlLCAnZm9ybScpIH1cbiAgICAgICAgICAgIH0sICcgRm9ybScpLFxuICAgICAgICAgICAgaHIoJycpLFxuICAgICAgICAgICAgdGhpcy5jaG9vc2VFeGFtcGxlcyhjb21wb3NlKVxuICAgICAgICBdKTtcbiAgICB9LFxuXG4gICAgY2hvb3NlRXhhbXBsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSBDb21wb25lbnQuc3RvcmUuZ2V0U3RhdGUoKTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMucHJvcHMuZXhhbXBsZSkge1xuICAgICAgICAgICAgY2FzZSAnY291bnRlcnMnOlxuICAgICAgICAgICAgICAgIHZhciBDb3VudGVycyA9IHJlcXVpcmUoJy4vY291bnRlci1saXN0L2NvdW50ZXItbGlzdC5qcycpO1xuICAgICAgICAgICAgICAgIHJldHVybiBoKENvdW50ZXJzLCB7IHByb3BzOiBzdGF0ZS5jb3VudGVycyB9KTtcbiAgICAgICAgICAgICAgICAvLyBjYXNlICdsaXN0JzpcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuIGNvbXBvc2UoTGlzdCwgc3RhdGUubGlzdCk7XG4gICAgICAgICAgICBjYXNlICdob21lJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2JywgJ0hvbWUnKTtcbiAgICAgICAgICAgIGNhc2UgJ2Zvcm0nOlxuICAgICAgICAgICAgICAgIHZhciBGb3JtID0gcmVxdWlyZSgnLi9mb3JtL2Zvcm0uanMnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaChGb3JtLCB7IHByb3BzOiBzdGF0ZS5mb3JtIH0pO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2JywgJ25vdGhpbmcnKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcbiIsIi8qKlxuICogQWN0aW9ucyBmb3IgY291bnRlciBsaXN0IGNvbXBvbmVudFxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBhY3Rpb25zVHlwZXMgPSByZXF1aXJlKCcuL3JlZHVjZXItY291bnRlci1saXN0LmpzJykuYWN0aW9uVHlwZXM7XG5cbmV4cG9ydHMuYWRkQ291bnRlciA9IGZ1bmN0aW9uKHN0b3JlKSB7XG4gICAgc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25zVHlwZXMuQUREX0NPVU5URVJcbiAgICB9KTtcbn07XG5leHBvcnRzLnJlc2V0Q291bnRlciA9IGZ1bmN0aW9uKHN0b3JlKSB7XG4gICAgc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25zVHlwZXMuUkVTRVRfQ09VTlRFUlxuICAgIH0pO1xufTtcbmV4cG9ydHMucmVtb3ZlQ291bnRlciA9IGZ1bmN0aW9uKHN0b3JlLCBpZCkge1xuICAgIHN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uc1R5cGVzLlJFTU9WRV9DT1VOVEVSLFxuICAgICAgICBpZDogaWRcbiAgICB9KTtcbn07XG5leHBvcnRzLmluY3JlbWVudENvdW50ZXIgPSBmdW5jdGlvbihzdG9yZSwgaWQpIHtcbiAgICBzdG9yZS5kaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvbnNUeXBlcy5JTkNSRU1FTlRfQ09VTlRFUixcbiAgICAgICAgaWQ6IGlkXG4gICAgfSk7XG59O1xuZXhwb3J0cy5kZWNyZW1lbnRDb3VudGVyID0gZnVuY3Rpb24oc3RvcmUsIGlkKSB7XG4gICAgc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25zVHlwZXMuREVDUkVNRU5UX0NPVU5URVIsXG4gICAgICAgIGlkOiBpZFxuICAgIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gdmFyIGggPSByZXF1aXJlKCdoeXBlcnNjcmlwdCcpO1xuLy8gdmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL2NvbXBvbmVudC5qcycpO1xuXG52YXIgeyBDb21wb25lbnQsIGgsIHJldXNlIH0gPSByZXF1aXJlKCcuLy4uLy4uL3NyYy9jb21wb25lbnQtc25hYmIuanMnKTtcbnZhciB0aHVuayA9IHJlcXVpcmUoJy4vLi4vc3RvcmUuanMnKS50aHVuaztcblxudmFyIENvdW50ZXIgPSByZXF1aXJlKCcuL2NvdW50ZXIuanMnKTtcbnZhciBhY3Rpb25zID0gcmVxdWlyZSgnLi9hY3Rpb25zLmpzJyk7XG5cbnZhciBjb3VudGVyTGlzdCA9IENvbXBvbmVudC5jcmVhdGUoe1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudE5hbWUgPSAnY291bnRlcnMnO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RvcmUgPSBDb21wb25lbnQuc3RvcmU7XG5cbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSA9IHN0b3JlLnN1YnNjcmliZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd1cGRhdGUgY291bnRlcnMnKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHN0b3JlLmdldFN0YXRlKCkuY291bnRlcnMpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbihjb21wb3NlKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYjY291bnRlcnMnLCBbXG4gICAgICAgICAgICBoKCdidXR0b24nLCB7IG9uOiB7IGNsaWNrOiB0aHVuayhhY3Rpb25zLmFkZENvdW50ZXIpIH0gfSwgJ0FkZCcpLFxuICAgICAgICAgICAgaCgnYnV0dG9uJywgeyBvbjogeyBjbGljazogdGh1bmsoYWN0aW9ucy5yZXNldENvdW50ZXIpIH0gfSwgJ1Jlc2V0JyksXG4gICAgICAgICAgICBoKCdocicpLFxuICAgICAgICAgICAgaCgnZGl2LmNvdW50ZXItbGlzdCcsIHRoaXMucHJvcHMuY291bnRlcnMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudGVySXRlbVZpZXcoY29tcG9zZSwgaXRlbSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpKVxuICAgICAgICBdKTtcbiAgICB9LFxuXG4gICAgY291bnRlckl0ZW1WaWV3OiBmdW5jdGlvbihjb21wb3NlLCBpdGVtKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYuY291bnRlci1pdGVtJywgW1xuICAgICAgICAgICAgaCgnYnV0dG9uLnJlbW92ZScsIHtcbiAgICAgICAgICAgICAgICBvbjogeyBjbGljazogdGh1bmsoYWN0aW9ucy5yZW1vdmVDb3VudGVyLCBpdGVtLmlkKSB9XG4gICAgICAgICAgICB9LCAnUmVtb3ZlJyksXG4gICAgICAgICAgICByZXVzZSgnY291bnRlcicgKyBpdGVtLmlkLCBDb3VudGVyLCBpdGVtLCB7XG4gICAgICAgICAgICAgICAgb25JbmNyZW1lbnQ6IHRodW5rKGFjdGlvbnMuaW5jcmVtZW50Q291bnRlciwgaXRlbS5pZCksXG4gICAgICAgICAgICAgICAgb25EZWNyZW1lbnQ6IHRodW5rKGFjdGlvbnMuZGVjcmVtZW50Q291bnRlciwgaXRlbS5pZClcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgaCgnaHInKVxuICAgICAgICBdKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3VudGVyTGlzdDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gdmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL2NvbXBvbmVudC5qcycpO1xuLy8gdmFyIGggPSByZXF1aXJlKCdoeXBlcnNjcmlwdCcpO1xuXG52YXIgeyBDb21wb25lbnQsIGgsIHJldXNlIH0gPSByZXF1aXJlKCcuLy4uLy4uL3NyYy9jb21wb25lbnQtc25hYmIuanMnKTtcbnZhciBDb3VudGVyID0gQ29tcG9uZW50LmNyZWF0ZSh7XG4gICAgcmVuZGVyOiBmdW5jdGlvbihwcm9wcywgaGFuZGxlcnMpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdiMnICsgdGhpcy5jaWQsIFtcbiAgICAgICAgICAgIGgoJ3AnLCB0aGlzLnByb3BzLmlkICsgJyAnICsgdGhpcy5jaWQpLFxuICAgICAgICAgICAgaCgnYnV0dG9uJywgeyBvbjogeyBjbGljazogaGFuZGxlcnMub25JbmNyZW1lbnQgfSB9LCAnKycpLFxuICAgICAgICAgICAgaCgnYnV0dG9uJywgeyBvbjogeyBjbGljazogaGFuZGxlcnMub25EZWNyZW1lbnQgfSB9LCAnLScpLFxuICAgICAgICAgICAgaCgnZGl2JywgJ0NvdW50OiAnICsgdGhpcy5wcm9wcy5jb3VudGVyKVxuICAgICAgICBdKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb3VudGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFjdGlvblR5cGVzID0gZXhwb3J0cy5hY3Rpb25UeXBlcyA9IHtcbiAgICBBRERfQ09VTlRFUjogJ0FERF9DT1VOVEVSJyxcbiAgICBSRVNFVF9DT1VOVEVSOiAnUkVTRVRfQ09VTlRFUicsXG4gICAgUkVNT1ZFX0NPVU5URVI6ICdSRU1PVkVfQ09VTlRFUicsXG4gICAgSU5DUkVNRU5UX0NPVU5URVI6ICdJTkNSRU1FTlRfQ09VTlRFUicsXG4gICAgREVDUkVNRU5UX0NPVU5URVI6ICdERUNSRU1FTlRfQ09VTlRFUidcbn07XG5cbmV4cG9ydHMucmVkdWNlciA9IGZ1bmN0aW9uIGNvdW50ZXJzUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc3RhdGUgPSB7XG4gICAgICAgICAgICBuZXh0SWQ6IDEsXG4gICAgICAgICAgICBjb3VudGVyczogW11cbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFERF9DT1VOVEVSOlxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgbmV4dElkOiBzdGF0ZS5uZXh0SWQgKyAxLFxuICAgICAgICAgICAgICAgIGNvdW50ZXJzOiBzdGF0ZS5jb3VudGVycy5jb25jYXQoe1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVyOiAwLFxuICAgICAgICAgICAgICAgICAgICBpZDogc3RhdGUubmV4dElkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLlJFU0VUX0NPVU5URVI6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBuZXh0SWQ6IDEsXG4gICAgICAgICAgICAgICAgY291bnRlcnM6IFtdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5SRU1PVkVfQ09VTlRFUjpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGNvdW50ZXJzOiBzdGF0ZS5jb3VudGVycy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pZCAhPT0gYWN0aW9uLmlkO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5JTkNSRU1FTlRfQ09VTlRFUjpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGNvdW50ZXJzOiBzdGF0ZS5jb3VudGVycy5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCAhPT0gYWN0aW9uLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBpdGVtLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGVyOiBpdGVtLmNvdW50ZXIgKyAxXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5ERUNSRU1FTlRfQ09VTlRFUjpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGNvdW50ZXJzOiBzdGF0ZS5jb3VudGVycy5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCAhPT0gYWN0aW9uLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBpdGVtLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGVyOiBpdGVtLmNvdW50ZXIgLSAxXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFjdGlvblR5cGVzID0gZXhwb3J0cy5hY3Rpb25zVHlwZXMgPSB7XG4gICAgVkFMSURBVEVfRk9STTogJ1ZBTElEQVRFX0ZPUk0nXG59O1xudmFyIHQgPSByZXF1aXJlKCd0Y29tYi12YWxpZGF0aW9uJyk7XG52YXIgdmFsaWRhdGUgPSB0LnZhbGlkYXRlO1xuXG5mdW5jdGlvbiBteXN1YnR5cGUodHlwZSwgZ2V0VmFsaWRhdGlvbkVycm9yTWVzc2FnZSwgbmFtZSkge1xuICAgIHZhciBTdWJ0eXBlID0gdC5zdWJ0eXBlKHR5cGUsIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuICF0LlN0cmluZy5pcyhnZXRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlKHgpKTtcbiAgICB9LCBuYW1lKTtcblxuICAgIFN1YnR5cGUuZ2V0VmFsaWRhdGlvbkVycm9yTWVzc2FnZSA9IGdldFZhbGlkYXRpb25FcnJvck1lc3NhZ2U7XG4gICAgcmV0dXJuIFN1YnR5cGU7XG59XG5cbnZhciBOYW1lVHlwZSA9IG15c3VidHlwZSh0LlN0cmluZywgZnVuY3Rpb24ocykge1xuICAgIGlmICghcykge1xuICAgICAgICByZXR1cm4gJ1JlcXVpcmVkJztcbiAgICB9XG4gICAgaWYgKHMubGVuZ3RoID49IDMpIHtcbiAgICAgICAgcmV0dXJuICdUb28gbG9uZyBteSBmcmllbmQnO1xuICAgIH1cbn0pO1xudmFyIEVtYWlsVHlwZSA9IG15c3VidHlwZSh0LlN0cmluZywgZnVuY3Rpb24ocykge1xuICAgIGlmICghcykge1xuICAgICAgICByZXR1cm4gJ1JlcXVpcmVkJztcbiAgICB9XG4gICAgaWYgKHMubGVuZ3RoIDw9IDQpIHtcbiAgICAgICAgcmV0dXJuICdOb3QgYW4gZW1haWwhISc7XG4gICAgfVxufSk7XG5cbnZhciBTY2hlbWEgPSB0LnN0cnVjdCh7XG4gICAgbmFtZTogTmFtZVR5cGUsXG4gICAgZW1haWw6IEVtYWlsVHlwZSxcbiAgICBhZ2U6IHQuTnVtYmVyXG59KTtcbmV4cG9ydHMudmFsaWRhdGUgPSBmdW5jdGlvbihzdG9yZSwgZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgcmVzdWx0ID0gdmFsaWRhdGUoe1xuICAgICAgICBuYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZScpLnZhbHVlLnRyaW0oKSxcbiAgICAgICAgZW1haWw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbWFpbCcpLnZhbHVlLnRyaW0oKSxcbiAgICAgICAgYWdlOiBOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FnZScpLnZhbHVlLnRyaW0oKSlcbiAgICB9LCBTY2hlbWEpO1xuXG4gICAgc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBBY3Rpb25UeXBlcy5WQUxJREFURV9GT1JNLFxuICAgICAgICB2YWx1ZXM6IHJlc3VsdFxuICAgIH0pO1xufTtcblxuZXhwb3J0cy5yZWR1Y2VyID0gZnVuY3Rpb24oc3RhdGUsIGFjdGlvbikge1xuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHN0YXRlID0ge1xuICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgICAgICAgICBhZ2U6ICcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVzc2FnZTogJydcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEFjdGlvblR5cGVzLlZBTElEQVRFX0ZPUk06XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBlcnJvcnM6IGFjdGlvbi52YWx1ZXMuZXJyb3JzLFxuICAgICAgICAgICAgICAgIHZhbHVlczogYWN0aW9uLnZhbHVlcy52YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gdmFyIGggPSByZXF1aXJlKCdoeXBlcnNjcmlwdCcpO1xuLy8gdmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vLi4vLi4vc3JjL2NvbXBvbmVudC5qcycpO1xudmFyIHsgQ29tcG9uZW50LCBoIH0gPSByZXF1aXJlKCcuLy4uLy4uL3NyYy9jb21wb25lbnQtc25hYmIuanMnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4vLi4vc3RvcmUuanMnKTtcbnZhciBmaW5kID0gcmVxdWlyZSgnbG9kYXNoL2ZpbmQnKTtcbnZhciB0aHVuayA9IHN0b3JlLnRodW5rO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9mb3JtLXJlZHVjZXIuanMnKS52YWxpZGF0ZTtcbnZhciBGb3JtID0gQ29tcG9uZW50LmNyZWF0ZSh7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50TmFtZSA9ICdmb3JtJztcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0b3JlID0gQ29tcG9uZW50LnN0b3JlO1xuXG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUgPSBzdG9yZS5zdWJzY3JpYmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShzdG9yZS5nZXRTdGF0ZSgpLmZvcm0pO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5wcm9wcy52YWx1ZXM7XG5cbiAgICAgICAgcmV0dXJuIGgoJ2Zvcm0nLCB7XG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgIGNoYW5nZTogdGh1bmsodmFsaWRhdGUpLFxuICAgICAgICAgICAgICAgIHN1Ym1pdDogdGh1bmsodmFsaWRhdGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIFtcbiAgICAgICAgICAgIGgoJ2xhYmVsJywgJ05hbWU6ICcpLFxuICAgICAgICAgICAgaCgnaW5wdXQjbmFtZScsIHsgcHJvcHM6IHsgdHlwZTogJ3RleHQnLCB2YWx1ZTogdmFsdWVzLm5hbWUgfSB9KSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRXJyb3JzKCduYW1lJyksXG4gICAgICAgICAgICBoKCdicicpLFxuICAgICAgICAgICAgaCgnbGFiZWwnLCAnRW1haWw6ICcpLFxuICAgICAgICAgICAgaCgnaW5wdXQjZW1haWwnLCB7IHByb3BzOiB7IHR5cGU6ICdlbWFpbCcsIHZhbHVlOiB2YWx1ZXMuZW1haWwgfSB9KSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRXJyb3JzKCdlbWFpbCcpLFxuICAgICAgICAgICAgaCgnYnInKSxcbiAgICAgICAgICAgIGgoJ2xhYmVsJywgJ0FnZTogJyksXG4gICAgICAgICAgICBoKCdpbnB1dCNhZ2UnLCB7IHByb3BzOiB7IHR5cGU6ICd0ZXh0JywgdmFsdWU6IHZhbHVlcy5hZ2UgfSB9KSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRXJyb3JzKCdhZ2UnKSxcbiAgICAgICAgICAgIGgoJ2JyJyksXG4gICAgICAgICAgICBoKCdpbnB1dCcsIHsgcHJvcHM6IHsgdHlwZTogJ3N1Ym1pdCcgfSB9LCAnU3VibWl0JylcbiAgICAgICAgXSk7XG4gICAgfSxcbiAgICByZW5kZXJFcnJvcnM6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHZhciBlcnJvciA9IGZpbmQodGhpcy5wcm9wcy5lcnJvcnMsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3IucGF0aFswXSA9PT0gaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBoKCdzcGFuJywgZXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJycpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm07XG4iLCIndXNlIHN0cmljdCc7XG4vLyB2YXIgaCA9IHJlcXVpcmUoJy4vLi4vc3JjL2h5cGVyc2NyaXB0LmpzJyk7XG4vLyB2YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi8uLi9zcmMvY29tcG9uZW50Jyk7XG52YXIgeyBDb21wb25lbnQsIG1vdW50IH0gPSByZXF1aXJlKCcuLy4uL3NyYy9jb21wb25lbnQtc25hYmIuanMnKTtcbnZhciBTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUuanMnKS5zdG9yZTtcbnZhciByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcbnZhciBBcHA7XG5Db21wb25lbnQuc3RvcmUgPSBTdG9yZTtcbkNvbXBvbmVudC5kaXNwYXRjaCA9IFN0b3JlLmRpc3BhdGNoO1xuXG5BcHAgPSByZXF1aXJlKCcuL2FwcC5qcycpO1xuLy8gcm9vdC5hcHBlbmRDaGlsZChuZXcgQXBwKCkubW91bnQoU3RvcmUuZ2V0U3RhdGUoKS5leGFtcGxlcykpO1xuXG5tb3VudChyb290LCBBcHAsIFN0b3JlLmdldFN0YXRlKCkuZXhhbXBsZXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFjdGlvblR5cGVzID0gZXhwb3J0cy5hY3Rpb25UeXBlcyA9IHtcbiAgICBJTklUOiAnQEBMSVNUX0lOSVQnLFxuICAgIFJFU0VUOiAnQEBMSVNUX1JFU0VUJyxcbiAgICBJTkNSRU1FTlQ6ICdAQExJU1RfSU5DUkVNRU5UJ1xufTtcblxuZXhwb3J0cy5yZWR1Y2VyID0gZnVuY3Rpb24oc3RhdGUsIGFjdGlvbikge1xuICAgIHZhciBpbml0aWFsU3RhdGUgPSBbXTtcblxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHN0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIH1cblxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5JTklUOlxuICAgICAgICAgICAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICAgICBpZDogMCxcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogOTk5OVxuICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLlJFU0VUOlxuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZTtcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5JTkNSRU1FTlQ6XG4gICAgICAgICAgICBzdGF0ZS5mb3JFYWNoKGZ1bmN0aW9uKGNvdW50ZXIsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIuaWQgPT09IGFjdGlvbi5pZCkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVtpbmRleF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYWN0aW9uLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IGNvdW50ZXIuY291bnQgKyAxXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBBY3Rpb25UeXBlcyA9IGV4cG9ydHMuYWN0aW9uc1R5cGVzID0ge1xuICAgIENIQU5HRV9FWEFNUExFOiAnQ0hBTkdFX0VYQU1QTEUnXG59O1xuXG5leHBvcnRzLmNoYW5nZUV4YW1wbGUgPSBmdW5jdGlvbihzdG9yZSwgZXhhbXBsZSkge1xuICAgIHN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogQWN0aW9uVHlwZXMuQ0hBTkdFX0VYQU1QTEUsXG4gICAgICAgIGV4YW1wbGU6IGV4YW1wbGVcbiAgICB9KTtcbn07XG5cbmV4cG9ydHMucmVkdWNlciA9IGZ1bmN0aW9uKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzdGF0ZSA9IHtcbiAgICAgICAgICAgIGV4YW1wbGU6ICdjb3VudGVycydcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEFjdGlvblR5cGVzLkNIQU5HRV9FWEFNUExFOlxuICAgICAgICAgICAgaWYgKGFjdGlvbi5leGFtcGxlID09PSBzdGF0ZS5leGFtcGxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgZXhhbXBsZTogYWN0aW9uLmV4YW1wbGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XG52YXIgYXBwbHlNaWRkbGV3YXJlID0gcmVkdXguYXBwbHlNaWRkbGV3YXJlO1xudmFyIGNvbWJpbmVSZWR1Y2VycyA9IHJlZHV4LmNvbWJpbmVSZWR1Y2VycztcbnZhciBjb21wb3NlID0gcmVkdXguY29tcG9zZTtcbi8vIHZhciBiaW5kQWN0aW9uQ3JlYXRvcnMgPSByZXF1aXJlKCdyZWR1eCcpLmJpbmRBY3Rpb25DcmVhdG9ycztcbi8vIHZhciBsb2dnZXIgPSByZXF1aXJlKCdyZWR1eC1sb2dnZXInKTtcblxudmFyIGxvZ2dlciA9IGZ1bmN0aW9uIGxvZ2dlcihzdG9yZSkge1xuICAgIHZhciBnZXRTdGF0ZSA9IHN0b3JlLmdldFN0YXRlO1xuXG4gICAgcmV0dXJuIChuZXh0KSA9PiAoYWN0aW9uKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnd2lsbCBkaXNwYXRjaCcsIGFjdGlvbik7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgbmV4dCBkaXNwYXRjaCBtZXRob2QgaW4gdGhlIG1pZGRsZXdhcmUgY2hhaW4uXG4gICAgICAgIGxldCByZXR1cm5WYWx1ZSA9IG5leHQoYWN0aW9uKTtcblxuICAgICAgICBjb25zb2xlLmluZm8oJ3N0YXRlIGFmdGVyIGRpc3BhdGNoJywgZ2V0U3RhdGUoKSk7XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGxpa2VseSBiZSB0aGUgYWN0aW9uIGl0c2VsZiwgdW5sZXNzXG4gICAgICAgIC8vIGEgbWlkZGxld2FyZSBmdXJ0aGVyIGluIGNoYWluIGNoYW5nZWQgaXQuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICB9O1xufTtcblxuLy8gUmVkdWNlcnNcbnZhciByZWR1Y2VyQXBwID0gcmVxdWlyZSgnLi9yZWR1Y2VyLWFwcC5qcycpLnJlZHVjZXI7XG52YXIgcmVkdWNlckxpc3QgPSByZXF1aXJlKCcuL25lc3RpbmcvcmVkdWNlci1uZXN0aW5nLmpzJykucmVkdWNlcjtcbnZhciByZWR1Y2VyQ291bnRlckxpc3QgPSByZXF1aXJlKCcuL2NvdW50ZXItbGlzdC9yZWR1Y2VyLWNvdW50ZXItbGlzdC5qcycpLnJlZHVjZXI7XG52YXIgcmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gICAgZXhhbXBsZXM6IHJlZHVjZXJBcHAsXG4gICAgY291bnRlcnM6IHJlZHVjZXJDb3VudGVyTGlzdCxcbiAgICBsaXN0OiByZWR1Y2VyTGlzdCxcbiAgICBmb3JtOiByZXF1aXJlKCcuL2Zvcm0vZm9ybS1yZWR1Y2VyLmpzJykucmVkdWNlclxufSk7XG5cbi8vIFN0b3JlXG52YXIgc3RvcmUgPSByZWR1eC5jcmVhdGVTdG9yZShyZWR1Y2VyLCBjb21wb3NlKFxuICAgIGFwcGx5TWlkZGxld2FyZShsb2dnZXIpLFxuICAgIHdpbmRvdy5kZXZUb29sc0V4dGVuc2lvbiA/IHdpbmRvdy5kZXZUb29sc0V4dGVuc2lvbigpIDogZnVuY3Rpb24oZikge1xuICAgICAgICByZXR1cm4gZjtcbiAgICB9XG4pKTtcblxuZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuLy8gZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24oY3JlYXRvcnMpIHtcbi8vICAgICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3JzKGNyZWF0b3JzLCBzdG9yZS5kaXNwYXRjaCk7XG4vLyB9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHVuayBmb3IgYSBhY3Rpb24gb3IgYWN0aW9uQ3JlYXRvciBhbmQgcGFydGlhbCBhcHBsaWVzIHRoZSBzdG9yZVxuICogQHBhcmFtICB7T2JqZWN0fEZ1bmN0aW9ufSBmbiBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnRzLnRodW5rID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbc3RvcmVdLmNvbmNhdChhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZm4gIT09ICdvYmplY3QnIHx8IGZuID09PSBudWxsIHx8IHR5cGVvZiBmbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhY3Rpb24gZXhwZWN0ZWQgYW4gb2JqZWN0IG9yIGEgZnVuY3Rpb24sIGluc3RlYWQgcmVjZWl2ZWQgJyArIChmbiA9PT0gJ251bGwnID8gJ251bGwnIDogdHlwZW9mIGZuKSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmRpc3BhdGNoKGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5leHBvcnRzLmFjdGlvbiA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZm4gIT09ICdvYmplY3QnIHx8IGZuID09PSBudWxsIHx8IHR5cGVvZiBmbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhY3Rpb24gZXhwZWN0ZWQgYW4gb2JqZWN0IG9yIGEgZnVuY3Rpb24sIGluc3RlYWQgcmVjZWl2ZWQgJyArIChmbiA9PT0gJ251bGwnID8gJ251bGwnIDogdHlwZW9mIGZuKSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmRpc3BhdGNoKGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gdmFyIENvbXBvbmVudCA9IGV4cG9ydHMuY29tcG9uZW50ID0gcmVxdWlyZSgnLi9zcmMvY29tcG9uZW50Jyk7XG5leHBvcnRzLmFwcCA9IHJlcXVpcmUoJy4vZXhhbXBsZXMvbWFpbi5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBpc1ZhbGlkU3RyaW5nID0gZnVuY3Rpb24gaXNWYWxpZFN0cmluZyhwYXJhbSkge1xuICByZXR1cm4gdHlwZW9mIHBhcmFtID09PSAnc3RyaW5nJyAmJiBwYXJhbS5sZW5ndGggPiAwO1xufTtcblxudmFyIHN0YXJ0c1dpdGggPSBmdW5jdGlvbiBzdGFydHNXaXRoKHN0cmluZywgc3RhcnQpIHtcbiAgcmV0dXJuIHN0cmluZ1swXSA9PT0gc3RhcnQ7XG59O1xuXG52YXIgaXNTZWxlY3RvciA9IGZ1bmN0aW9uIGlzU2VsZWN0b3IocGFyYW0pIHtcbiAgcmV0dXJuIGlzVmFsaWRTdHJpbmcocGFyYW0pICYmIChzdGFydHNXaXRoKHBhcmFtLCAnLicpIHx8IHN0YXJ0c1dpdGgocGFyYW0sICcjJykpO1xufTtcblxudmFyIG5vZGUgPSBmdW5jdGlvbiBub2RlKGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YWdOYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChmaXJzdCkge1xuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHJlc3QgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIHJlc3RbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNTZWxlY3RvcihmaXJzdCkpIHtcbiAgICAgICAgcmV0dXJuIGguYXBwbHkodW5kZWZpbmVkLCBbdGFnTmFtZSArIGZpcnN0XS5jb25jYXQocmVzdCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGguYXBwbHkodW5kZWZpbmVkLCBbdGFnTmFtZSwgZmlyc3RdLmNvbmNhdChyZXN0KSk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn07XG5cbnZhciBUQUdfTkFNRVMgPSBbJ2EnLCAnYWJicicsICdhZGRyZXNzJywgJ2FyZWEnLCAnYXJ0aWNsZScsICdhc2lkZScsICdhdWRpbycsICdiJywgJ2Jhc2UnLCAnYmRpJywgJ2JkbycsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnYnInLCAnYnV0dG9uJywgJ2NhbnZhcycsICdjYXB0aW9uJywgJ2NpdGUnLCAnY29kZScsICdjb2wnLCAnY29sZ3JvdXAnLCAnZGQnLCAnZGVsJywgJ2RmbicsICdkaXInLCAnZGl2JywgJ2RsJywgJ2R0JywgJ2VtJywgJ2VtYmVkJywgJ2ZpZWxkc2V0JywgJ2ZpZ2NhcHRpb24nLCAnZmlndXJlJywgJ2Zvb3RlcicsICdmb3JtJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWQnLCAnaGVhZGVyJywgJ2hncm91cCcsICdocicsICdodG1sJywgJ2knLCAnaWZyYW1lJywgJ2ltZycsICdpbnB1dCcsICdpbnMnLCAna2JkJywgJ2tleWdlbicsICdsYWJlbCcsICdsZWdlbmQnLCAnbGknLCAnbGluaycsICdtYWluJywgJ21hcCcsICdtYXJrJywgJ21lbnUnLCAnbWV0YScsICduYXYnLCAnbm9zY3JpcHQnLCAnb2JqZWN0JywgJ29sJywgJ29wdGdyb3VwJywgJ29wdGlvbicsICdwJywgJ3BhcmFtJywgJ3ByZScsICdxJywgJ3JwJywgJ3J0JywgJ3J1YnknLCAncycsICdzYW1wJywgJ3NjcmlwdCcsICdzZWN0aW9uJywgJ3NlbGVjdCcsICdzbWFsbCcsICdzb3VyY2UnLCAnc3BhbicsICdzdHJvbmcnLCAnc3R5bGUnLCAnc3ViJywgJ3N1cCcsICd0YWJsZScsICd0Ym9keScsICd0ZCcsICd0ZXh0YXJlYScsICd0Zm9vdCcsICd0aCcsICd0aGVhZCcsICd0aXRsZScsICd0cicsICd1JywgJ3VsJywgJ3ZpZGVvJywgJ3Byb2dyZXNzJ107XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChoKSB7XG4gIHZhciBjcmVhdGVUYWcgPSBub2RlKGgpO1xuICB2YXIgZXhwb3J0ZWQgPSB7IFRBR19OQU1FUzogVEFHX05BTUVTLCBpc1NlbGVjdG9yOiBpc1NlbGVjdG9yLCBjcmVhdGVUYWc6IGNyZWF0ZVRhZyB9O1xuICBUQUdfTkFNRVMuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgIGV4cG9ydGVkW25dID0gY3JlYXRlVGFnKG4pO1xuICB9KTtcbiAgcmV0dXJuIGV4cG9ydGVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBoYXNoIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gSGFzaCgpIHt9XG5cbi8vIEF2b2lkIGluaGVyaXRpbmcgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAgd2hlbiBwb3NzaWJsZS5cbkhhc2gucHJvdG90eXBlID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDogb2JqZWN0UHJvdG87XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2xlYXIgPSByZXF1aXJlKCcuL19tYXBDbGVhcicpLFxuICAgIG1hcERlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcERlbGV0ZScpLFxuICAgIG1hcEdldCA9IHJlcXVpcmUoJy4vX21hcEdldCcpLFxuICAgIG1hcEhhcyA9IHJlcXVpcmUoJy4vX21hcEhhcycpLFxuICAgIG1hcFNldCA9IHJlcXVpcmUoJy4vX21hcFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPyB2YWx1ZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gdmFsdWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBmdW5jdGlvbnMgdG8gdGhlIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcEhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0O1xuIiwidmFyIHN0YWNrQ2xlYXIgPSByZXF1aXJlKCcuL19zdGFja0NsZWFyJyksXG4gICAgc3RhY2tEZWxldGUgPSByZXF1aXJlKCcuL19zdGFja0RlbGV0ZScpLFxuICAgIHN0YWNrR2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tHZXQnKSxcbiAgICBzdGFja0hhcyA9IHJlcXVpcmUoJy4vX3N0YWNrSGFzJyksXG4gICAgc3RhY2tTZXQgPSByZXF1aXJlKCcuL19zdGFja1NldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA/IHZhbHVlcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSB2YWx1ZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIGZ1bmN0aW9ucyB0byB0aGUgYFN0YWNrYCBjYWNoZS5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gVWludDhBcnJheTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCIvKipcbiAqIEFkZHMgdGhlIGtleS12YWx1ZSBgcGFpcmAgdG8gYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlyIFRoZSBrZXktdmFsdWUgcGFpciB0byBhZGQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBtYXBgLlxuICovXG5mdW5jdGlvbiBhZGRNYXBFbnRyeShtYXAsIHBhaXIpIHtcbiAgLy8gRG9uJ3QgcmV0dXJuIGBNYXAjc2V0YCBiZWNhdXNlIGl0IGRvZXNuJ3QgcmV0dXJuIHRoZSBtYXAgaW5zdGFuY2UgaW4gSUUgMTEuXG4gIG1hcC5zZXQocGFpclswXSwgcGFpclsxXSk7XG4gIHJldHVybiBtYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkTWFwRW50cnk7XG4iLCIvKipcbiAqIEFkZHMgYHZhbHVlYCB0byBgc2V0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFkZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYHNldGAuXG4gKi9cbmZ1bmN0aW9uIGFkZFNldEVudHJ5KHNldCwgdmFsdWUpIHtcbiAgc2V0LmFkZCh2YWx1ZSk7XG4gIHJldHVybiBzZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkU2V0RW50cnk7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHsuLi4qfSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgdmFyIGxlbmd0aCA9IGFyZ3MubGVuZ3RoO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlFYWNoKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1hcDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnJlZHVjZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBUaGUgaW5pdGlhbCB2YWx1ZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luaXRBY2N1bV0gU3BlY2lmeSB1c2luZyB0aGUgZmlyc3QgZWxlbWVudCBvZiBgYXJyYXlgIGFzIHRoZSBpbml0aWFsIHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBhcnJheVJlZHVjZShhcnJheSwgaXRlcmF0ZWUsIGFjY3VtdWxhdG9yLCBpbml0QWNjdW0pIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgaWYgKGluaXRBY2N1bSAmJiBsZW5ndGgpIHtcbiAgICBhY2N1bXVsYXRvciA9IGFycmF5WysraW5kZXhdO1xuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYWNjdW11bGF0b3IgPSBpdGVyYXRlZShhY2N1bXVsYXRvciwgYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiBhY2N1bXVsYXRvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVJlZHVjZTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnNvbWVgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlTb21lO1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgYXNzb2NpYXRpdmUgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhc3NvY0RlbGV0ZShhcnJheSwga2V5KSB7XG4gIHZhciBpbmRleCA9IGFzc29jSW5kZXhPZihhcnJheSwga2V5KTtcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGFycmF5LnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGFycmF5LCBpbmRleCwgMSk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgYXNzb2NpYXRpdmUgYXJyYXkgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYXNzb2NHZXQoYXJyYXksIGtleSkge1xuICB2YXIgaW5kZXggPSBhc3NvY0luZGV4T2YoYXJyYXksIGtleSk7XG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBhcnJheVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFuIGFzc29jaWF0aXZlIGFycmF5IHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhc3NvY0hhcyhhcnJheSwga2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0hhcztcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgXG4gKiBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jSW5kZXhPZjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBhc3NvY2lhdGl2ZSBhcnJheSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKi9cbmZ1bmN0aW9uIGFzc29jU2V0KGFycmF5LCBrZXksIHZhbHVlKSB7XG4gIHZhciBpbmRleCA9IGFzc29jSW5kZXhPZihhcnJheSwga2V5KTtcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIGFycmF5LnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBhcnJheVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jU2V0O1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhIHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDYXN0UGF0aCh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IHN0cmluZ1RvUGF0aCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNhc3RQYXRoO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ24nKSxcbiAgICBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNsb25lQnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVCdWZmZXInKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBjb3B5U3ltYm9scyA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNIb3N0T2JqZWN0ID0gcmVxdWlyZSgnLi9faXNIb3N0T2JqZWN0JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBzdXBwb3J0ZWQgYnkgYF8uY2xvbmVgLiAqL1xudmFyIGNsb25lYWJsZVRhZ3MgPSB7fTtcbmNsb25lYWJsZVRhZ3NbYXJnc1RhZ10gPSBjbG9uZWFibGVUYWdzW2FycmF5VGFnXSA9XG5jbG9uZWFibGVUYWdzW2FycmF5QnVmZmVyVGFnXSA9IGNsb25lYWJsZVRhZ3NbYm9vbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQzMlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50OFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPSBjbG9uZWFibGVUYWdzW2ludDMyVGFnXSA9XG5jbG9uZWFibGVUYWdzW21hcFRhZ10gPSBjbG9uZWFibGVUYWdzW251bWJlclRhZ10gPVxuY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID0gY2xvbmVhYmxlVGFnc1tyZWdleHBUYWddID1cbmNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9IGNsb25lYWJsZVRhZ3Nbc3RyaW5nVGFnXSA9XG5jbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4VGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRnVsbF0gU3BlY2lmeSBhIGNsb25lIGluY2x1ZGluZyBzeW1ib2xzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBpc0RlZXAsIGlzRnVsbCwgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChjdXN0b21pemVyKSB7XG4gICAgcmVzdWx0ID0gb2JqZWN0ID8gY3VzdG9taXplcih2YWx1ZSwga2V5LCBvYmplY3QsIHN0YWNrKSA6IGN1c3RvbWl6ZXIodmFsdWUpO1xuICB9XG4gIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSk7XG4gIGlmIChpc0Fycikge1xuICAgIHJlc3VsdCA9IGluaXRDbG9uZUFycmF5KHZhbHVlKTtcbiAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgcmV0dXJuIGNvcHlBcnJheSh2YWx1ZSwgcmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG5cbiAgICBpZiAoaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2xvbmVCdWZmZXIodmFsdWUsIGlzRGVlcCk7XG4gICAgfVxuICAgIGlmICh0YWcgPT0gb2JqZWN0VGFnIHx8IHRhZyA9PSBhcmdzVGFnIHx8IChpc0Z1bmMgJiYgIW9iamVjdCkpIHtcbiAgICAgIGlmIChpc0hvc3RPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lT2JqZWN0KGlzRnVuYyA/IHt9IDogdmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmVzdWx0ID0gYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGlzRnVsbCA/IGNvcHlTeW1ib2xzKHZhbHVlLCByZXN1bHQpIDogcmVzdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNsb25lYWJsZVRhZ3NbdGFnXSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGlzRGVlcCk7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gaXRzIGNvcnJlc3BvbmRpbmcgY2xvbmUuXG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KHZhbHVlKTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZDtcbiAgfVxuICBzdGFjay5zZXQodmFsdWUsIHJlc3VsdCk7XG5cbiAgLy8gUmVjdXJzaXZlbHkgcG9wdWxhdGUgY2xvbmUgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgKGlzQXJyID8gYXJyYXlFYWNoIDogYmFzZUZvck93bikodmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBhc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBpc0RlZXAsIGlzRnVsbCwgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2spKTtcbiAgfSk7XG4gIHJldHVybiAoaXNGdWxsICYmICFpc0FycikgPyBjb3B5U3ltYm9scyh2YWx1ZSwgcmVzdWx0KSA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGUgVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlQ3JlYXRlKHByb3RvKSB7XG4gIHJldHVybiBpc09iamVjdChwcm90bykgPyBvYmplY3RDcmVhdGUocHJvdG8pIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcbiIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIG1ldGhvZHMgbGlrZSBgXy5maW5kYCBhbmQgYF8uZmluZEtleWAsIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMsIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYGNvbGxlY3Rpb25gIHVzaW5nXG4gKiBgZWFjaEZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBzZWFyY2guXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYGNvbGxlY3Rpb25gLlxuICogQHBhcmFtIHtib29sZWFufSBbcmV0S2V5XSBTcGVjaWZ5IHJldHVybmluZyB0aGUga2V5IG9mIHRoZSBmb3VuZCBlbGVtZW50IGluc3RlYWQgb2YgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZvdW5kIGVsZW1lbnQgb3IgaXRzIGtleSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbmQoY29sbGVjdGlvbiwgcHJlZGljYXRlLCBlYWNoRnVuYywgcmV0S2V5KSB7XG4gIHZhciByZXN1bHQ7XG4gIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pIHtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXN1bHQgPSByZXRLZXkgPyBrZXkgOiB2YWx1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YCB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvckluYCBhbmQgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzXG4gKiBvdmVyIGBvYmplY3RgIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBpbnZva2luZyBgaXRlcmF0ZWVgIGZvclxuICogZWFjaCBwcm9wZXJ0eS4gSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5XG4gKiByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9fYmFzZUZvcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd247XG4iLCJ2YXIgYmFzZUNhc3RQYXRoID0gcmVxdWlyZSgnLi9fYmFzZUNhc3RQYXRoJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWZhdWx0IHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldChvYmplY3QsIHBhdGgpIHtcbiAgcGF0aCA9IGlzS2V5KHBhdGgsIG9iamVjdCkgPyBbcGF0aCArICcnXSA6IGJhc2VDYXN0UGF0aChwYXRoKTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3BhdGhbaW5kZXgrK11dO1xuICB9XG4gIHJldHVybiAoaW5kZXggJiYgaW5kZXggPT0gbGVuZ3RoKSA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhcyhvYmplY3QsIGtleSkge1xuICAvLyBBdm9pZCBhIGJ1ZyBpbiBJRSAxMC0xMSB3aGVyZSBvYmplY3RzIHdpdGggYSBbW1Byb3RvdHlwZV1dIG9mIGBudWxsYCxcbiAgLy8gdGhhdCBhcmUgY29tcG9zZWQgZW50aXJlbHkgb2YgaW5kZXggcHJvcGVydGllcywgcmV0dXJuIGBmYWxzZWAgZm9yXG4gIC8vIGBoYXNPd25Qcm9wZXJ0eWAgY2hlY2tzIG9mIHRoZW0uXG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSB8fFxuICAgICh0eXBlb2Ygb2JqZWN0ID09ICdvYmplY3QnICYmIGtleSBpbiBvYmplY3QgJiYgZ2V0UHJvdG90eXBlT2Yob2JqZWN0KSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhcztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzSW4ob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIGtleSBpbiBPYmplY3Qob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzSW47XG4iLCJ2YXIgYmFzZUlzRXF1YWxEZWVwID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWxEZWVwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtib29sZWFufSBbYml0bWFza10gVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy5cbiAqICBUaGUgYml0bWFzayBtYXkgYmUgY29tcG9zZWQgb2YgdGhlIGZvbGxvd2luZyBmbGFnczpcbiAqICAgICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAgICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdCh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJhc2VJc0VxdWFsLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWw7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBlcXVhbEJ5VGFnID0gcmVxdWlyZSgnLi9fZXF1YWxCeVRhZycpLFxuICAgIGVxdWFsT2JqZWN0cyA9IHJlcXVpcmUoJy4vX2VxdWFsT2JqZWN0cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0hvc3RPYmplY3QgPSByZXF1aXJlKCcuL19pc0hvc3RPYmplY3QnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IFtiaXRtYXNrXSBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBhcnJheVRhZyxcbiAgICAgIG90aFRhZyA9IGFycmF5VGFnO1xuXG4gIGlmICghb2JqSXNBcnIpIHtcbiAgICBvYmpUYWcgPSBnZXRUYWcob2JqZWN0KTtcbiAgICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgfVxuICBpZiAoIW90aElzQXJyKSB7XG4gICAgb3RoVGFnID0gZ2V0VGFnKG90aGVyKTtcbiAgICBvdGhUYWcgPSBvdGhUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG90aFRhZztcbiAgfVxuICB2YXIgb2JqSXNPYmogPSBvYmpUYWcgPT0gb2JqZWN0VGFnICYmICFpc0hvc3RPYmplY3Qob2JqZWN0KSxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyAmJiAhaXNIb3N0T2JqZWN0KG90aGVyKSxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgUEFSVElBTF9DT01QQVJFX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsIG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlciwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzU2FtZVRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICByZXR1cm4gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0VxdWFsRGVlcDtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBVTk9SREVSRURfQ09NUEFSRV9GTEFHID0gMSxcbiAgICBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXRjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0FycmF5fSBtYXRjaERhdGEgVGhlIHByb3BlcnR5IG5hbWVzLCB2YWx1ZXMsIGFuZCBjb21wYXJlIGZsYWdzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYG9iamVjdGAgaXMgYSBtYXRjaCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNNYXRjaChvYmplY3QsIHNvdXJjZSwgbWF0Y2hEYXRhLCBjdXN0b21pemVyKSB7XG4gIHZhciBpbmRleCA9IG1hdGNoRGF0YS5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBpbmRleCxcbiAgICAgIG5vQ3VzdG9taXplciA9ICFjdXN0b21pemVyO1xuXG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiAhbGVuZ3RoO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBkYXRhID0gbWF0Y2hEYXRhW2luZGV4XTtcbiAgICBpZiAoKG5vQ3VzdG9taXplciAmJiBkYXRhWzJdKVxuICAgICAgICAgID8gZGF0YVsxXSAhPT0gb2JqZWN0W2RhdGFbMF1dXG4gICAgICAgICAgOiAhKGRhdGFbMF0gaW4gb2JqZWN0KVxuICAgICAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBkYXRhID0gbWF0Y2hEYXRhW2luZGV4XTtcbiAgICB2YXIga2V5ID0gZGF0YVswXSxcbiAgICAgICAgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgc3JjVmFsdWUgPSBkYXRhWzFdO1xuXG4gICAgaWYgKG5vQ3VzdG9taXplciAmJiBkYXRhWzJdKSB7XG4gICAgICBpZiAob2JqVmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YWNrID0gbmV3IFN0YWNrLFxuICAgICAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoIShyZXN1bHQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIGN1c3RvbWl6ZXIsIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgfCBQQVJUSUFMX0NPTVBBUkVfRkxBRywgc3RhY2spXG4gICAgICAgICAgICA6IHJlc3VsdFxuICAgICAgICAgICkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXRjaDtcbiIsInZhciBiYXNlTWF0Y2hlcyA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzJyksXG4gICAgYmFzZU1hdGNoZXNQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgcHJvcGVydHkgPSByZXF1aXJlKCcuL3Byb3BlcnR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXRlcmF0ZWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IFt2YWx1ZT1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhbiBpdGVyYXRlZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgaXRlcmF0ZWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJdGVyYXRlZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHR5cGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodHlwZSA9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBpc0FycmF5KHZhbHVlKVxuICAgICAgPyBiYXNlTWF0Y2hlc1Byb3BlcnR5KHZhbHVlWzBdLCB2YWx1ZVsxXSlcbiAgICAgIDogYmFzZU1hdGNoZXModmFsdWUpO1xuICB9XG4gIHJldHVybiBwcm9wZXJ0eSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUl0ZXJhdGVlO1xuIiwiLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBPYmplY3Qua2V5cztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHNraXAgdGhlIGNvbnN0cnVjdG9yXG4gKiBwcm9wZXJ0eSBvZiBwcm90b3R5cGVzIG9yIHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICByZXR1cm4gbmF0aXZlS2V5cyhPYmplY3Qob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCJ2YXIgYmFzZUlzTWF0Y2ggPSByZXF1aXJlKCcuL19iYXNlSXNNYXRjaCcpLFxuICAgIGdldE1hdGNoRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hdGNoRGF0YScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNvdXJjZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gIHZhciBtYXRjaERhdGEgPSBnZXRNYXRjaERhdGEoc291cmNlKTtcbiAgaWYgKG1hdGNoRGF0YS5sZW5ndGggPT0gMSAmJiBtYXRjaERhdGFbMF1bMl0pIHtcbiAgICB2YXIga2V5ID0gbWF0Y2hEYXRhWzBdWzBdLFxuICAgICAgICB2YWx1ZSA9IG1hdGNoRGF0YVswXVsxXTtcblxuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqZWN0W2tleV0gPT09IHZhbHVlICYmXG4gICAgICAgICh2YWx1ZSAhPT0gdW5kZWZpbmVkIHx8IChrZXkgaW4gT2JqZWN0KG9iamVjdCkpKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09PSBzb3VyY2UgfHwgYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXM7XG4iLCJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpLFxuICAgIGdldCA9IHJlcXVpcmUoJy4vZ2V0JyksXG4gICAgaGFzSW4gPSByZXF1aXJlKCcuL2hhc0luJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNvbXBhcmlzb24gc3R5bGVzLiAqL1xudmFyIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgPSAxLFxuICAgIFBBUlRJQUxfQ09NUEFSRV9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzUHJvcGVydHlgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNyY1ZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzUHJvcGVydHkocGF0aCwgc3JjVmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBvYmpWYWx1ZSA9IGdldChvYmplY3QsIHBhdGgpO1xuICAgIHJldHVybiAob2JqVmFsdWUgPT09IHVuZGVmaW5lZCAmJiBvYmpWYWx1ZSA9PT0gc3JjVmFsdWUpXG4gICAgICA/IGhhc0luKG9iamVjdCwgcGF0aClcbiAgICAgIDogYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCB1bmRlZmluZWQsIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgfCBQQVJUSUFMX0NPTVBBUkVfRkxBRyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXNQcm9wZXJ0eTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUHJvcGVydHlgIHdoaWNoIHN1cHBvcnRzIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5RGVlcChwYXRoKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eURlZXA7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNsaWNlYCB3aXRob3V0IGFuIGl0ZXJhdGVlIGNhbGwgZ3VhcmQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzbGljZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IHBvc2l0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtlbmQ9YXJyYXkubGVuZ3RoXSBUaGUgZW5kIHBvc2l0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlU2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gLXN0YXJ0ID4gbGVuZ3RoID8gMCA6IChsZW5ndGggKyBzdGFydCk7XG4gIH1cbiAgZW5kID0gZW5kID4gbGVuZ3RoID8gbGVuZ3RoIDogZW5kO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgbGVuZ3RoID0gc3RhcnQgPiBlbmQgPyAwIDogKChlbmQgLSBzdGFydCkgPj4+IDApO1xuICBzdGFydCA+Pj49IDA7XG5cbiAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGFycmF5W2luZGV4ICsgc3RhcnRdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNsaWNlO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvUGFpcnNgIGFuZCBgXy50b1BhaXJzSW5gIHdoaWNoIGNyZWF0ZXMgYW4gYXJyYXlcbiAqIG9mIGtleS12YWx1ZSBwYWlycyBmb3IgYG9iamVjdGAgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYHByb3BzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGdldCB2YWx1ZXMgZm9yLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvUGFpcnMob2JqZWN0LCBwcm9wcykge1xuICByZXR1cm4gYXJyYXlNYXAocHJvcHMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBba2V5LCBvYmplY3Rba2V5XV07XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUb1BhaXJzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGdsb2JhbCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge251bGx8T2JqZWN0fSBSZXR1cm5zIGB2YWx1ZWAgaWYgaXQncyBhIGdsb2JhbCBvYmplY3QsIGVsc2UgYG51bGxgLlxuICovXG5mdW5jdGlvbiBjaGVja0dsb2JhbCh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHZhbHVlLk9iamVjdCA9PT0gT2JqZWN0KSA/IHZhbHVlIDogbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja0dsb2JhbDtcbiIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IG5ldyBidWZmZXIuY29uc3RydWN0b3IoYnVmZmVyLmxlbmd0aCk7XG4gIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVCdWZmZXI7XG4iLCJ2YXIgYWRkTWFwRW50cnkgPSByZXF1aXJlKCcuL19hZGRNYXBFbnRyeScpLFxuICAgIGFycmF5UmVkdWNlID0gcmVxdWlyZSgnLi9fYXJyYXlSZWR1Y2UnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIG1hcC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVNYXAobWFwKSB7XG4gIHJldHVybiBhcnJheVJlZHVjZShtYXBUb0FycmF5KG1hcCksIGFkZE1hcEVudHJ5LCBuZXcgbWFwLmNvbnN0cnVjdG9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZU1hcDtcbiIsIi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgcmVnZXhwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHJlZ2V4cCBUaGUgcmVnZXhwIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHJlZ2V4cC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVSZWdFeHAocmVnZXhwKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgcmVnZXhwLmNvbnN0cnVjdG9yKHJlZ2V4cC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhyZWdleHApKTtcbiAgcmVzdWx0Lmxhc3RJbmRleCA9IHJlZ2V4cC5sYXN0SW5kZXg7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVSZWdFeHA7XG4iLCJ2YXIgYWRkU2V0RW50cnkgPSByZXF1aXJlKCcuL19hZGRTZXRFbnRyeScpLFxuICAgIGFycmF5UmVkdWNlID0gcmVxdWlyZSgnLi9fYXJyYXlSZWR1Y2UnKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgc2V0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHNldC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTZXQoc2V0KSB7XG4gIHJldHVybiBhcnJheVJlZHVjZShzZXRUb0FycmF5KHNldCksIGFkZFNldEVudHJ5LCBuZXcgc2V0LmNvbnN0cnVjdG9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVNldDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBgc3ltYm9sYCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeW1ib2wgVGhlIHN5bWJvbCBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTeW1ib2woc3ltYm9sKSB7XG4gIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lU3ltYm9sO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB0eXBlZEFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHR5cGVkQXJyYXkgVGhlIHR5cGVkIGFycmF5IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCB0eXBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2xvbmVUeXBlZEFycmF5KHR5cGVkQXJyYXksIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcih0eXBlZEFycmF5LmJ1ZmZlcikgOiB0eXBlZEFycmF5LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyB0eXBlZEFycmF5LmNvbnN0cnVjdG9yKGJ1ZmZlciwgdHlwZWRBcnJheS5ieXRlT2Zmc2V0LCB0eXBlZEFycmF5Lmxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuIiwidmFyIGNvcHlPYmplY3RXaXRoID0gcmVxdWlyZSgnLi9fY29weU9iamVjdFdpdGgnKTtcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdFdpdGgoc291cmNlLCBwcm9wcywgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5T2JqZWN0O1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGNvcHlPYmplY3RgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBmdW5jdGlvbiB0b1xuICogY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3RXaXRoKHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG5cbiAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKVxuICAgICAgOiBzb3VyY2Vba2V5XTtcblxuICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5T2JqZWN0V2l0aDtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBzeW1ib2wgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG4iLCJ2YXIgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gbGlrZSBgXy5hc3NpZ25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gcmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZDtcblxuICAgIGN1c3RvbWl6ZXIgPSB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIGFycmF5U29tZSA9IHJlcXVpcmUoJy4vX2FycmF5U29tZScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBVTk9SREVSRURfQ09NUEFSRV9GTEFHID0gMSxcbiAgICBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBQQVJUSUFMX0NPTVBBUkVfRkxBRyxcbiAgICAgIGlzVW5vcmRlcmVkID0gYml0bWFzayAmIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KGFycmF5LCBvdGhlcik7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChpc1Vub3JkZXJlZCkge1xuICAgICAgaWYgKCFhcnJheVNvbWUob3RoZXIsIGZ1bmN0aW9uKG90aFZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQXJyYXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIFVpbnQ4QXJyYXkgPSByZXF1aXJlKCcuL19VaW50OEFycmF5JyksXG4gICAgZXF1YWxBcnJheXMgPSByZXF1aXJlKCcuL19lcXVhbEFycmF5cycpLFxuICAgIG1hcFRvQXJyYXkgPSByZXF1aXJlKCcuL19tYXBUb0FycmF5JyksXG4gICAgc2V0VG9BcnJheSA9IHJlcXVpcmUoJy4vX3NldFRvQXJyYXknKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY29tcGFyaXNvbiBzdHlsZXMuICovXG52YXIgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyA9IDEsXG4gICAgUEFSVElBTF9DT01QQVJFX0ZMQUcgPSAyO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWJlcnMsIGRhdGVzIHRvIG1pbGxpc2Vjb25kcyBhbmQgYm9vbGVhbnNcbiAgICAgIC8vIHRvIGAxYCBvciBgMGAgdHJlYXRpbmcgaW52YWxpZCBkYXRlcyBjb2VyY2VkIHRvIGBOYU5gIGFzIG5vdCBlcXVhbC5cbiAgICAgIHJldHVybiArb2JqZWN0ID09ICtvdGhlcjtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBUcmVhdCBgTmFOYCB2cy4gYE5hTmAgYXMgZXF1YWwuXG4gICAgICByZXR1cm4gKG9iamVjdCAhPSArb2JqZWN0KSA/IG90aGVyICE9ICtvdGhlciA6IG9iamVjdCA9PSArb3RoZXI7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MgcHJpbWl0aXZlcyBhbmQgc3RyaW5nXG4gICAgICAvLyBvYmplY3RzIGFzIGVxdWFsLiBTZWUgaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMTAuNi40IGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgdmFyIGNvbnZlcnQgPSBtYXBUb0FycmF5O1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHO1xuICAgICAgY29udmVydCB8fCAoY29udmVydCA9IHNldFRvQXJyYXkpO1xuXG4gICAgICBpZiAob2JqZWN0LnNpemUgIT0gb3RoZXIuc2l6ZSAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gICAgICBpZiAoc3RhY2tlZCkge1xuICAgICAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgICAgIH1cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgcmV0dXJuIGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzayB8IFVOT1JERVJFRF9DT01QQVJFX0ZMQUcsIHN0YWNrLnNldChvYmplY3QsIG90aGVyKSk7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIGlmIChzeW1ib2xWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBzeW1ib2xWYWx1ZU9mLmNhbGwob2JqZWN0KSA9PSBzeW1ib2xWYWx1ZU9mLmNhbGwob3RoZXIpO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbEJ5VGFnO1xuIiwidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBQQVJUSUFMX0NPTVBBUkVfRkxBRyxcbiAgICAgIG9ialByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBrZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGJhc2VIYXMob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxPYmplY3RzO1xuIiwidmFyIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eScpO1xuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcbiIsInZhciBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICB0b1BhaXJzID0gcmVxdWlyZSgnLi90b1BhaXJzJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3Mgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbWF0Y2ggZGF0YSBvZiBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gZ2V0TWF0Y2hEYXRhKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gdG9QYWlycyhvYmplY3QpLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICByZXN1bHRbbGVuZ3RoXVsyXSA9IGlzU3RyaWN0Q29tcGFyYWJsZShyZXN1bHRbbGVuZ3RoXVsxXSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXRjaERhdGE7XG4iLCJ2YXIgaXNOYXRpdmUgPSByZXF1aXJlKCcuL2lzTmF0aXZlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgcmV0dXJuIGlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsIi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIHN5bWJvbCBwcm9wZXJ0aWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzIHx8IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gW107XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHM7XG4iLCJ2YXIgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgbWFwQ3RvclN0cmluZyA9IE1hcCA/IGZ1bmNUb1N0cmluZy5jYWxsKE1hcCkgOiAnJyxcbiAgICBzZXRDdG9yU3RyaW5nID0gU2V0ID8gZnVuY1RvU3RyaW5nLmNhbGwoU2V0KSA6ICcnLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gV2Vha01hcCA/IGZ1bmNUb1N0cmluZy5jYWxsKFdlYWtNYXApIDogJyc7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFRhZyh2YWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8vIEZhbGxiYWNrIGZvciBJRSAxMSBwcm92aWRpbmcgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgZm9yIG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy5cbmlmICgoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiBudWxsLFxuICAgICAgICBjdG9yU3RyaW5nID0gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyA/IGZ1bmNUb1N0cmluZy5jYWxsKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUYWc7XG4iLCJ2YXIgYmFzZUNhc3RQYXRoID0gcmVxdWlyZSgnLi9fYmFzZUNhc3RQYXRoJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzU3RyaW5nID0gcmVxdWlyZSgnLi9pc1N0cmluZycpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuL2xhc3QnKSxcbiAgICBwYXJlbnQgPSByZXF1aXJlKCcuL19wYXJlbnQnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGV4aXN0cyBvbiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYXNGdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjayBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzUGF0aChvYmplY3QsIHBhdGgsIGhhc0Z1bmMpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciByZXN1bHQgPSBoYXNGdW5jKG9iamVjdCwgcGF0aCk7XG4gIGlmICghcmVzdWx0ICYmICFpc0tleShwYXRoKSkge1xuICAgIHBhdGggPSBiYXNlQ2FzdFBhdGgocGF0aCk7XG4gICAgb2JqZWN0ID0gcGFyZW50KG9iamVjdCwgcGF0aCk7XG4gICAgaWYgKG9iamVjdCAhPSBudWxsKSB7XG4gICAgICBwYXRoID0gbGFzdChwYXRoKTtcbiAgICAgIHJlc3VsdCA9IGhhc0Z1bmMob2JqZWN0LCBwYXRoKTtcbiAgICB9XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iamVjdCA/IG9iamVjdC5sZW5ndGggOiB1bmRlZmluZWQ7XG4gIHJldHVybiByZXN1bHQgfHwgKFxuICAgICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChwYXRoLCBsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc1N0cmluZyhvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpXG4gICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzUGF0aDtcbiIsInZhciBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShoYXNoLCBrZXkpIHtcbiAgcmV0dXJuIGhhc2hIYXMoaGFzaCwga2V5KSAmJiBkZWxldGUgaGFzaFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hEZWxldGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChoYXNoLCBrZXkpIHtcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBoYXNoW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaGFzaCwga2V5KSA/IGhhc2hba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoR2V0O1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhoYXNoLCBrZXkpIHtcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IGhhc2hba2V5XSAhPT0gdW5kZWZpbmVkIDogaGFzT3duUHJvcGVydHkuY2FsbChoYXNoLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hIYXM7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGhhc2gsIGtleSwgdmFsdWUpIHtcbiAgaGFzaFtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaFNldDtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBpbmRleCBrZXlzIGZvciBgb2JqZWN0YCB2YWx1ZXMgb2YgYXJyYXlzLFxuICogYGFyZ3VtZW50c2Agb2JqZWN0cywgYW5kIHN0cmluZ3MsIG90aGVyd2lzZSBgbnVsbGAgaXMgcmV0dXJuZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheXxudWxsfSBSZXR1cm5zIGluZGV4IGtleXMsIGVsc2UgYG51bGxgLlxuICovXG5mdW5jdGlvbiBpbmRleEtleXMob2JqZWN0KSB7XG4gIHZhciBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogdW5kZWZpbmVkO1xuICBpZiAoaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc1N0cmluZyhvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIGJhc2VUaW1lcyhsZW5ndGgsIFN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5kZXhLZXlzO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBhcnJheSBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQXJyYXkoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgLy8gQWRkIHByb3BlcnRpZXMgYXNzaWduZWQgYnkgYFJlZ0V4cCNleGVjYC5cbiAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcbiAgICByZXN1bHQuaW5kZXggPSBhcnJheS5pbmRleDtcbiAgICByZXN1bHQuaW5wdXQgPSBhcnJheS5pbnB1dDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUFycmF5O1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyksXG4gICAgY2xvbmVNYXAgPSByZXF1aXJlKCcuL19jbG9uZU1hcCcpLFxuICAgIGNsb25lUmVnRXhwID0gcmVxdWlyZSgnLi9fY2xvbmVSZWdFeHAnKSxcbiAgICBjbG9uZVNldCA9IHJlcXVpcmUoJy4vX2Nsb25lU2V0JyksXG4gICAgY2xvbmVTeW1ib2wgPSByZXF1aXJlKCcuL19jbG9uZVN5bWJvbCcpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNsb25pbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGlzRGVlcCkge1xuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lQXJyYXlCdWZmZXIob2JqZWN0KTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3IoK29iamVjdCk7XG5cbiAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcbiAgICBjYXNlIGludDhUYWc6IGNhc2UgaW50MTZUYWc6IGNhc2UgaW50MzJUYWc6XG4gICAgY2FzZSB1aW50OFRhZzogY2FzZSB1aW50OENsYW1wZWRUYWc6IGNhc2UgdWludDE2VGFnOiBjYXNlIHVpbnQzMlRhZzpcbiAgICAgIHJldHVybiBjbG9uZVR5cGVkQXJyYXkob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVNYXAob2JqZWN0KTtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTZXQob2JqZWN0KTtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgcmV0dXJuIGNsb25lU3ltYm9sKG9iamVjdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVCeVRhZztcbiIsInZhciBiYXNlQ3JlYXRlID0gcmVxdWlyZSgnLi9fYmFzZUNyZWF0ZScpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlT2Yob2JqZWN0KSlcbiAgICA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZU9iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCBpbiBJRSA8IDkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0hvc3RPYmplY3QodmFsdWUpIHtcbiAgLy8gTWFueSBob3N0IG9iamVjdHMgYXJlIGBPYmplY3RgIG9iamVjdHMgdGhhdCBjYW4gY29lcmNlIHRvIHN0cmluZ3NcbiAgLy8gZGVzcGl0ZSBoYXZpbmcgaW1wcm9wZXJseSBkZWZpbmVkIGB0b1N0cmluZ2AgbWV0aG9kcy5cbiAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICBpZiAodmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSAhISh2YWx1ZSArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNIb3N0T2JqZWN0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhbHVlID0gKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgPyArdmFsdWUgOiAtMTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJdGVyYXRlZUNhbGw7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuICFpc0FycmF5KHZhbHVlKSAmJlxuICAgIChyZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpIHx8ICFyZUlzRGVlcFByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAodHlwZSA9PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPSAnX19wcm90b19fJykgfHwgdmFsdWUgPT0gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpZiBzdWl0YWJsZSBmb3Igc3RyaWN0XG4gKiAgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgJiYgIWlzT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmljdENvbXBhcmFibGU7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogTWFwID8gbmV3IE1hcCA6IFtdLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENsZWFyO1xuIiwidmFyIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIGFzc29jRGVsZXRlID0gcmVxdWlyZSgnLi9fYXNzb2NEZWxldGUnKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChpc0tleWFibGUoa2V5KSkge1xuICAgIHJldHVybiBoYXNoRGVsZXRlKHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaCwga2V5KTtcbiAgfVxuICByZXR1cm4gTWFwID8gZGF0YS5tYXBbJ2RlbGV0ZSddKGtleSkgOiBhc3NvY0RlbGV0ZShkYXRhLm1hcCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBEZWxldGU7XG4iLCJ2YXIgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgYXNzb2NHZXQgPSByZXF1aXJlKCcuL19hc3NvY0dldCcpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGlzS2V5YWJsZShrZXkpKSB7XG4gICAgcmV0dXJuIGhhc2hHZXQodHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/IGRhdGEuc3RyaW5nIDogZGF0YS5oYXNoLCBrZXkpO1xuICB9XG4gIHJldHVybiBNYXAgPyBkYXRhLm1hcC5nZXQoa2V5KSA6IGFzc29jR2V0KGRhdGEubWFwLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcEdldDtcbiIsInZhciBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBhc3NvY0hhcyA9IHJlcXVpcmUoJy4vX2Fzc29jSGFzJyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGlzS2V5YWJsZShrZXkpKSB7XG4gICAgcmV0dXJuIGhhc2hIYXModHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/IGRhdGEuc3RyaW5nIDogZGF0YS5oYXNoLCBrZXkpO1xuICB9XG4gIHJldHVybiBNYXAgPyBkYXRhLm1hcC5oYXMoa2V5KSA6IGFzc29jSGFzKGRhdGEubWFwLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcEhhcztcbiIsInZhciBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBhc3NvY1NldCA9IHJlcXVpcmUoJy4vX2Fzc29jU2V0JyksXG4gICAgaGFzaFNldCA9IHJlcXVpcmUoJy4vX2hhc2hTZXQnKSxcbiAgICBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gbWFwU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKGtleSkpIHtcbiAgICBoYXNoU2V0KHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaCwga2V5LCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoTWFwKSB7XG4gICAgZGF0YS5tYXAuc2V0KGtleSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGFzc29jU2V0KGRhdGEubWFwLCBrZXksIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBTZXQ7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGFuIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY29udmVydGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBUb0FycmF5O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUNyZWF0ZTtcbiIsInZhciBiYXNlU2xpY2UgPSByZXF1aXJlKCcuL19iYXNlU2xpY2UnKSxcbiAgICBnZXQgPSByZXF1aXJlKCcuL2dldCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHBhcmVudCB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGggVGhlIHBhdGggdG8gZ2V0IHRoZSBwYXJlbnQgdmFsdWUgb2YuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcGFyZW50IHZhbHVlLlxuICovXG5mdW5jdGlvbiBwYXJlbnQob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBwYXRoLmxlbmd0aCA9PSAxID8gb2JqZWN0IDogZ2V0KG9iamVjdCwgYmFzZVNsaWNlKHBhdGgsIDAsIC0xKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyZW50O1xuIiwidmFyIGNoZWNrR2xvYmFsID0gcmVxdWlyZSgnLi9fY2hlY2tHbG9iYWwnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgYE9iamVjdGAuICovXG52YXIgb2JqZWN0VHlwZXMgPSB7XG4gICdmdW5jdGlvbic6IHRydWUsXG4gICdvYmplY3QnOiB0cnVlXG59O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gKG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlKVxuICA/IGV4cG9ydHNcbiAgOiB1bmRlZmluZWQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gKG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlKVxuICA/IG1vZHVsZVxuICA6IHVuZGVmaW5lZDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gY2hlY2tHbG9iYWwoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2Ygc2VsZl0gJiYgc2VsZik7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgd2luZG93YC4gKi9cbnZhciBmcmVlV2luZG93ID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHdpbmRvd10gJiYgd2luZG93KTtcblxuLyoqIERldGVjdCBgdGhpc2AgYXMgdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgdGhpc0dsb2JhbCA9IGNoZWNrR2xvYmFsKG9iamVjdFR5cGVzW3R5cGVvZiB0aGlzXSAmJiB0aGlzKTtcblxuLyoqXG4gKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LlxuICpcbiAqIFRoZSBgdGhpc2AgdmFsdWUgaXMgdXNlZCBpZiBpdCdzIHRoZSBnbG9iYWwgb2JqZWN0IHRvIGF2b2lkIEdyZWFzZW1vbmtleSdzXG4gKiByZXN0cmljdGVkIGB3aW5kb3dgIG9iamVjdCwgb3RoZXJ3aXNlIHRoZSBgd2luZG93YCBvYmplY3QgaXMgdXNlZC5cbiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8XG4gICgoZnJlZVdpbmRvdyAhPT0gKHRoaXNHbG9iYWwgJiYgdGhpc0dsb2JhbC53aW5kb3cpKSAmJiBmcmVlV2luZG93KSB8fFxuICAgIGZyZWVTZWxmIHx8IHRoaXNHbG9iYWwgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgc2V0YCB0byBhbiBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IHsgJ2FycmF5JzogW10sICdtYXAnOiBudWxsIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsInZhciBhc3NvY0RlbGV0ZSA9IHJlcXVpcmUoJy4vX2Fzc29jRGVsZXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBhcnJheSA9IGRhdGEuYXJyYXk7XG5cbiAgcmV0dXJuIGFycmF5ID8gYXNzb2NEZWxldGUoYXJyYXksIGtleSkgOiBkYXRhLm1hcFsnZGVsZXRlJ10oa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsInZhciBhc3NvY0dldCA9IHJlcXVpcmUoJy4vX2Fzc29jR2V0Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBhcnJheSA9IGRhdGEuYXJyYXk7XG5cbiAgcmV0dXJuIGFycmF5ID8gYXNzb2NHZXQoYXJyYXksIGtleSkgOiBkYXRhLm1hcC5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsInZhciBhc3NvY0hhcyA9IHJlcXVpcmUoJy4vX2Fzc29jSGFzJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgYXJyYXkgPSBkYXRhLmFycmF5O1xuXG4gIHJldHVybiBhcnJheSA/IGFzc29jSGFzKGFycmF5LCBrZXkpIDogZGF0YS5tYXAuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpLFxuICAgIGFzc29jU2V0ID0gcmVxdWlyZSgnLi9fYXNzb2NTZXQnKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgYXJyYXkgPSBkYXRhLmFycmF5O1xuXG4gIGlmIChhcnJheSkge1xuICAgIGlmIChhcnJheS5sZW5ndGggPCAoTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBhc3NvY1NldChhcnJheSwga2V5LCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEuYXJyYXkgPSBudWxsO1xuICAgICAgZGF0YS5tYXAgPSBuZXcgTWFwQ2FjaGUoYXJyYXkpO1xuICAgIH1cbiAgfVxuICB2YXIgbWFwID0gZGF0YS5tYXA7XG4gIGlmIChtYXApIHtcbiAgICBtYXAuc2V0KGtleSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrU2V0O1xuIiwidmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVQcm9wTmFtZSA9IC9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdL2c7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ1RvUGF0aChzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB0b1N0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nVG9QYXRoO1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQXNzaWduZXInKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiogRGV0ZWN0IGlmIHByb3BlcnRpZXMgc2hhZG93aW5nIHRob3NlIG9uIGBPYmplY3QucHJvdG90eXBlYCBhcmUgbm9uLWVudW1lcmFibGUuICovXG52YXIgbm9uRW51bVNoYWRvd3MgPSAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7ICd2YWx1ZU9mJzogMSB9LCAndmFsdWVPZicpO1xuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0cyB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdC4gU291cmNlIG9iamVjdHMgYXJlIGFwcGxpZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LiBTdWJzZXF1ZW50IHNvdXJjZXNcbiAqIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgIGFuZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYE9iamVjdC5hc3NpZ25gXShodHRwczovL21kbi5pby9PYmplY3QvYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYyA9IDM7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gQmFyKCkge1xuICogICB0aGlzLmUgPSA1O1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuZCA9IDQ7XG4gKiBCYXIucHJvdG90eXBlLmYgPSA2O1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIG5ldyBGb28sIG5ldyBCYXIpO1xuICogLy8gPT4geyAnYSc6IDEsICdjJzogMywgJ2UnOiA1IH1cbiAqL1xudmFyIGFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlKSB7XG4gIGlmIChub25FbnVtU2hhZG93cyB8fCBpc1Byb3RvdHlwZShzb3VyY2UpIHx8IGlzQXJyYXlMaWtlKHNvdXJjZSkpIHtcbiAgICBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xuICAgIHJldHVybjtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgc291cmNlW2tleV0pO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uY2xvbmVgIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IGNsb25lcyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmVjdXJzaXZlbHkgY2xvbmUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZGVlcCBjbG9uZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICpcbiAqIHZhciBkZWVwID0gXy5jbG9uZURlZXAob2JqZWN0cyk7XG4gKiBjb25zb2xlLmxvZyhkZWVwWzBdID09PSBvYmplY3RzWzBdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCB0cnVlLCB0cnVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURlZXA7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBnZXR0ZXIgPSBfLmNvbnN0YW50KG9iamVjdCk7XG4gKlxuICogZ2V0dGVyKCkgPT09IG9iamVjdDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcbiIsIi8qKlxuICogUGVyZm9ybXMgYSBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKiB2YXIgb3RoZXIgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcbiIsInZhciBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgYmFzZUZpbmQgPSByZXF1aXJlKCcuL19iYXNlRmluZCcpLFxuICAgIGJhc2VGaW5kSW5kZXggPSByZXF1aXJlKCcuL19iYXNlRmluZEluZGV4JyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gLCByZXR1cm5pbmcgdGhlIGZpcnN0IGVsZW1lbnRcbiAqIGBwcmVkaWNhdGVgIHJldHVybnMgdHJ1dGh5IGZvci4gVGhlIHByZWRpY2F0ZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gc2VhcmNoLlxuICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWF0Y2hlZCBlbGVtZW50LCBlbHNlIGB1bmRlZmluZWRgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FnZSc6IDEsICAnYWN0aXZlJzogdHJ1ZSB9XG4gKiBdO1xuICpcbiAqIF8uZmluZCh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby5hZ2UgPCA0MDsgfSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdiYXJuZXknXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgeyAnYWdlJzogMSwgJ2FjdGl2ZSc6IHRydWUgfSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdwZWJibGVzJ1xuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gb2JqZWN0IGZvciAnZnJlZCdcbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgJ2FjdGl2ZScpO1xuICogLy8gPT4gb2JqZWN0IGZvciAnYmFybmV5J1xuICovXG5mdW5jdGlvbiBmaW5kKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSkge1xuICBwcmVkaWNhdGUgPSBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKTtcbiAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICB2YXIgaW5kZXggPSBiYXNlRmluZEluZGV4KGNvbGxlY3Rpb24sIHByZWRpY2F0ZSk7XG4gICAgcmV0dXJuIGluZGV4ID4gLTEgPyBjb2xsZWN0aW9uW2luZGV4XSA6IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gYmFzZUZpbmQoY29sbGVjdGlvbiwgcHJlZGljYXRlLCBiYXNlRWFjaCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZDtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBgb2JqZWN0YC4gSWYgdGhlIHJlc29sdmVkIHZhbHVlIGlzXG4gKiBgdW5kZWZpbmVkYCB0aGUgYGRlZmF1bHRWYWx1ZWAgaXMgdXNlZCBpbiBpdHMgcGxhY2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdIFRoZSB2YWx1ZSByZXR1cm5lZCBpZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaXMgYHVuZGVmaW5lZGAuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH1dIH07XG4gKlxuICogXy5nZXQob2JqZWN0LCAnYVswXS5iLmMnKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsIFsnYScsICcwJywgJ2InLCAnYyddKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsICdhLmIuYycsICdkZWZhdWx0Jyk7XG4gKiAvLyA9PiAnZGVmYXVsdCdcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciByZXN1bHQgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldDtcbiIsInZhciBiYXNlSGFzSW4gPSByZXF1aXJlKCcuL19iYXNlSGFzSW4nKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3Qgb3IgaW5oZXJpdGVkIHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IF8uY3JlYXRlKHsgJ2MnOiAzIH0pIH0pIH0pO1xuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYS5iLmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgWydhJywgJ2InLCAnYyddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2InKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhc0luKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzSW47XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGdpdmVuIHRvIGl0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0O1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG4iLCJ2YXIgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAvLyBTYWZhcmkgOC4xIGluY29ycmVjdGx5IG1ha2VzIGBhcmd1bWVudHMuY2FsbGVlYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICghcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpIHx8IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgZ2V0TGVuZ3RoID0gcmVxdWlyZSgnLi9fZ2V0TGVuZ3RoJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS1saWtlIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlT2JqZWN0O1xuIiwidmFyIGNvbnN0YW50ID0gcmVxdWlyZSgnLi9jb25zdGFudCcpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgLiAqL1xudmFyIG9iamVjdFR5cGVzID0ge1xuICAnZnVuY3Rpb24nOiB0cnVlLFxuICAnb2JqZWN0JzogdHJ1ZVxufTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IChvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSlcbiAgPyBleHBvcnRzXG4gIDogdW5kZWZpbmVkO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IChvYmplY3RUeXBlc1t0eXBlb2YgbW9kdWxlXSAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSlcbiAgPyBtb2R1bGVcbiAgOiB1bmRlZmluZWQ7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IChmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHMpXG4gID8gZnJlZUV4cG9ydHNcbiAgOiB1bmRlZmluZWQ7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9ICFCdWZmZXIgPyBjb25zdGFudChmYWxzZSkgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBCdWZmZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIHdlYWsgbWFwIGNvbnN0cnVjdG9ycyxcbiAgLy8gYW5kIFBoYW50b21KUyAxLjkgd2hpY2ggcmV0dXJucyAnZnVuY3Rpb24nIGZvciBgTm9kZUxpc3RgIGluc3RhbmNlcy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGxvb3NlbHkgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNIb3N0T2JqZWN0ID0gcmVxdWlyZSgnLi9faXNIb3N0T2JqZWN0JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1wYXR0ZXJucykuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSA+IDUpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KGZ1bmNUb1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICAoaXNIb3N0T2JqZWN0KHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3IpLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgaXNIb3N0T2JqZWN0ID0gcmVxdWlyZSgnLi9faXNIb3N0T2JqZWN0JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBpbmZlciB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IuICovXG52YXIgb2JqZWN0Q3RvclN0cmluZyA9IGZ1bmNUb1N0cmluZy5jYWxsKE9iamVjdCk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChuZXcgRm9vKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdCh7ICd4JzogMCwgJ3knOiAwIH0pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgfHxcbiAgICAgIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpICE9IG9iamVjdFRhZyB8fCBpc0hvc3RPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwcm90byA9IGdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmXG4gICAgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiYgZnVuY1RvU3RyaW5nLmNhbGwoQ3RvcikgPT0gb2JqZWN0Q3RvclN0cmluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQbGFpbk9iamVjdDtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3RyaW5nYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fFxuICAgICghaXNBcnJheSh2YWx1ZSkgJiYgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIiwidmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPSB0eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPSB0eXBlZEFycmF5VGFnc1ttYXBUYWddID1cbnR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID1cbnR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzZXRUYWddID1cbnR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPSB0eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGluZGV4S2V5cyA9IHJlcXVpcmUoJy4vX2luZGV4S2V5cycpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCk7XG4gIGlmICghKGlzUHJvdG8gfHwgaXNBcnJheUxpa2Uob2JqZWN0KSkpIHtcbiAgICByZXR1cm4gYmFzZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgaW5kZXhlcyA9IGluZGV4S2V5cyhvYmplY3QpLFxuICAgICAgc2tpcEluZGV4ZXMgPSAhIWluZGV4ZXMsXG4gICAgICByZXN1bHQgPSBpbmRleGVzIHx8IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKGJhc2VIYXMob2JqZWN0LCBrZXkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKGtleSA9PSAnbGVuZ3RoJyB8fCBpc0luZGV4KGtleSwgbGVuZ3RoKSkpICYmXG4gICAgICAgICEoaXNQcm90byAmJiBrZXkgPT0gJ2NvbnN0cnVjdG9yJykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsIi8qKlxuICogR2V0cyB0aGUgbGFzdCBlbGVtZW50IG9mIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGxhc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmxhc3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IDNcbiAqL1xuZnVuY3Rpb24gbGFzdChhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICByZXR1cm4gbGVuZ3RoID8gYXJyYXlbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGFzdDtcbiIsIi8qKlxuICogQSBuby1vcGVyYXRpb24gZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB1bmRlZmluZWRgIHJlZ2FyZGxlc3Mgb2YgdGhlXG4gKiBhcmd1bWVudHMgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5ub29wKG9iamVjdCkgPT09IHVuZGVmaW5lZDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gbm9vcCgpIHtcbiAgLy8gTm8gb3BlcmF0aW9uIHBlcmZvcm1lZC5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBub29wO1xuIiwidmFyIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eScpLFxuICAgIGJhc2VQcm9wZXJ0eURlZXAgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHlEZWVwJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBhIGdpdmVuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbXG4gKiAgIHsgJ2EnOiB7ICdiJzogeyAnYyc6IDIgfSB9IH0sXG4gKiAgIHsgJ2EnOiB7ICdiJzogeyAnYyc6IDEgfSB9IH1cbiAqIF07XG4gKlxuICogXy5tYXAob2JqZWN0cywgXy5wcm9wZXJ0eSgnYS5iLmMnKSk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqXG4gKiBfLm1hcChfLnNvcnRCeShvYmplY3RzLCBfLnByb3BlcnR5KFsnYScsICdiJywgJ2MnXSkpLCAnYS5iLmMnKTtcbiAqIC8vID0+IFsxLCAyXVxuICovXG5mdW5jdGlvbiBwcm9wZXJ0eShwYXRoKSB7XG4gIHJldHVybiBpc0tleShwYXRoKSA/IGJhc2VQcm9wZXJ0eShwYXRoKSA6IGJhc2VQcm9wZXJ0eURlZXAocGF0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvcGVydHk7XG4iLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlXG4gKiBjcmVhdGVkIGZ1bmN0aW9uIGFuZCBhcmd1bWVudHMgZnJvbSBgc3RhcnRgIGFuZCBiZXlvbmQgcHJvdmlkZWQgYXMgYW4gYXJyYXkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uIHRoZSBbcmVzdCBwYXJhbWV0ZXJdKGh0dHBzOi8vbWRuLmlvL3Jlc3RfcGFyYW1ldGVycykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5yZXN0KGZ1bmN0aW9uKHdoYXQsIG5hbWVzKSB7XG4gKiAgIHJldHVybiB3aGF0ICsgJyAnICsgXy5pbml0aWFsKG5hbWVzKS5qb2luKCcsICcpICtcbiAqICAgICAoXy5zaXplKG5hbWVzKSA+IDEgPyAnLCAmICcgOiAnJykgKyBfLmxhc3QobmFtZXMpO1xuICogfSk7XG4gKlxuICogc2F5KCdoZWxsbycsICdmcmVkJywgJ2Jhcm5leScsICdwZWJibGVzJyk7XG4gKiAvLyA9PiAnaGVsbG8gZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIHJlc3QoZnVuYywgc3RhcnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogdG9JbnRlZ2VyKHN0YXJ0KSwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgc3dpdGNoIChzdGFydCkge1xuICAgICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFycmF5KTtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcnJheSk7XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgYXJyYXkpO1xuICAgIH1cbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICBpbmRleCA9IC0xO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IGFycmF5O1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3Q7XG4iLCJ2YXIgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwODtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIGludGVnZXIuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgbG9vc2VseSBiYXNlZCBvbiBbYFRvSW50ZWdlcmBdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2ludGVnZXIpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvSW50ZWdlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDBcbiAqXG4gKiBfLnRvSW50ZWdlcihJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9JbnRlZ2VyKCczJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiAwO1xuICB9XG4gIHZhbHVlID0gdG9OdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgPT09IElORklOSVRZIHx8IHZhbHVlID09PSAtSU5GSU5JVFkpIHtcbiAgICB2YXIgc2lnbiA9ICh2YWx1ZSA8IDAgPyAtMSA6IDEpO1xuICAgIHJldHVybiBzaWduICogTUFYX0lOVEVHRVI7XG4gIH1cbiAgdmFyIHJlbWFpbmRlciA9IHZhbHVlICUgMTtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IChyZW1haW5kZXIgPyB2YWx1ZSAtIHJlbWFpbmRlciA6IHZhbHVlKSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9JbnRlZ2VyO1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMnKTtcbiAqIC8vID0+IDNcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IGlzRnVuY3Rpb24odmFsdWUudmFsdWVPZikgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuIiwidmFyIGJhc2VUb1BhaXJzID0gcmVxdWlyZSgnLi9fYmFzZVRvUGFpcnMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBrZXktdmFsdWUgcGFpcnMgZm9yIGBvYmplY3RgIHdoaWNoXG4gKiBjYW4gYmUgY29uc3VtZWQgYnkgYF8uZnJvbVBhaXJzYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLnRvUGFpcnMobmV3IEZvbyk7XG4gKiAvLyA9PiBbWydhJywgMV0sIFsnYicsIDJdXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiB0b1BhaXJzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZVRvUGFpcnMob2JqZWN0LCBrZXlzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGFpcnM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBpZiBpdCdzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZFxuICogZm9yIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9TdHJpbmc7XG4iLCJ2YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMuICovXG52YXIgaWRDb3VudGVyID0gMDtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSB1bmlxdWUgSUQuIElmIGBwcmVmaXhgIGlzIGdpdmVuIHRoZSBJRCBpcyBhcHBlbmRlZCB0byBpdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcHJlZml4PScnXSBUaGUgdmFsdWUgdG8gcHJlZml4IHRoZSBJRCB3aXRoLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5pcXVlIElELlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnVuaXF1ZUlkKCdjb250YWN0XycpO1xuICogLy8gPT4gJ2NvbnRhY3RfMTA0J1xuICpcbiAqIF8udW5pcXVlSWQoKTtcbiAqIC8vID0+ICcxMDUnXG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZUlkKHByZWZpeCkge1xuICB2YXIgaWQgPSArK2lkQ291bnRlcjtcbiAgcmV0dXJuIHRvU3RyaW5nKHByZWZpeCkgKyBpZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1bmlxdWVJZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgTWluaVNpZ25hbEJpbmRpbmcgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNaW5pU2lnbmFsQmluZGluZyhmbiwgb25jZSwgdGhpc0FyZykge1xuICAgIGlmIChvbmNlID09PSB1bmRlZmluZWQpIG9uY2UgPSBmYWxzZTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNaW5pU2lnbmFsQmluZGluZyk7XG5cbiAgICB0aGlzLl9mbiA9IGZuO1xuICAgIHRoaXMuX29uY2UgPSBvbmNlO1xuICAgIHRoaXMuX3RoaXNBcmcgPSB0aGlzQXJnO1xuICAgIHRoaXMuX25leHQgPSB0aGlzLl9wcmV2ID0gdGhpcy5fb3duZXIgPSBudWxsO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE1pbmlTaWduYWxCaW5kaW5nLCBbe1xuICAgIGtleTogJ2RldGFjaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRldGFjaCgpIHtcbiAgICAgIGlmICh0aGlzLl9vd25lciA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgdGhpcy5fb3duZXIuZGV0YWNoKHRoaXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1pbmlTaWduYWxCaW5kaW5nO1xufSkoKTtcblxuZnVuY3Rpb24gX2FkZE1pbmlTaWduYWxCaW5kaW5nKHNlbGYsIG5vZGUpIHtcbiAgaWYgKCFzZWxmLl9oZWFkKSB7XG4gICAgc2VsZi5faGVhZCA9IG5vZGU7XG4gICAgc2VsZi5fdGFpbCA9IG5vZGU7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5fdGFpbC5fbmV4dCA9IG5vZGU7XG4gICAgbm9kZS5fcHJldiA9IHNlbGYuX3RhaWw7XG4gICAgc2VsZi5fdGFpbCA9IG5vZGU7XG4gIH1cblxuICBub2RlLl9vd25lciA9IHNlbGY7XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbnZhciBNaW5pU2lnbmFsID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTWluaVNpZ25hbCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWluaVNpZ25hbCk7XG5cbiAgICB0aGlzLl9oZWFkID0gdGhpcy5fdGFpbCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhNaW5pU2lnbmFsLCBbe1xuICAgIGtleTogJ2hhbmRsZXJzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlcnMoKSB7XG4gICAgICB2YXIgZXhpc3RzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMF07XG5cbiAgICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcblxuICAgICAgaWYgKGV4aXN0cykgcmV0dXJuICEhbm9kZTtcblxuICAgICAgdmFyIGVlID0gW107XG5cbiAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIGVlLnB1c2gobm9kZSk7XG4gICAgICAgIG5vZGUgPSBub2RlLl9uZXh0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGFzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFzKG5vZGUpIHtcbiAgICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBNaW5pU2lnbmFsQmluZGluZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaW5pU2lnbmFsI2hhcygpOiBGaXJzdCBhcmcgbXVzdCBiZSBhIE1pbmlTaWduYWxCaW5kaW5nIG9iamVjdC4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGUuX293bmVyID09PSB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2Rpc3BhdGNoJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG5cbiAgICAgIGlmICghbm9kZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5fb25jZSkgdGhpcy5kZXRhY2gobm9kZSk7XG4gICAgICAgIG5vZGUuX2ZuLmFwcGx5KG5vZGUuX3RoaXNBcmcsIGFyZ3VtZW50cyk7XG4gICAgICAgIG5vZGUgPSBub2RlLl9uZXh0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdhZGQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoZm4pIHtcbiAgICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblxuICAgICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pbmlTaWduYWwjYWRkKCk6IEZpcnN0IGFyZyBtdXN0IGJlIGEgRnVuY3Rpb24uJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX2FkZE1pbmlTaWduYWxCaW5kaW5nKHRoaXMsIG5ldyBNaW5pU2lnbmFsQmluZGluZyhmbiwgZmFsc2UsIHRoaXNBcmcpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdvbmNlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25jZShmbikge1xuICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzFdO1xuXG4gICAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWluaVNpZ25hbCNvbmNlKCk6IEZpcnN0IGFyZyBtdXN0IGJlIGEgRnVuY3Rpb24uJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX2FkZE1pbmlTaWduYWxCaW5kaW5nKHRoaXMsIG5ldyBNaW5pU2lnbmFsQmluZGluZyhmbiwgdHJ1ZSwgdGhpc0FyZykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2RldGFjaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgTWluaVNpZ25hbEJpbmRpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWluaVNpZ25hbCNkZXRhY2goKTogRmlyc3QgYXJnIG11c3QgYmUgYSBNaW5pU2lnbmFsQmluZGluZyBvYmplY3QuJyk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5fb3duZXIgIT09IHRoaXMpIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobm9kZS5fcHJldikgbm9kZS5fcHJldi5fbmV4dCA9IG5vZGUuX25leHQ7XG4gICAgICBpZiAobm9kZS5fbmV4dCkgbm9kZS5fbmV4dC5fcHJldiA9IG5vZGUuX3ByZXY7XG5cbiAgICAgIGlmIChub2RlID09PSB0aGlzLl9oZWFkKSB7XG4gICAgICAgIHRoaXMuX2hlYWQgPSBub2RlLl9uZXh0O1xuICAgICAgICBpZiAobm9kZS5fbmV4dCA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuX3RhaWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG5vZGUgPT09IHRoaXMuX3RhaWwpIHtcbiAgICAgICAgdGhpcy5fdGFpbCA9IG5vZGUuX3ByZXY7XG4gICAgICAgIHRoaXMuX3RhaWwuX25leHQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBub2RlLl9vd25lciA9IG51bGw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdkZXRhY2hBbGwnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXRhY2hBbGwoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG4gICAgICBpZiAoIW5vZGUpIHJldHVybiB0aGlzO1xuXG4gICAgICB0aGlzLl9oZWFkID0gdGhpcy5fdGFpbCA9IG51bGw7XG5cbiAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIG5vZGUuX293bmVyID0gbnVsbDtcbiAgICAgICAgbm9kZSA9IG5vZGUuX25leHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTWluaVNpZ25hbDtcbn0pKCk7XG5cbk1pbmlTaWduYWwuTWluaVNpZ25hbEJpbmRpbmcgPSBNaW5pU2lnbmFsQmluZGluZztcblxuZXhwb3J0c1snZGVmYXVsdCddID0gTWluaVNpZ25hbDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBhcHBseU1pZGRsZXdhcmU7XG5cbnZhciBfY29tcG9zZSA9IHJlcXVpcmUoJy4vY29tcG9zZScpO1xuXG52YXIgX2NvbXBvc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcG9zZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG4vKipcbiAqIENyZWF0ZXMgYSBzdG9yZSBlbmhhbmNlciB0aGF0IGFwcGxpZXMgbWlkZGxld2FyZSB0byB0aGUgZGlzcGF0Y2ggbWV0aG9kXG4gKiBvZiB0aGUgUmVkdXggc3RvcmUuIFRoaXMgaXMgaGFuZHkgZm9yIGEgdmFyaWV0eSBvZiB0YXNrcywgc3VjaCBhcyBleHByZXNzaW5nXG4gKiBhc3luY2hyb25vdXMgYWN0aW9ucyBpbiBhIGNvbmNpc2UgbWFubmVyLCBvciBsb2dnaW5nIGV2ZXJ5IGFjdGlvbiBwYXlsb2FkLlxuICpcbiAqIFNlZSBgcmVkdXgtdGh1bmtgIHBhY2thZ2UgYXMgYW4gZXhhbXBsZSBvZiB0aGUgUmVkdXggbWlkZGxld2FyZS5cbiAqXG4gKiBCZWNhdXNlIG1pZGRsZXdhcmUgaXMgcG90ZW50aWFsbHkgYXN5bmNocm9ub3VzLCB0aGlzIHNob3VsZCBiZSB0aGUgZmlyc3RcbiAqIHN0b3JlIGVuaGFuY2VyIGluIHRoZSBjb21wb3NpdGlvbiBjaGFpbi5cbiAqXG4gKiBOb3RlIHRoYXQgZWFjaCBtaWRkbGV3YXJlIHdpbGwgYmUgZ2l2ZW4gdGhlIGBkaXNwYXRjaGAgYW5kIGBnZXRTdGF0ZWAgZnVuY3Rpb25zXG4gKiBhcyBuYW1lZCBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gbWlkZGxld2FyZXMgVGhlIG1pZGRsZXdhcmUgY2hhaW4gdG8gYmUgYXBwbGllZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBzdG9yZSBlbmhhbmNlciBhcHBseWluZyB0aGUgbWlkZGxld2FyZS5cbiAqL1xuZnVuY3Rpb24gYXBwbHlNaWRkbGV3YXJlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgbWlkZGxld2FyZXMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBtaWRkbGV3YXJlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoY3JlYXRlU3RvcmUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgZW5oYW5jZXIpIHtcbiAgICAgIHZhciBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgZW5oYW5jZXIpO1xuICAgICAgdmFyIF9kaXNwYXRjaCA9IHN0b3JlLmRpc3BhdGNoO1xuICAgICAgdmFyIGNoYWluID0gW107XG5cbiAgICAgIHZhciBtaWRkbGV3YXJlQVBJID0ge1xuICAgICAgICBnZXRTdGF0ZTogc3RvcmUuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gX2Rpc3BhdGNoKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaGFpbiA9IG1pZGRsZXdhcmVzLm1hcChmdW5jdGlvbiAobWlkZGxld2FyZSkge1xuICAgICAgICByZXR1cm4gbWlkZGxld2FyZShtaWRkbGV3YXJlQVBJKTtcbiAgICAgIH0pO1xuICAgICAgX2Rpc3BhdGNoID0gX2NvbXBvc2UyW1wiZGVmYXVsdFwiXS5hcHBseSh1bmRlZmluZWQsIGNoYWluKShzdG9yZS5kaXNwYXRjaCk7XG5cbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RvcmUsIHtcbiAgICAgICAgZGlzcGF0Y2g6IF9kaXNwYXRjaFxuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGJpbmRBY3Rpb25DcmVhdG9ycztcbmZ1bmN0aW9uIGJpbmRBY3Rpb25DcmVhdG9yKGFjdGlvbkNyZWF0b3IsIGRpc3BhdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoKGFjdGlvbkNyZWF0b3IuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBUdXJucyBhbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSBhY3Rpb24gY3JlYXRvcnMsIGludG8gYW4gb2JqZWN0IHdpdGggdGhlXG4gKiBzYW1lIGtleXMsIGJ1dCB3aXRoIGV2ZXJ5IGZ1bmN0aW9uIHdyYXBwZWQgaW50byBhIGBkaXNwYXRjaGAgY2FsbCBzbyB0aGV5XG4gKiBtYXkgYmUgaW52b2tlZCBkaXJlY3RseS4gVGhpcyBpcyBqdXN0IGEgY29udmVuaWVuY2UgbWV0aG9kLCBhcyB5b3UgY2FuIGNhbGxcbiAqIGBzdG9yZS5kaXNwYXRjaChNeUFjdGlvbkNyZWF0b3JzLmRvU29tZXRoaW5nKCkpYCB5b3Vyc2VsZiBqdXN0IGZpbmUuXG4gKlxuICogRm9yIGNvbnZlbmllbmNlLCB5b3UgY2FuIGFsc28gcGFzcyBhIHNpbmdsZSBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQsXG4gKiBhbmQgZ2V0IGEgZnVuY3Rpb24gaW4gcmV0dXJuLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBhY3Rpb25DcmVhdG9ycyBBbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSBhY3Rpb25cbiAqIGNyZWF0b3IgZnVuY3Rpb25zLiBPbmUgaGFuZHkgd2F5IHRvIG9idGFpbiBpdCBpcyB0byB1c2UgRVM2IGBpbXBvcnQgKiBhc2BcbiAqIHN5bnRheC4gWW91IG1heSBhbHNvIHBhc3MgYSBzaW5nbGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZGlzcGF0Y2ggVGhlIGBkaXNwYXRjaGAgZnVuY3Rpb24gYXZhaWxhYmxlIG9uIHlvdXIgUmVkdXhcbiAqIHN0b3JlLlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbnxPYmplY3R9IFRoZSBvYmplY3QgbWltaWNraW5nIHRoZSBvcmlnaW5hbCBvYmplY3QsIGJ1dCB3aXRoXG4gKiBldmVyeSBhY3Rpb24gY3JlYXRvciB3cmFwcGVkIGludG8gdGhlIGBkaXNwYXRjaGAgY2FsbC4gSWYgeW91IHBhc3NlZCBhXG4gKiBmdW5jdGlvbiBhcyBgYWN0aW9uQ3JlYXRvcnNgLCB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYWxzbyBiZSBhIHNpbmdsZVxuICogZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycywgZGlzcGF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9ycywgZGlzcGF0Y2gpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9ycyAhPT0gJ29iamVjdCcgfHwgYWN0aW9uQ3JlYXRvcnMgPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBY3Rpb25DcmVhdG9ycyBleHBlY3RlZCBhbiBvYmplY3Qgb3IgYSBmdW5jdGlvbiwgaW5zdGVhZCByZWNlaXZlZCAnICsgKGFjdGlvbkNyZWF0b3JzID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIGFjdGlvbkNyZWF0b3JzKSArICcuICcgKyAnRGlkIHlvdSB3cml0ZSBcImltcG9ydCBBY3Rpb25DcmVhdG9ycyBmcm9tXCIgaW5zdGVhZCBvZiBcImltcG9ydCAqIGFzIEFjdGlvbkNyZWF0b3JzIGZyb21cIj8nKTtcbiAgfVxuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWN0aW9uQ3JlYXRvcnMpO1xuICB2YXIgYm91bmRBY3Rpb25DcmVhdG9ycyA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICB2YXIgYWN0aW9uQ3JlYXRvciA9IGFjdGlvbkNyZWF0b3JzW2tleV07XG4gICAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBib3VuZEFjdGlvbkNyZWF0b3JzW2tleV0gPSBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9yLCBkaXNwYXRjaCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBib3VuZEFjdGlvbkNyZWF0b3JzO1xufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gY29tYmluZVJlZHVjZXJzO1xuXG52YXIgX2NyZWF0ZVN0b3JlID0gcmVxdWlyZSgnLi9jcmVhdGVTdG9yZScpO1xuXG52YXIgX2lzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNQbGFpbk9iamVjdCcpO1xuXG52YXIgX2lzUGxhaW5PYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQbGFpbk9iamVjdCk7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJy4vdXRpbHMvd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBnZXRVbmRlZmluZWRTdGF0ZUVycm9yTWVzc2FnZShrZXksIGFjdGlvbikge1xuICB2YXIgYWN0aW9uVHlwZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZTtcbiAgdmFyIGFjdGlvbk5hbWUgPSBhY3Rpb25UeXBlICYmICdcIicgKyBhY3Rpb25UeXBlLnRvU3RyaW5nKCkgKyAnXCInIHx8ICdhbiBhY3Rpb24nO1xuXG4gIHJldHVybiAnUmVkdWNlciBcIicgKyBrZXkgKyAnXCIgcmV0dXJuZWQgdW5kZWZpbmVkIGhhbmRsaW5nICcgKyBhY3Rpb25OYW1lICsgJy4gJyArICdUbyBpZ25vcmUgYW4gYWN0aW9uLCB5b3UgbXVzdCBleHBsaWNpdGx5IHJldHVybiB0aGUgcHJldmlvdXMgc3RhdGUuJztcbn1cblxuZnVuY3Rpb24gZ2V0VW5leHBlY3RlZFN0YXRlU2hhcGVXYXJuaW5nTWVzc2FnZShpbnB1dFN0YXRlLCByZWR1Y2VycywgYWN0aW9uKSB7XG4gIHZhciByZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKHJlZHVjZXJzKTtcbiAgdmFyIGFyZ3VtZW50TmFtZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgPyAnaW5pdGlhbFN0YXRlIGFyZ3VtZW50IHBhc3NlZCB0byBjcmVhdGVTdG9yZScgOiAncHJldmlvdXMgc3RhdGUgcmVjZWl2ZWQgYnkgdGhlIHJlZHVjZXInO1xuXG4gIGlmIChyZWR1Y2VyS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gJ1N0b3JlIGRvZXMgbm90IGhhdmUgYSB2YWxpZCByZWR1Y2VyLiBNYWtlIHN1cmUgdGhlIGFyZ3VtZW50IHBhc3NlZCAnICsgJ3RvIGNvbWJpbmVSZWR1Y2VycyBpcyBhbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSByZWR1Y2Vycy4nO1xuICB9XG5cbiAgaWYgKCEoMCwgX2lzUGxhaW5PYmplY3QyW1wiZGVmYXVsdFwiXSkoaW5wdXRTdGF0ZSkpIHtcbiAgICByZXR1cm4gJ1RoZSAnICsgYXJndW1lbnROYW1lICsgJyBoYXMgdW5leHBlY3RlZCB0eXBlIG9mIFwiJyArIHt9LnRvU3RyaW5nLmNhbGwoaW5wdXRTdGF0ZSkubWF0Y2goL1xccyhbYS16fEEtWl0rKS8pWzFdICsgJ1wiLiBFeHBlY3RlZCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nICcgKyAoJ2tleXM6IFwiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiJyk7XG4gIH1cblxuICB2YXIgdW5leHBlY3RlZEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dFN0YXRlKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiAhcmVkdWNlcnMuaGFzT3duUHJvcGVydHkoa2V5KTtcbiAgfSk7XG5cbiAgaWYgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gJ1VuZXhwZWN0ZWQgJyArICh1bmV4cGVjdGVkS2V5cy5sZW5ndGggPiAxID8gJ2tleXMnIDogJ2tleScpICsgJyAnICsgKCdcIicgKyB1bmV4cGVjdGVkS2V5cy5qb2luKCdcIiwgXCInKSArICdcIiBmb3VuZCBpbiAnICsgYXJndW1lbnROYW1lICsgJy4gJykgKyAnRXhwZWN0ZWQgdG8gZmluZCBvbmUgb2YgdGhlIGtub3duIHJlZHVjZXIga2V5cyBpbnN0ZWFkOiAnICsgKCdcIicgKyByZWR1Y2VyS2V5cy5qb2luKCdcIiwgXCInKSArICdcIi4gVW5leHBlY3RlZCBrZXlzIHdpbGwgYmUgaWdub3JlZC4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRSZWR1Y2VyU2FuaXR5KHJlZHVjZXJzKSB7XG4gIE9iamVjdC5rZXlzKHJlZHVjZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgcmVkdWNlciA9IHJlZHVjZXJzW2tleV07XG4gICAgdmFyIGluaXRpYWxTdGF0ZSA9IHJlZHVjZXIodW5kZWZpbmVkLCB7IHR5cGU6IF9jcmVhdGVTdG9yZS5BY3Rpb25UeXBlcy5JTklUIH0pO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU3RhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZXIgXCInICsga2V5ICsgJ1wiIHJldHVybmVkIHVuZGVmaW5lZCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uICcgKyAnSWYgdGhlIHN0YXRlIHBhc3NlZCB0byB0aGUgcmVkdWNlciBpcyB1bmRlZmluZWQsIHlvdSBtdXN0ICcgKyAnZXhwbGljaXRseSByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUuIFRoZSBpbml0aWFsIHN0YXRlIG1heSAnICsgJ25vdCBiZSB1bmRlZmluZWQuJyk7XG4gICAgfVxuXG4gICAgdmFyIHR5cGUgPSAnQEByZWR1eC9QUk9CRV9VTktOT1dOX0FDVElPTl8nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpLnNwbGl0KCcnKS5qb2luKCcuJyk7XG4gICAgaWYgKHR5cGVvZiByZWR1Y2VyKHVuZGVmaW5lZCwgeyB0eXBlOiB0eXBlIH0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWR1Y2VyIFwiJyArIGtleSArICdcIiByZXR1cm5lZCB1bmRlZmluZWQgd2hlbiBwcm9iZWQgd2l0aCBhIHJhbmRvbSB0eXBlLiAnICsgKCdEb25cXCd0IHRyeSB0byBoYW5kbGUgJyArIF9jcmVhdGVTdG9yZS5BY3Rpb25UeXBlcy5JTklUICsgJyBvciBvdGhlciBhY3Rpb25zIGluIFwicmVkdXgvKlwiICcpICsgJ25hbWVzcGFjZS4gVGhleSBhcmUgY29uc2lkZXJlZCBwcml2YXRlLiBJbnN0ZWFkLCB5b3UgbXVzdCByZXR1cm4gdGhlICcgKyAnY3VycmVudCBzdGF0ZSBmb3IgYW55IHVua25vd24gYWN0aW9ucywgdW5sZXNzIGl0IGlzIHVuZGVmaW5lZCwgJyArICdpbiB3aGljaCBjYXNlIHlvdSBtdXN0IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZSwgcmVnYXJkbGVzcyBvZiB0aGUgJyArICdhY3Rpb24gdHlwZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IG5vdCBiZSB1bmRlZmluZWQuJyk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBUdXJucyBhbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSBkaWZmZXJlbnQgcmVkdWNlciBmdW5jdGlvbnMsIGludG8gYSBzaW5nbGVcbiAqIHJlZHVjZXIgZnVuY3Rpb24uIEl0IHdpbGwgY2FsbCBldmVyeSBjaGlsZCByZWR1Y2VyLCBhbmQgZ2F0aGVyIHRoZWlyIHJlc3VsdHNcbiAqIGludG8gYSBzaW5nbGUgc3RhdGUgb2JqZWN0LCB3aG9zZSBrZXlzIGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgb2YgdGhlIHBhc3NlZFxuICogcmVkdWNlciBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHJlZHVjZXJzIEFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgY29ycmVzcG9uZCB0byBkaWZmZXJlbnRcbiAqIHJlZHVjZXIgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZSBjb21iaW5lZCBpbnRvIG9uZS4gT25lIGhhbmR5IHdheSB0byBvYnRhaW5cbiAqIGl0IGlzIHRvIHVzZSBFUzYgYGltcG9ydCAqIGFzIHJlZHVjZXJzYCBzeW50YXguIFRoZSByZWR1Y2VycyBtYXkgbmV2ZXIgcmV0dXJuXG4gKiB1bmRlZmluZWQgZm9yIGFueSBhY3Rpb24uIEluc3RlYWQsIHRoZXkgc2hvdWxkIHJldHVybiB0aGVpciBpbml0aWFsIHN0YXRlXG4gKiBpZiB0aGUgc3RhdGUgcGFzc2VkIHRvIHRoZW0gd2FzIHVuZGVmaW5lZCwgYW5kIHRoZSBjdXJyZW50IHN0YXRlIGZvciBhbnlcbiAqIHVucmVjb2duaXplZCBhY3Rpb24uXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIHJlZHVjZXIgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGV2ZXJ5IHJlZHVjZXIgaW5zaWRlIHRoZVxuICogcGFzc2VkIG9iamVjdCwgYW5kIGJ1aWxkcyBhIHN0YXRlIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNoYXBlLlxuICovXG5mdW5jdGlvbiBjb21iaW5lUmVkdWNlcnMocmVkdWNlcnMpIHtcbiAgdmFyIHJlZHVjZXJLZXlzID0gT2JqZWN0LmtleXMocmVkdWNlcnMpO1xuICB2YXIgZmluYWxSZWR1Y2VycyA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZHVjZXJLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IHJlZHVjZXJLZXlzW2ldO1xuICAgIGlmICh0eXBlb2YgcmVkdWNlcnNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZmluYWxSZWR1Y2Vyc1trZXldID0gcmVkdWNlcnNba2V5XTtcbiAgICB9XG4gIH1cbiAgdmFyIGZpbmFsUmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhmaW5hbFJlZHVjZXJzKTtcblxuICB2YXIgc2FuaXR5RXJyb3I7XG4gIHRyeSB7XG4gICAgYXNzZXJ0UmVkdWNlclNhbml0eShmaW5hbFJlZHVjZXJzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNhbml0eUVycm9yID0gZTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBjb21iaW5hdGlvbigpIHtcbiAgICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcbiAgICB2YXIgYWN0aW9uID0gYXJndW1lbnRzWzFdO1xuXG4gICAgaWYgKHNhbml0eUVycm9yKSB7XG4gICAgICB0aHJvdyBzYW5pdHlFcnJvcjtcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIHdhcm5pbmdNZXNzYWdlID0gZ2V0VW5leHBlY3RlZFN0YXRlU2hhcGVXYXJuaW5nTWVzc2FnZShzdGF0ZSwgZmluYWxSZWR1Y2VycywgYWN0aW9uKTtcbiAgICAgIGlmICh3YXJuaW5nTWVzc2FnZSkge1xuICAgICAgICAoMCwgX3dhcm5pbmcyW1wiZGVmYXVsdFwiXSkod2FybmluZ01lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBoYXNDaGFuZ2VkID0gZmFsc2U7XG4gICAgdmFyIG5leHRTdGF0ZSA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluYWxSZWR1Y2VyS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGZpbmFsUmVkdWNlcktleXNbaV07XG4gICAgICB2YXIgcmVkdWNlciA9IGZpbmFsUmVkdWNlcnNba2V5XTtcbiAgICAgIHZhciBwcmV2aW91c1N0YXRlRm9yS2V5ID0gc3RhdGVba2V5XTtcbiAgICAgIHZhciBuZXh0U3RhdGVGb3JLZXkgPSByZWR1Y2VyKHByZXZpb3VzU3RhdGVGb3JLZXksIGFjdGlvbik7XG4gICAgICBpZiAodHlwZW9mIG5leHRTdGF0ZUZvcktleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGdldFVuZGVmaW5lZFN0YXRlRXJyb3JNZXNzYWdlKGtleSwgYWN0aW9uKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBuZXh0U3RhdGVba2V5XSA9IG5leHRTdGF0ZUZvcktleTtcbiAgICAgIGhhc0NoYW5nZWQgPSBoYXNDaGFuZ2VkIHx8IG5leHRTdGF0ZUZvcktleSAhPT0gcHJldmlvdXNTdGF0ZUZvcktleTtcbiAgICB9XG4gICAgcmV0dXJuIGhhc0NoYW5nZWQgPyBuZXh0U3RhdGUgOiBzdGF0ZTtcbiAgfTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gY29tcG9zZTtcbi8qKlxuICogQ29tcG9zZXMgc2luZ2xlLWFyZ3VtZW50IGZ1bmN0aW9ucyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3MgVGhlIGZ1bmN0aW9ucyB0byBjb21wb3NlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIG9idGFpbmVkIGJ5IGNvbXBvc2luZyBmdW5jdGlvbnMgZnJvbSByaWdodCB0b1xuICogbGVmdC4gRm9yIGV4YW1wbGUsIGNvbXBvc2UoZiwgZywgaCkgaXMgaWRlbnRpY2FsIHRvIGFyZyA9PiBmKGcoaChhcmcpKSkuXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmdW5jcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGZ1bmNzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZnVuY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdO1xuICAgIH1cblxuICAgIHZhciBsYXN0ID0gZnVuY3NbZnVuY3MubGVuZ3RoIC0gMV07XG4gICAgdmFyIHJlc3QgPSBmdW5jcy5zbGljZSgwLCAtMSk7XG5cbiAgICByZXR1cm4gcmVzdC5yZWR1Y2VSaWdodChmdW5jdGlvbiAoY29tcG9zZWQsIGYpIHtcbiAgICAgIHJldHVybiBmKGNvbXBvc2VkKTtcbiAgICB9LCBsYXN0LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKSk7XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5BY3Rpb25UeXBlcyA9IHVuZGVmaW5lZDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gY3JlYXRlU3RvcmU7XG5cbnZhciBfaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC9pc1BsYWluT2JqZWN0Jyk7XG5cbnZhciBfaXNQbGFpbk9iamVjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1BsYWluT2JqZWN0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8qKlxuICogVGhlc2UgYXJlIHByaXZhdGUgYWN0aW9uIHR5cGVzIHJlc2VydmVkIGJ5IFJlZHV4LlxuICogRm9yIGFueSB1bmtub3duIGFjdGlvbnMsIHlvdSBtdXN0IHJldHVybiB0aGUgY3VycmVudCBzdGF0ZS5cbiAqIElmIHRoZSBjdXJyZW50IHN0YXRlIGlzIHVuZGVmaW5lZCwgeW91IG11c3QgcmV0dXJuIHRoZSBpbml0aWFsIHN0YXRlLlxuICogRG8gbm90IHJlZmVyZW5jZSB0aGVzZSBhY3Rpb24gdHlwZXMgZGlyZWN0bHkgaW4geW91ciBjb2RlLlxuICovXG52YXIgQWN0aW9uVHlwZXMgPSBleHBvcnRzLkFjdGlvblR5cGVzID0ge1xuICBJTklUOiAnQEByZWR1eC9JTklUJ1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgUmVkdXggc3RvcmUgdGhhdCBob2xkcyB0aGUgc3RhdGUgdHJlZS5cbiAqIFRoZSBvbmx5IHdheSB0byBjaGFuZ2UgdGhlIGRhdGEgaW4gdGhlIHN0b3JlIGlzIHRvIGNhbGwgYGRpc3BhdGNoKClgIG9uIGl0LlxuICpcbiAqIFRoZXJlIHNob3VsZCBvbmx5IGJlIGEgc2luZ2xlIHN0b3JlIGluIHlvdXIgYXBwLiBUbyBzcGVjaWZ5IGhvdyBkaWZmZXJlbnRcbiAqIHBhcnRzIG9mIHRoZSBzdGF0ZSB0cmVlIHJlc3BvbmQgdG8gYWN0aW9ucywgeW91IG1heSBjb21iaW5lIHNldmVyYWwgcmVkdWNlcnNcbiAqIGludG8gYSBzaW5nbGUgcmVkdWNlciBmdW5jdGlvbiBieSB1c2luZyBgY29tYmluZVJlZHVjZXJzYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWR1Y2VyIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBuZXh0IHN0YXRlIHRyZWUsIGdpdmVuXG4gKiB0aGUgY3VycmVudCBzdGF0ZSB0cmVlIGFuZCB0aGUgYWN0aW9uIHRvIGhhbmRsZS5cbiAqXG4gKiBAcGFyYW0ge2FueX0gW2luaXRpYWxTdGF0ZV0gVGhlIGluaXRpYWwgc3RhdGUuIFlvdSBtYXkgb3B0aW9uYWxseSBzcGVjaWZ5IGl0XG4gKiB0byBoeWRyYXRlIHRoZSBzdGF0ZSBmcm9tIHRoZSBzZXJ2ZXIgaW4gdW5pdmVyc2FsIGFwcHMsIG9yIHRvIHJlc3RvcmUgYVxuICogcHJldmlvdXNseSBzZXJpYWxpemVkIHVzZXIgc2Vzc2lvbi5cbiAqIElmIHlvdSB1c2UgYGNvbWJpbmVSZWR1Y2Vyc2AgdG8gcHJvZHVjZSB0aGUgcm9vdCByZWR1Y2VyIGZ1bmN0aW9uLCB0aGlzIG11c3QgYmVcbiAqIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNoYXBlIGFzIGBjb21iaW5lUmVkdWNlcnNgIGtleXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZW5oYW5jZXIgVGhlIHN0b3JlIGVuaGFuY2VyLiBZb3UgbWF5IG9wdGlvbmFsbHkgc3BlY2lmeSBpdFxuICogdG8gZW5oYW5jZSB0aGUgc3RvcmUgd2l0aCB0aGlyZC1wYXJ0eSBjYXBhYmlsaXRpZXMgc3VjaCBhcyBtaWRkbGV3YXJlLFxuICogdGltZSB0cmF2ZWwsIHBlcnNpc3RlbmNlLCBldGMuIFRoZSBvbmx5IHN0b3JlIGVuaGFuY2VyIHRoYXQgc2hpcHMgd2l0aCBSZWR1eFxuICogaXMgYGFwcGx5TWlkZGxld2FyZSgpYC5cbiAqXG4gKiBAcmV0dXJucyB7U3RvcmV9IEEgUmVkdXggc3RvcmUgdGhhdCBsZXRzIHlvdSByZWFkIHRoZSBzdGF0ZSwgZGlzcGF0Y2ggYWN0aW9uc1xuICogYW5kIHN1YnNjcmliZSB0byBjaGFuZ2VzLlxuICovXG5mdW5jdGlvbiBjcmVhdGVTdG9yZShyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIGVuaGFuY2VyKSB7XG4gIGlmICh0eXBlb2YgaW5pdGlhbFN0YXRlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBlbmhhbmNlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbmhhbmNlciA9IGluaXRpYWxTdGF0ZTtcbiAgICBpbml0aWFsU3RhdGUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGVuaGFuY2VyICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgZW5oYW5jZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgdGhlIGVuaGFuY2VyIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVuaGFuY2VyKGNyZWF0ZVN0b3JlKShyZWR1Y2VyLCBpbml0aWFsU3RhdGUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiByZWR1Y2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCB0aGUgcmVkdWNlciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIGN1cnJlbnRSZWR1Y2VyID0gcmVkdWNlcjtcbiAgdmFyIGN1cnJlbnRTdGF0ZSA9IGluaXRpYWxTdGF0ZTtcbiAgdmFyIGN1cnJlbnRMaXN0ZW5lcnMgPSBbXTtcbiAgdmFyIG5leHRMaXN0ZW5lcnMgPSBjdXJyZW50TGlzdGVuZXJzO1xuICB2YXIgaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGVuc3VyZUNhbk11dGF0ZU5leHRMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKG5leHRMaXN0ZW5lcnMgPT09IGN1cnJlbnRMaXN0ZW5lcnMpIHtcbiAgICAgIG5leHRMaXN0ZW5lcnMgPSBjdXJyZW50TGlzdGVuZXJzLnNsaWNlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlYWRzIHRoZSBzdGF0ZSB0cmVlIG1hbmFnZWQgYnkgdGhlIHN0b3JlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7YW55fSBUaGUgY3VycmVudCBzdGF0ZSB0cmVlIG9mIHlvdXIgYXBwbGljYXRpb24uXG4gICAqL1xuICBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4gY3VycmVudFN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBjaGFuZ2UgbGlzdGVuZXIuIEl0IHdpbGwgYmUgY2FsbGVkIGFueSB0aW1lIGFuIGFjdGlvbiBpcyBkaXNwYXRjaGVkLFxuICAgKiBhbmQgc29tZSBwYXJ0IG9mIHRoZSBzdGF0ZSB0cmVlIG1heSBwb3RlbnRpYWxseSBoYXZlIGNoYW5nZWQuIFlvdSBtYXkgdGhlblxuICAgKiBjYWxsIGBnZXRTdGF0ZSgpYCB0byByZWFkIHRoZSBjdXJyZW50IHN0YXRlIHRyZWUgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICpcbiAgICogWW91IG1heSBjYWxsIGBkaXNwYXRjaCgpYCBmcm9tIGEgY2hhbmdlIGxpc3RlbmVyLCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAgICogY2F2ZWF0czpcbiAgICpcbiAgICogMS4gVGhlIHN1YnNjcmlwdGlvbnMgYXJlIHNuYXBzaG90dGVkIGp1c3QgYmVmb3JlIGV2ZXJ5IGBkaXNwYXRjaCgpYCBjYWxsLlxuICAgKiBJZiB5b3Ugc3Vic2NyaWJlIG9yIHVuc3Vic2NyaWJlIHdoaWxlIHRoZSBsaXN0ZW5lcnMgYXJlIGJlaW5nIGludm9rZWQsIHRoaXNcbiAgICogd2lsbCBub3QgaGF2ZSBhbnkgZWZmZWN0IG9uIHRoZSBgZGlzcGF0Y2goKWAgdGhhdCBpcyBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MuXG4gICAqIEhvd2V2ZXIsIHRoZSBuZXh0IGBkaXNwYXRjaCgpYCBjYWxsLCB3aGV0aGVyIG5lc3RlZCBvciBub3QsIHdpbGwgdXNlIGEgbW9yZVxuICAgKiByZWNlbnQgc25hcHNob3Qgb2YgdGhlIHN1YnNjcmlwdGlvbiBsaXN0LlxuICAgKlxuICAgKiAyLiBUaGUgbGlzdGVuZXIgc2hvdWxkIG5vdCBleHBlY3QgdG8gc2VlIGFsbCBzdGF0ZXMgY2hhbmdlcywgYXMgdGhlIHN0YXRlXG4gICAqIG1pZ2h0IGhhdmUgYmVlbiB1cGRhdGVkIG11bHRpcGxlIHRpbWVzIGR1cmluZyBhIG5lc3RlZCBgZGlzcGF0Y2goKWAgYmVmb3JlXG4gICAqIHRoZSBsaXN0ZW5lciBpcyBjYWxsZWQuIEl0IGlzLCBob3dldmVyLCBndWFyYW50ZWVkIHRoYXQgYWxsIHN1YnNjcmliZXJzXG4gICAqIHJlZ2lzdGVyZWQgYmVmb3JlIHRoZSBgZGlzcGF0Y2goKWAgc3RhcnRlZCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBsYXRlc3RcbiAgICogc3RhdGUgYnkgdGhlIHRpbWUgaXQgZXhpdHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIEEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCBvbiBldmVyeSBkaXNwYXRjaC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGlzIGNoYW5nZSBsaXN0ZW5lci5cbiAgICovXG4gIGZ1bmN0aW9uIHN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgbGlzdGVuZXIgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICB2YXIgaXNTdWJzY3JpYmVkID0gdHJ1ZTtcblxuICAgIGVuc3VyZUNhbk11dGF0ZU5leHRMaXN0ZW5lcnMoKTtcbiAgICBuZXh0TGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xuICAgICAgaWYgKCFpc1N1YnNjcmliZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpc1N1YnNjcmliZWQgPSBmYWxzZTtcblxuICAgICAgZW5zdXJlQ2FuTXV0YXRlTmV4dExpc3RlbmVycygpO1xuICAgICAgdmFyIGluZGV4ID0gbmV4dExpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgIG5leHRMaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYW4gYWN0aW9uLiBJdCBpcyB0aGUgb25seSB3YXkgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZS5cbiAgICpcbiAgICogVGhlIGByZWR1Y2VyYCBmdW5jdGlvbiwgdXNlZCB0byBjcmVhdGUgdGhlIHN0b3JlLCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZVxuICAgKiBjdXJyZW50IHN0YXRlIHRyZWUgYW5kIHRoZSBnaXZlbiBgYWN0aW9uYC4gSXRzIHJldHVybiB2YWx1ZSB3aWxsXG4gICAqIGJlIGNvbnNpZGVyZWQgdGhlICoqbmV4dCoqIHN0YXRlIG9mIHRoZSB0cmVlLCBhbmQgdGhlIGNoYW5nZSBsaXN0ZW5lcnNcbiAgICogd2lsbCBiZSBub3RpZmllZC5cbiAgICpcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb25seSBzdXBwb3J0cyBwbGFpbiBvYmplY3QgYWN0aW9ucy4gSWYgeW91IHdhbnQgdG9cbiAgICogZGlzcGF0Y2ggYSBQcm9taXNlLCBhbiBPYnNlcnZhYmxlLCBhIHRodW5rLCBvciBzb21ldGhpbmcgZWxzZSwgeW91IG5lZWQgdG9cbiAgICogd3JhcCB5b3VyIHN0b3JlIGNyZWF0aW5nIGZ1bmN0aW9uIGludG8gdGhlIGNvcnJlc3BvbmRpbmcgbWlkZGxld2FyZS4gRm9yXG4gICAqIGV4YW1wbGUsIHNlZSB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgdGhlIGByZWR1eC10aHVua2AgcGFja2FnZS4gRXZlbiB0aGVcbiAgICogbWlkZGxld2FyZSB3aWxsIGV2ZW50dWFsbHkgZGlzcGF0Y2ggcGxhaW4gb2JqZWN0IGFjdGlvbnMgdXNpbmcgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gQSBwbGFpbiBvYmplY3QgcmVwcmVzZW50aW5nIOKAnHdoYXQgY2hhbmdlZOKAnS4gSXQgaXNcbiAgICogYSBnb29kIGlkZWEgdG8ga2VlcCBhY3Rpb25zIHNlcmlhbGl6YWJsZSBzbyB5b3UgY2FuIHJlY29yZCBhbmQgcmVwbGF5IHVzZXJcbiAgICogc2Vzc2lvbnMsIG9yIHVzZSB0aGUgdGltZSB0cmF2ZWxsaW5nIGByZWR1eC1kZXZ0b29sc2AuIEFuIGFjdGlvbiBtdXN0IGhhdmVcbiAgICogYSBgdHlwZWAgcHJvcGVydHkgd2hpY2ggbWF5IG5vdCBiZSBgdW5kZWZpbmVkYC4gSXQgaXMgYSBnb29kIGlkZWEgdG8gdXNlXG4gICAqIHN0cmluZyBjb25zdGFudHMgZm9yIGFjdGlvbiB0eXBlcy5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gRm9yIGNvbnZlbmllbmNlLCB0aGUgc2FtZSBhY3Rpb24gb2JqZWN0IHlvdSBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBOb3RlIHRoYXQsIGlmIHlvdSB1c2UgYSBjdXN0b20gbWlkZGxld2FyZSwgaXQgbWF5IHdyYXAgYGRpc3BhdGNoKClgIHRvXG4gICAqIHJldHVybiBzb21ldGhpbmcgZWxzZSAoZm9yIGV4YW1wbGUsIGEgUHJvbWlzZSB5b3UgY2FuIGF3YWl0KS5cbiAgICovXG4gIGZ1bmN0aW9uIGRpc3BhdGNoKGFjdGlvbikge1xuICAgIGlmICghKDAsIF9pc1BsYWluT2JqZWN0MltcImRlZmF1bHRcIl0pKGFjdGlvbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9ucyBtdXN0IGJlIHBsYWluIG9iamVjdHMuICcgKyAnVXNlIGN1c3RvbSBtaWRkbGV3YXJlIGZvciBhc3luYyBhY3Rpb25zLicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYWN0aW9uLnR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbnMgbWF5IG5vdCBoYXZlIGFuIHVuZGVmaW5lZCBcInR5cGVcIiBwcm9wZXJ0eS4gJyArICdIYXZlIHlvdSBtaXNzcGVsbGVkIGEgY29uc3RhbnQ/Jyk7XG4gICAgfVxuXG4gICAgaWYgKGlzRGlzcGF0Y2hpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlcnMgbWF5IG5vdCBkaXNwYXRjaCBhY3Rpb25zLicpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnRSZWR1Y2VyKGN1cnJlbnRTdGF0ZSwgYWN0aW9uKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBsaXN0ZW5lcnMgPSBjdXJyZW50TGlzdGVuZXJzID0gbmV4dExpc3RlbmVycztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGlzdGVuZXJzW2ldKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyB0aGUgcmVkdWNlciBjdXJyZW50bHkgdXNlZCBieSB0aGUgc3RvcmUgdG8gY2FsY3VsYXRlIHRoZSBzdGF0ZS5cbiAgICpcbiAgICogWW91IG1pZ2h0IG5lZWQgdGhpcyBpZiB5b3VyIGFwcCBpbXBsZW1lbnRzIGNvZGUgc3BsaXR0aW5nIGFuZCB5b3Ugd2FudCB0b1xuICAgKiBsb2FkIHNvbWUgb2YgdGhlIHJlZHVjZXJzIGR5bmFtaWNhbGx5LiBZb3UgbWlnaHQgYWxzbyBuZWVkIHRoaXMgaWYgeW91XG4gICAqIGltcGxlbWVudCBhIGhvdCByZWxvYWRpbmcgbWVjaGFuaXNtIGZvciBSZWR1eC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dFJlZHVjZXIgVGhlIHJlZHVjZXIgZm9yIHRoZSBzdG9yZSB0byB1c2UgaW5zdGVhZC5cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmdW5jdGlvbiByZXBsYWNlUmVkdWNlcihuZXh0UmVkdWNlcikge1xuICAgIGlmICh0eXBlb2YgbmV4dFJlZHVjZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgdGhlIG5leHRSZWR1Y2VyIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgY3VycmVudFJlZHVjZXIgPSBuZXh0UmVkdWNlcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IEFjdGlvblR5cGVzLklOSVQgfSk7XG4gIH1cblxuICAvLyBXaGVuIGEgc3RvcmUgaXMgY3JlYXRlZCwgYW4gXCJJTklUXCIgYWN0aW9uIGlzIGRpc3BhdGNoZWQgc28gdGhhdCBldmVyeVxuICAvLyByZWR1Y2VyIHJldHVybnMgdGhlaXIgaW5pdGlhbCBzdGF0ZS4gVGhpcyBlZmZlY3RpdmVseSBwb3B1bGF0ZXNcbiAgLy8gdGhlIGluaXRpYWwgc3RhdGUgdHJlZS5cbiAgZGlzcGF0Y2goeyB0eXBlOiBBY3Rpb25UeXBlcy5JTklUIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcbiAgICByZXBsYWNlUmVkdWNlcjogcmVwbGFjZVJlZHVjZXJcbiAgfTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmNvbXBvc2UgPSBleHBvcnRzLmFwcGx5TWlkZGxld2FyZSA9IGV4cG9ydHMuYmluZEFjdGlvbkNyZWF0b3JzID0gZXhwb3J0cy5jb21iaW5lUmVkdWNlcnMgPSBleHBvcnRzLmNyZWF0ZVN0b3JlID0gdW5kZWZpbmVkO1xuXG52YXIgX2NyZWF0ZVN0b3JlID0gcmVxdWlyZSgnLi9jcmVhdGVTdG9yZScpO1xuXG52YXIgX2NyZWF0ZVN0b3JlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZVN0b3JlKTtcblxudmFyIF9jb21iaW5lUmVkdWNlcnMgPSByZXF1aXJlKCcuL2NvbWJpbmVSZWR1Y2VycycpO1xuXG52YXIgX2NvbWJpbmVSZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21iaW5lUmVkdWNlcnMpO1xuXG52YXIgX2JpbmRBY3Rpb25DcmVhdG9ycyA9IHJlcXVpcmUoJy4vYmluZEFjdGlvbkNyZWF0b3JzJyk7XG5cbnZhciBfYmluZEFjdGlvbkNyZWF0b3JzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2JpbmRBY3Rpb25DcmVhdG9ycyk7XG5cbnZhciBfYXBwbHlNaWRkbGV3YXJlID0gcmVxdWlyZSgnLi9hcHBseU1pZGRsZXdhcmUnKTtcblxudmFyIF9hcHBseU1pZGRsZXdhcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXBwbHlNaWRkbGV3YXJlKTtcblxudmFyIF9jb21wb3NlID0gcmVxdWlyZSgnLi9jb21wb3NlJyk7XG5cbnZhciBfY29tcG9zZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21wb3NlKTtcblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnLi91dGlscy93YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8qXG4qIFRoaXMgaXMgYSBkdW1teSBmdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgZnVuY3Rpb24gbmFtZSBoYXMgYmVlbiBhbHRlcmVkIGJ5IG1pbmlmaWNhdGlvbi5cbiogSWYgdGhlIGZ1bmN0aW9uIGhhcyBiZWVuIG1pbmlmaWVkIGFuZCBOT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nLCB3YXJuIHRoZSB1c2VyLlxuKi9cbmZ1bmN0aW9uIGlzQ3J1c2hlZCgpIHt9XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBpc0NydXNoZWQubmFtZSA9PT0gJ3N0cmluZycgJiYgaXNDcnVzaGVkLm5hbWUgIT09ICdpc0NydXNoZWQnKSB7XG4gICgwLCBfd2FybmluZzJbXCJkZWZhdWx0XCJdKSgnWW91IGFyZSBjdXJyZW50bHkgdXNpbmcgbWluaWZpZWQgY29kZSBvdXRzaWRlIG9mIE5PREVfRU5WID09PSBcXCdwcm9kdWN0aW9uXFwnLiAnICsgJ1RoaXMgbWVhbnMgdGhhdCB5b3UgYXJlIHJ1bm5pbmcgYSBzbG93ZXIgZGV2ZWxvcG1lbnQgYnVpbGQgb2YgUmVkdXguICcgKyAnWW91IGNhbiB1c2UgbG9vc2UtZW52aWZ5IChodHRwczovL2dpdGh1Yi5jb20vemVydG9zaC9sb29zZS1lbnZpZnkpIGZvciBicm93c2VyaWZ5ICcgKyAnb3IgRGVmaW5lUGx1Z2luIGZvciB3ZWJwYWNrIChodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMwMDMwMDMxKSAnICsgJ3RvIGVuc3VyZSB5b3UgaGF2ZSB0aGUgY29ycmVjdCBjb2RlIGZvciB5b3VyIHByb2R1Y3Rpb24gYnVpbGQuJyk7XG59XG5cbmV4cG9ydHMuY3JlYXRlU3RvcmUgPSBfY3JlYXRlU3RvcmUyW1wiZGVmYXVsdFwiXTtcbmV4cG9ydHMuY29tYmluZVJlZHVjZXJzID0gX2NvbWJpbmVSZWR1Y2VyczJbXCJkZWZhdWx0XCJdO1xuZXhwb3J0cy5iaW5kQWN0aW9uQ3JlYXRvcnMgPSBfYmluZEFjdGlvbkNyZWF0b3JzMltcImRlZmF1bHRcIl07XG5leHBvcnRzLmFwcGx5TWlkZGxld2FyZSA9IF9hcHBseU1pZGRsZXdhcmUyW1wiZGVmYXVsdFwiXTtcbmV4cG9ydHMuY29tcG9zZSA9IF9jb21wb3NlMltcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB3YXJuaW5nO1xuLyoqXG4gKiBQcmludHMgYSB3YXJuaW5nIGluIHRoZSBjb25zb2xlIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgd2FybmluZyBtZXNzYWdlLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHdhcm5pbmcobWVzc2FnZSkge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuICB0cnkge1xuICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1lbXB0eSAqL1xuICB9IGNhdGNoIChlKSB7fVxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLWVtcHR5ICovXG59IiwidmFyIFZOb2RlID0gcmVxdWlyZSgnLi92bm9kZScpO1xudmFyIGlzID0gcmVxdWlyZSgnLi9pcycpO1xuXG5mdW5jdGlvbiBhZGROUyhkYXRhLCBjaGlsZHJlbikge1xuICBkYXRhLm5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcbiAgaWYgKGNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICBhZGROUyhjaGlsZHJlbltpXS5kYXRhLCBjaGlsZHJlbltpXS5jaGlsZHJlbik7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaChzZWwsIGIsIGMpIHtcbiAgdmFyIGRhdGEgPSB7fSwgY2hpbGRyZW4sIHRleHQsIGk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgZGF0YSA9IGI7XG4gICAgaWYgKGlzLmFycmF5KGMpKSB7IGNoaWxkcmVuID0gYzsgfVxuICAgIGVsc2UgaWYgKGlzLnByaW1pdGl2ZShjKSkgeyB0ZXh0ID0gYzsgfVxuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICBpZiAoaXMuYXJyYXkoYikpIHsgY2hpbGRyZW4gPSBiOyB9XG4gICAgZWxzZSBpZiAoaXMucHJpbWl0aXZlKGIpKSB7IHRleHQgPSBiOyB9XG4gICAgZWxzZSB7IGRhdGEgPSBiOyB9XG4gIH1cbiAgaWYgKGlzLmFycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGlzLnByaW1pdGl2ZShjaGlsZHJlbltpXSkpIGNoaWxkcmVuW2ldID0gVk5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgfVxuICBpZiAoc2VsWzBdID09PSAncycgJiYgc2VsWzFdID09PSAndicgJiYgc2VsWzJdID09PSAnZycpIHtcbiAgICBhZGROUyhkYXRhLCBjaGlsZHJlbik7XG4gIH1cbiAgcmV0dXJuIFZOb2RlKHNlbCwgZGF0YSwgY2hpbGRyZW4sIHRleHQsIHVuZGVmaW5lZCk7XG59O1xuIiwiZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWdOYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIHF1YWxpZmllZE5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRleHROb2RlKHRleHQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCk7XG59XG5cbmZ1bmN0aW9uIGluc2VydEJlZm9yZShwYXJlbnROb2RlLCBuZXdOb2RlLCByZWZlcmVuY2VOb2RlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3BhcmVudCcsIHBhcmVudE5vZGUpO1xuICAgIC8vIGNvbnNvbGUubG9nKCduZXdub2RlJywgbmV3Tm9kZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ3JlZmVyZW5jZW5vZGUnLCByZWZlcmVuY2VOb2RlKTtcbiAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCByZWZlcmVuY2VOb2RlKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2hpbGQobm9kZSwgY2hpbGQpIHtcbiAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkKTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kQ2hpbGQobm9kZSwgY2hpbGQpIHtcbiAgICBub2RlLmFwcGVuZENoaWxkKGNoaWxkKTtcbn1cblxuZnVuY3Rpb24gcGFyZW50Tm9kZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUucGFyZW50RWxlbWVudDtcbn1cblxuZnVuY3Rpb24gbmV4dFNpYmxpbmcobm9kZSkge1xuICAgIHJldHVybiBub2RlLm5leHRTaWJsaW5nO1xufVxuXG5mdW5jdGlvbiB0YWdOYW1lKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS50YWdOYW1lO1xufVxuXG5mdW5jdGlvbiBzZXRUZXh0Q29udGVudChub2RlLCB0ZXh0KSB7XG4gICAgbm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZUVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnQsXG4gICAgY3JlYXRlRWxlbWVudE5TOiBjcmVhdGVFbGVtZW50TlMsXG4gICAgY3JlYXRlVGV4dE5vZGU6IGNyZWF0ZVRleHROb2RlLFxuICAgIGFwcGVuZENoaWxkOiBhcHBlbmRDaGlsZCxcbiAgICByZW1vdmVDaGlsZDogcmVtb3ZlQ2hpbGQsXG4gICAgaW5zZXJ0QmVmb3JlOiBpbnNlcnRCZWZvcmUsXG4gICAgcGFyZW50Tm9kZTogcGFyZW50Tm9kZSxcbiAgICBuZXh0U2libGluZzogbmV4dFNpYmxpbmcsXG4gICAgdGFnTmFtZTogdGFnTmFtZSxcbiAgICBzZXRUZXh0Q29udGVudDogc2V0VGV4dENvbnRlbnRcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXJyYXk6IEFycmF5LmlzQXJyYXksXG4gIHByaW1pdGl2ZTogZnVuY3Rpb24ocykgeyByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBzID09PSAnbnVtYmVyJzsgfSxcbn07XG4iLCJ2YXIgYm9vbGVhbkF0dHJzID0gW1wiYWxsb3dmdWxsc2NyZWVuXCIsIFwiYXN5bmNcIiwgXCJhdXRvZm9jdXNcIiwgXCJhdXRvcGxheVwiLCBcImNoZWNrZWRcIiwgXCJjb21wYWN0XCIsIFwiY29udHJvbHNcIiwgXCJkZWNsYXJlXCIsIFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiLCBcImRlZmF1bHRjaGVja2VkXCIsIFwiZGVmYXVsdG11dGVkXCIsIFwiZGVmYXVsdHNlbGVjdGVkXCIsIFwiZGVmZXJcIiwgXCJkaXNhYmxlZFwiLCBcImRyYWdnYWJsZVwiLCBcbiAgICAgICAgICAgICAgICBcImVuYWJsZWRcIiwgXCJmb3Jtbm92YWxpZGF0ZVwiLCBcImhpZGRlblwiLCBcImluZGV0ZXJtaW5hdGVcIiwgXCJpbmVydFwiLCBcImlzbWFwXCIsIFwiaXRlbXNjb3BlXCIsIFwibG9vcFwiLCBcIm11bHRpcGxlXCIsIFxuICAgICAgICAgICAgICAgIFwibXV0ZWRcIiwgXCJub2hyZWZcIiwgXCJub3Jlc2l6ZVwiLCBcIm5vc2hhZGVcIiwgXCJub3ZhbGlkYXRlXCIsIFwibm93cmFwXCIsIFwib3BlblwiLCBcInBhdXNlb25leGl0XCIsIFwicmVhZG9ubHlcIiwgXG4gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiLCBcInJldmVyc2VkXCIsIFwic2NvcGVkXCIsIFwic2VhbWxlc3NcIiwgXCJzZWxlY3RlZFwiLCBcInNvcnRhYmxlXCIsIFwic3BlbGxjaGVja1wiLCBcInRyYW5zbGF0ZVwiLCBcbiAgICAgICAgICAgICAgICBcInRydWVzcGVlZFwiLCBcInR5cGVtdXN0bWF0Y2hcIiwgXCJ2aXNpYmxlXCJdO1xuICAgIFxudmFyIGJvb2xlYW5BdHRyc0RpY3QgPSB7fTtcbmZvcih2YXIgaT0wLCBsZW4gPSBib29sZWFuQXR0cnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgYm9vbGVhbkF0dHJzRGljdFtib29sZWFuQXR0cnNbaV1dID0gdHJ1ZTtcbn1cbiAgICBcbmZ1bmN0aW9uIHVwZGF0ZUF0dHJzKG9sZFZub2RlLCB2bm9kZSkge1xuICB2YXIga2V5LCBjdXIsIG9sZCwgZWxtID0gdm5vZGUuZWxtLFxuICAgICAgb2xkQXR0cnMgPSBvbGRWbm9kZS5kYXRhLmF0dHJzIHx8IHt9LCBhdHRycyA9IHZub2RlLmRhdGEuYXR0cnMgfHwge307XG4gIFxuICAvLyB1cGRhdGUgbW9kaWZpZWQgYXR0cmlidXRlcywgYWRkIG5ldyBhdHRyaWJ1dGVzXG4gIGZvciAoa2V5IGluIGF0dHJzKSB7XG4gICAgY3VyID0gYXR0cnNba2V5XTtcbiAgICBvbGQgPSBvbGRBdHRyc1trZXldO1xuICAgIGlmIChvbGQgIT09IGN1cikge1xuICAgICAgLy8gVE9ETzogYWRkIHN1cHBvcnQgdG8gbmFtZXNwYWNlZCBhdHRyaWJ1dGVzIChzZXRBdHRyaWJ1dGVOUylcbiAgICAgIGlmKCFjdXIgJiYgYm9vbGVhbkF0dHJzRGljdFtrZXldKVxuICAgICAgICBlbG0ucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgICBlbHNlXG4gICAgICAgIGVsbS5zZXRBdHRyaWJ1dGUoa2V5LCBjdXIpO1xuICAgIH1cbiAgfVxuICAvL3JlbW92ZSByZW1vdmVkIGF0dHJpYnV0ZXNcbiAgLy8gdXNlIGBpbmAgb3BlcmF0b3Igc2luY2UgdGhlIHByZXZpb3VzIGBmb3JgIGl0ZXJhdGlvbiB1c2VzIGl0ICguaS5lLiBhZGQgZXZlbiBhdHRyaWJ1dGVzIHdpdGggdW5kZWZpbmVkIHZhbHVlKVxuICAvLyB0aGUgb3RoZXIgb3B0aW9uIGlzIHRvIHJlbW92ZSBhbGwgYXR0cmlidXRlcyB3aXRoIHZhbHVlID09IHVuZGVmaW5lZFxuICBmb3IgKGtleSBpbiBvbGRBdHRycykge1xuICAgIGlmICghKGtleSBpbiBhdHRycykpIHtcbiAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7Y3JlYXRlOiB1cGRhdGVBdHRycywgdXBkYXRlOiB1cGRhdGVBdHRyc307XG4iLCJmdW5jdGlvbiB1cGRhdGVDbGFzcyhvbGRWbm9kZSwgdm5vZGUpIHtcbiAgdmFyIGN1ciwgbmFtZSwgZWxtID0gdm5vZGUuZWxtLFxuICAgICAgb2xkQ2xhc3MgPSBvbGRWbm9kZS5kYXRhLmNsYXNzIHx8IHt9LFxuICAgICAga2xhc3MgPSB2bm9kZS5kYXRhLmNsYXNzIHx8IHt9O1xuICBmb3IgKG5hbWUgaW4gb2xkQ2xhc3MpIHtcbiAgICBpZiAoIWtsYXNzW25hbWVdKSB7XG4gICAgICBlbG0uY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICB9XG4gIH1cbiAgZm9yIChuYW1lIGluIGtsYXNzKSB7XG4gICAgY3VyID0ga2xhc3NbbmFtZV07XG4gICAgaWYgKGN1ciAhPT0gb2xkQ2xhc3NbbmFtZV0pIHtcbiAgICAgIGVsbS5jbGFzc0xpc3RbY3VyID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge2NyZWF0ZTogdXBkYXRlQ2xhc3MsIHVwZGF0ZTogdXBkYXRlQ2xhc3N9O1xuIiwidmFyIGlzID0gcmVxdWlyZSgnLi4vaXMnKTtcblxuZnVuY3Rpb24gYXJySW52b2tlcihhcnIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIC8vIFNwZWNpYWwgY2FzZSB3aGVuIGxlbmd0aCBpcyB0d28sIGZvciBwZXJmb3JtYW5jZVxuICAgIGFyci5sZW5ndGggPT09IDIgPyBhcnJbMF0oYXJyWzFdKSA6IGFyclswXS5hcHBseSh1bmRlZmluZWQsIGFyci5zbGljZSgxKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGZuSW52b2tlcihvKSB7XG4gIHJldHVybiBmdW5jdGlvbihldikgeyBvLmZuKGV2KTsgfTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRXZlbnRMaXN0ZW5lcnMob2xkVm5vZGUsIHZub2RlKSB7XG4gIHZhciBuYW1lLCBjdXIsIG9sZCwgZWxtID0gdm5vZGUuZWxtLFxuICAgICAgb2xkT24gPSBvbGRWbm9kZS5kYXRhLm9uIHx8IHt9LCBvbiA9IHZub2RlLmRhdGEub247XG4gIGlmICghb24pIHJldHVybjtcbiAgZm9yIChuYW1lIGluIG9uKSB7XG4gICAgY3VyID0gb25bbmFtZV07XG4gICAgb2xkID0gb2xkT25bbmFtZV07XG4gICAgaWYgKG9sZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaXMuYXJyYXkoY3VyKSkge1xuICAgICAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBhcnJJbnZva2VyKGN1cikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VyID0ge2ZuOiBjdXJ9O1xuICAgICAgICBvbltuYW1lXSA9IGN1cjtcbiAgICAgICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZm5JbnZva2VyKGN1cikpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXMuYXJyYXkob2xkKSkge1xuICAgICAgLy8gRGVsaWJlcmF0ZWx5IG1vZGlmeSBvbGQgYXJyYXkgc2luY2UgaXQncyBjYXB0dXJlZCBpbiBjbG9zdXJlIGNyZWF0ZWQgd2l0aCBgYXJySW52b2tlcmBcbiAgICAgIG9sZC5sZW5ndGggPSBjdXIubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGQubGVuZ3RoOyArK2kpIG9sZFtpXSA9IGN1cltpXTtcbiAgICAgIG9uW25hbWVdICA9IG9sZDtcbiAgICB9IGVsc2Uge1xuICAgICAgb2xkLmZuID0gY3VyO1xuICAgICAgb25bbmFtZV0gPSBvbGQ7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge2NyZWF0ZTogdXBkYXRlRXZlbnRMaXN0ZW5lcnMsIHVwZGF0ZTogdXBkYXRlRXZlbnRMaXN0ZW5lcnN9O1xuIiwiZnVuY3Rpb24gdXBkYXRlUHJvcHMob2xkVm5vZGUsIHZub2RlKSB7XG4gIHZhciBrZXksIGN1ciwgb2xkLCBlbG0gPSB2bm9kZS5lbG0sXG4gICAgICBvbGRQcm9wcyA9IG9sZFZub2RlLmRhdGEucHJvcHMgfHwge30sIHByb3BzID0gdm5vZGUuZGF0YS5wcm9wcyB8fCB7fTtcbiAgZm9yIChrZXkgaW4gb2xkUHJvcHMpIHtcbiAgICBpZiAoIXByb3BzW2tleV0pIHtcbiAgICAgIGRlbGV0ZSBlbG1ba2V5XTtcbiAgICB9XG4gIH1cbiAgZm9yIChrZXkgaW4gcHJvcHMpIHtcbiAgICBjdXIgPSBwcm9wc1trZXldO1xuICAgIG9sZCA9IG9sZFByb3BzW2tleV07XG4gICAgaWYgKG9sZCAhPT0gY3VyICYmIChrZXkgIT09ICd2YWx1ZScgfHwgZWxtW2tleV0gIT09IGN1cikpIHtcbiAgICAgIGVsbVtrZXldID0gY3VyO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtjcmVhdGU6IHVwZGF0ZVByb3BzLCB1cGRhdGU6IHVwZGF0ZVByb3BzfTtcbiIsInZhciByYWYgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgfHwgc2V0VGltZW91dDtcbnZhciBuZXh0RnJhbWUgPSBmdW5jdGlvbihmbikgeyByYWYoZnVuY3Rpb24oKSB7IHJhZihmbik7IH0pOyB9O1xuXG5mdW5jdGlvbiBzZXROZXh0RnJhbWUob2JqLCBwcm9wLCB2YWwpIHtcbiAgbmV4dEZyYW1lKGZ1bmN0aW9uKCkgeyBvYmpbcHJvcF0gPSB2YWw7IH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdHlsZShvbGRWbm9kZSwgdm5vZGUpIHtcbiAgdmFyIGN1ciwgbmFtZSwgZWxtID0gdm5vZGUuZWxtLFxuICAgICAgb2xkU3R5bGUgPSBvbGRWbm9kZS5kYXRhLnN0eWxlIHx8IHt9LFxuICAgICAgc3R5bGUgPSB2bm9kZS5kYXRhLnN0eWxlIHx8IHt9LFxuICAgICAgb2xkSGFzRGVsID0gJ2RlbGF5ZWQnIGluIG9sZFN0eWxlO1xuICBmb3IgKG5hbWUgaW4gb2xkU3R5bGUpIHtcbiAgICBpZiAoIXN0eWxlW25hbWVdKSB7XG4gICAgICBlbG0uc3R5bGVbbmFtZV0gPSAnJztcbiAgICB9XG4gIH1cbiAgZm9yIChuYW1lIGluIHN0eWxlKSB7XG4gICAgY3VyID0gc3R5bGVbbmFtZV07XG4gICAgaWYgKG5hbWUgPT09ICdkZWxheWVkJykge1xuICAgICAgZm9yIChuYW1lIGluIHN0eWxlLmRlbGF5ZWQpIHtcbiAgICAgICAgY3VyID0gc3R5bGUuZGVsYXllZFtuYW1lXTtcbiAgICAgICAgaWYgKCFvbGRIYXNEZWwgfHwgY3VyICE9PSBvbGRTdHlsZS5kZWxheWVkW25hbWVdKSB7XG4gICAgICAgICAgc2V0TmV4dEZyYW1lKGVsbS5zdHlsZSwgbmFtZSwgY3VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobmFtZSAhPT0gJ3JlbW92ZScgJiYgY3VyICE9PSBvbGRTdHlsZVtuYW1lXSkge1xuICAgICAgZWxtLnN0eWxlW25hbWVdID0gY3VyO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBseURlc3Ryb3lTdHlsZSh2bm9kZSkge1xuICB2YXIgc3R5bGUsIG5hbWUsIGVsbSA9IHZub2RlLmVsbSwgcyA9IHZub2RlLmRhdGEuc3R5bGU7XG4gIGlmICghcyB8fCAhKHN0eWxlID0gcy5kZXN0cm95KSkgcmV0dXJuO1xuICBmb3IgKG5hbWUgaW4gc3R5bGUpIHtcbiAgICBlbG0uc3R5bGVbbmFtZV0gPSBzdHlsZVtuYW1lXTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBseVJlbW92ZVN0eWxlKHZub2RlLCBybSkge1xuICB2YXIgcyA9IHZub2RlLmRhdGEuc3R5bGU7XG4gIGlmICghcyB8fCAhcy5yZW1vdmUpIHtcbiAgICBybSgpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmFtZSwgZWxtID0gdm5vZGUuZWxtLCBpZHgsIGkgPSAwLCBtYXhEdXIgPSAwLFxuICAgICAgY29tcFN0eWxlLCBzdHlsZSA9IHMucmVtb3ZlLCBhbW91bnQgPSAwLCBhcHBsaWVkID0gW107XG4gIGZvciAobmFtZSBpbiBzdHlsZSkge1xuICAgIGFwcGxpZWQucHVzaChuYW1lKTtcbiAgICBlbG0uc3R5bGVbbmFtZV0gPSBzdHlsZVtuYW1lXTtcbiAgfVxuICBjb21wU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsbSk7XG4gIHZhciBwcm9wcyA9IGNvbXBTdHlsZVsndHJhbnNpdGlvbi1wcm9wZXJ0eSddLnNwbGl0KCcsICcpO1xuICBmb3IgKDsgaSA8IHByb3BzLmxlbmd0aDsgKytpKSB7XG4gICAgaWYoYXBwbGllZC5pbmRleE9mKHByb3BzW2ldKSAhPT0gLTEpIGFtb3VudCsrO1xuICB9XG4gIGVsbS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgZnVuY3Rpb24oZXYpIHtcbiAgICBpZiAoZXYudGFyZ2V0ID09PSBlbG0pIC0tYW1vdW50O1xuICAgIGlmIChhbW91bnQgPT09IDApIHJtKCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtjcmVhdGU6IHVwZGF0ZVN0eWxlLCB1cGRhdGU6IHVwZGF0ZVN0eWxlLCBkZXN0cm95OiBhcHBseURlc3Ryb3lTdHlsZSwgcmVtb3ZlOiBhcHBseVJlbW92ZVN0eWxlfTtcbiIsIi8vIGpzaGludCBuZXdjYXA6IGZhbHNlXG4vKiBnbG9iYWwgcmVxdWlyZSwgbW9kdWxlLCBkb2N1bWVudCwgTm9kZSAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgVk5vZGUgPSByZXF1aXJlKCcuL3Zub2RlJyk7XG52YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG52YXIgZG9tQXBpID0gcmVxdWlyZSgnLi9odG1sZG9tYXBpLmpzJyk7XG5cbmZ1bmN0aW9uIGlzVW5kZWYocykgeyByZXR1cm4gcyA9PT0gdW5kZWZpbmVkOyB9XG5mdW5jdGlvbiBpc0RlZihzKSB7IHJldHVybiBzICE9PSB1bmRlZmluZWQ7IH1cblxudmFyIGVtcHR5Tm9kZSA9IFZOb2RlKCcnLCB7fSwgW10sIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcblxuZnVuY3Rpb24gc2FtZVZub2RlKHZub2RlMSwgdm5vZGUyKSB7XG4gIHJldHVybiB2bm9kZTEua2V5ID09PSB2bm9kZTIua2V5ICYmIHZub2RlMS5zZWwgPT09IHZub2RlMi5zZWw7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUtleVRvT2xkSWR4KGNoaWxkcmVuLCBiZWdpbklkeCwgZW5kSWR4KSB7XG4gIHZhciBpLCBtYXAgPSB7fSwga2V5O1xuICBmb3IgKGkgPSBiZWdpbklkeDsgaSA8PSBlbmRJZHg7ICsraSkge1xuICAgIGtleSA9IGNoaWxkcmVuW2ldLmtleTtcbiAgICBpZiAoaXNEZWYoa2V5KSkgbWFwW2tleV0gPSBpO1xuICB9XG4gIHJldHVybiBtYXA7XG59XG5cbnZhciBob29rcyA9IFsnY3JlYXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAnZGVzdHJveScsICdwcmUnLCAncG9zdCddO1xuXG5mdW5jdGlvbiBpbml0KG1vZHVsZXMsIGFwaSkge1xuICB2YXIgaSwgaiwgY2JzID0ge307XG5cbiAgaWYgKGlzVW5kZWYoYXBpKSkgYXBpID0gZG9tQXBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7ICsraSkge1xuICAgIGNic1tob29rc1tpXV0gPSBbXTtcbiAgICBmb3IgKGogPSAwOyBqIDwgbW9kdWxlcy5sZW5ndGg7ICsraikge1xuICAgICAgaWYgKG1vZHVsZXNbal1baG9va3NbaV1dICE9PSB1bmRlZmluZWQpIGNic1tob29rc1tpXV0ucHVzaChtb2R1bGVzW2pdW2hvb2tzW2ldXSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW1wdHlOb2RlQXQoZWxtKSB7XG4gICAgcmV0dXJuIFZOb2RlKGFwaS50YWdOYW1lKGVsbSkudG9Mb3dlckNhc2UoKSwge30sIFtdLCB1bmRlZmluZWQsIGVsbSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVSbUNiKGNoaWxkRWxtLCBsaXN0ZW5lcnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS1saXN0ZW5lcnMgPT09IDApIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IGFwaS5wYXJlbnROb2RlKGNoaWxkRWxtKTtcbiAgICAgICAgYXBpLnJlbW92ZUNoaWxkKHBhcmVudCwgY2hpbGRFbG0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbG0odm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgIHZhciBpLCB0aHVuaywgZGF0YSA9IHZub2RlLmRhdGE7XG4gICAgaWYgKGlzRGVmKGRhdGEpKSB7XG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuaW5pdCkpIGkodm5vZGUpO1xuICAgICAgaWYgKGlzRGVmKGkgPSBkYXRhLnZub2RlKSkge1xuICAgICAgICAgIHRodW5rID0gdm5vZGU7XG4gICAgICAgICAgdm5vZGUgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZWxtLCBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuLCBzZWwgPSB2bm9kZS5zZWw7XG4gICAgaWYgKGlzRGVmKHNlbCkpIHtcbiAgICAgIC8vIFBhcnNlIHNlbGVjdG9yXG4gICAgICB2YXIgaGFzaElkeCA9IHNlbC5pbmRleE9mKCcjJyk7XG4gICAgICB2YXIgZG90SWR4ID0gc2VsLmluZGV4T2YoJy4nLCBoYXNoSWR4KTtcbiAgICAgIHZhciBoYXNoID0gaGFzaElkeCA+IDAgPyBoYXNoSWR4IDogc2VsLmxlbmd0aDtcbiAgICAgIHZhciBkb3QgPSBkb3RJZHggPiAwID8gZG90SWR4IDogc2VsLmxlbmd0aDtcbiAgICAgIHZhciB0YWcgPSBoYXNoSWR4ICE9PSAtMSB8fCBkb3RJZHggIT09IC0xID8gc2VsLnNsaWNlKDAsIE1hdGgubWluKGhhc2gsIGRvdCkpIDogc2VsO1xuICAgICAgZWxtID0gdm5vZGUuZWxtID0gaXNEZWYoZGF0YSkgJiYgaXNEZWYoaSA9IGRhdGEubnMpID8gYXBpLmNyZWF0ZUVsZW1lbnROUyhpLCB0YWcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhcGkuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgaWYgKGhhc2ggPCBkb3QpIGVsbS5pZCA9IHNlbC5zbGljZShoYXNoICsgMSwgZG90KTtcbiAgICAgIGlmIChkb3RJZHggPiAwKSBlbG0uY2xhc3NOYW1lID0gc2VsLnNsaWNlKGRvdCsxKS5yZXBsYWNlKC9cXC4vZywgJyAnKTtcbiAgICAgIGlmIChpcy5hcnJheShjaGlsZHJlbikpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgYXBpLmFwcGVuZENoaWxkKGVsbSwgY3JlYXRlRWxtKGNoaWxkcmVuW2ldLCBpbnNlcnRlZFZub2RlUXVldWUpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpcy5wcmltaXRpdmUodm5vZGUudGV4dCkpIHtcbiAgICAgICAgYXBpLmFwcGVuZENoaWxkKGVsbSwgYXBpLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMuY3JlYXRlLmxlbmd0aDsgKytpKSBjYnMuY3JlYXRlW2ldKGVtcHR5Tm9kZSwgdm5vZGUpO1xuICAgICAgaSA9IHZub2RlLmRhdGEuaG9vazsgLy8gUmV1c2UgdmFyaWFibGVcbiAgICAgIGlmIChpc0RlZihpKSkge1xuICAgICAgICBpZiAoaS5jcmVhdGUpIGkuY3JlYXRlKGVtcHR5Tm9kZSwgdm5vZGUpO1xuICAgICAgICBpZiAoaS5pbnNlcnQpIGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoKHZub2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWxtID0gdm5vZGUuZWxtID0gYXBpLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpO1xuICAgIH1cbiAgICBpZiAoaXNEZWYodGh1bmspKSB0aHVuay5lbG0gPSB2bm9kZS5lbG07XG4gICAgcmV0dXJuIHZub2RlLmVsbTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFZub2RlcyhwYXJlbnRFbG0sIGJlZm9yZSwgdm5vZGVzLCBzdGFydElkeCwgZW5kSWR4LCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICBmb3IgKDsgc3RhcnRJZHggPD0gZW5kSWR4OyArK3N0YXJ0SWR4KSB7XG4gICAgICBhcGkuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgY3JlYXRlRWxtKHZub2Rlc1tzdGFydElkeF0sIGluc2VydGVkVm5vZGVRdWV1ZSksIGJlZm9yZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRGVzdHJveUhvb2sodm5vZGUpIHtcbiAgICB2YXIgaSwgaiwgZGF0YSA9IHZub2RlLmRhdGE7XG4gICAgLy8gY29uc29sZS5sb2coJ2ludm9rZURlc3Ryb3lIb29rJywgdm5vZGUpXG4gICAgaWYgKGlzRGVmKGRhdGEpKSB7XG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuZGVzdHJveSkpIGkodm5vZGUpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNicy5kZXN0cm95Lmxlbmd0aDsgKytpKSBjYnMuZGVzdHJveVtpXSh2bm9kZSk7XG4gICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmNoaWxkcmVuKSkge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICBpbnZva2VEZXN0cm95SG9vayh2bm9kZS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0RlZihpID0gZGF0YS52bm9kZSkpIGludm9rZURlc3Ryb3lIb29rKGkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0sIHZub2Rlcywgc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIGZvciAoOyBzdGFydElkeCA8PSBlbmRJZHg7ICsrc3RhcnRJZHgpIHtcbiAgICAgIHZhciBpLCBsaXN0ZW5lcnMsIHJtLCBjaCA9IHZub2Rlc1tzdGFydElkeF07XG4gICAgICBpZiAoaXNEZWYoY2gpKSB7XG4gICAgICAgIGlmIChpc0RlZihjaC5zZWwpKSB7XG4gICAgICAgICAgaW52b2tlRGVzdHJveUhvb2soY2gpO1xuICAgICAgICAgIGxpc3RlbmVycyA9IGNicy5yZW1vdmUubGVuZ3RoICsgMTtcbiAgICAgICAgICBybSA9IGNyZWF0ZVJtQ2IoY2guZWxtLCBsaXN0ZW5lcnMpO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMucmVtb3ZlLmxlbmd0aDsgKytpKSBjYnMucmVtb3ZlW2ldKGNoLCBybSk7XG4gICAgICAgICAgaWYgKGlzRGVmKGkgPSBjaC5kYXRhKSAmJiBpc0RlZihpID0gaS5ob29rKSAmJiBpc0RlZihpID0gaS5yZW1vdmUpKSB7XG4gICAgICAgICAgICBpKGNoLCBybSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJtKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBUZXh0IG5vZGVcbiAgICAgICAgICBhcGkucmVtb3ZlQ2hpbGQocGFyZW50RWxtLCBjaC5lbG0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQ2hpbGRyZW4ocGFyZW50RWxtLCBvbGRDaCwgbmV3Q2gsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgIHZhciBvbGRTdGFydElkeCA9IDAsIG5ld1N0YXJ0SWR4ID0gMDtcbiAgICB2YXIgb2xkRW5kSWR4ID0gb2xkQ2gubGVuZ3RoIC0gMTtcbiAgICB2YXIgb2xkU3RhcnRWbm9kZSA9IG9sZENoWzBdO1xuICAgIHZhciBvbGRFbmRWbm9kZSA9IG9sZENoW29sZEVuZElkeF07XG4gICAgdmFyIG5ld0VuZElkeCA9IG5ld0NoLmxlbmd0aCAtIDE7XG4gICAgdmFyIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFswXTtcbiAgICB2YXIgbmV3RW5kVm5vZGUgPSBuZXdDaFtuZXdFbmRJZHhdO1xuICAgIHZhciBvbGRLZXlUb0lkeCwgaWR4SW5PbGQsIGVsbVRvTW92ZSwgYmVmb3JlO1xuXG4gICAgd2hpbGUgKG9sZFN0YXJ0SWR4IDw9IG9sZEVuZElkeCAmJiBuZXdTdGFydElkeCA8PSBuZXdFbmRJZHgpIHtcbiAgICAgIGlmIChpc1VuZGVmKG9sZFN0YXJ0Vm5vZGUpKSB7XG4gICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFsrK29sZFN0YXJ0SWR4XTsgLy8gVm5vZGUgaGFzIGJlZW4gbW92ZWQgbGVmdFxuICAgICAgfSBlbHNlIGlmIChpc1VuZGVmKG9sZEVuZFZub2RlKSkge1xuICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgIH0gZWxzZSBpZiAoc2FtZVZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld1N0YXJ0Vm5vZGUpKSB7XG4gICAgICAgIHBhdGNoVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdO1xuICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3RW5kVm5vZGUpKSB7XG4gICAgICAgIHBhdGNoVm5vZGUob2xkRW5kVm5vZGUsIG5ld0VuZFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSkpIHsgLy8gVm5vZGUgbW92ZWQgcmlnaHRcbiAgICAgICAgcGF0Y2hWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtLCBhcGkubmV4dFNpYmxpbmcob2xkRW5kVm5vZGUuZWxtKSk7XG4gICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFsrK29sZFN0YXJ0SWR4XTtcbiAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3U3RhcnRWbm9kZSkpIHsgLy8gVm5vZGUgbW92ZWQgbGVmdFxuICAgICAgICBwYXRjaFZub2RlKG9sZEVuZFZub2RlLCBuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBhcGkuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgb2xkRW5kVm5vZGUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xuICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNVbmRlZihvbGRLZXlUb0lkeCkpIG9sZEtleVRvSWR4ID0gY3JlYXRlS2V5VG9PbGRJZHgob2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpO1xuICAgICAgICBpZHhJbk9sZCA9IG9sZEtleVRvSWR4W25ld1N0YXJ0Vm5vZGUua2V5XTtcbiAgICAgICAgaWYgKGlzVW5kZWYoaWR4SW5PbGQpKSB7IC8vIE5ldyBlbGVtZW50XG4gICAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIGNyZWF0ZUVsbShuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsbVRvTW92ZSA9IG9sZENoW2lkeEluT2xkXTtcbiAgICAgICAgICBwYXRjaFZub2RlKGVsbVRvTW92ZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgICBvbGRDaFtpZHhJbk9sZF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIGVsbVRvTW92ZS5lbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtKTtcbiAgICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9sZFN0YXJ0SWR4ID4gb2xkRW5kSWR4KSB7XG4gICAgICBiZWZvcmUgPSBpc1VuZGVmKG5ld0NoW25ld0VuZElkeCsxXSkgPyBudWxsIDogbmV3Q2hbbmV3RW5kSWR4KzFdLmVsbTtcbiAgICAgIGFkZFZub2RlcyhwYXJlbnRFbG0sIGJlZm9yZSwgbmV3Q2gsIG5ld1N0YXJ0SWR4LCBuZXdFbmRJZHgsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgfSBlbHNlIGlmIChuZXdTdGFydElkeCA+IG5ld0VuZElkeCkge1xuICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudEVsbSwgb2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdGNoVm5vZGUob2xkVm5vZGUsIHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICB2YXIgaSwgaG9vaztcbiAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmRhdGEpICYmIGlzRGVmKGhvb2sgPSBpLmhvb2spICYmIGlzRGVmKGkgPSBob29rLnByZXBhdGNoKSkge1xuICAgICAgaShvbGRWbm9kZSwgdm5vZGUpO1xuICAgIH1cbiAgICBpZiAoaXNEZWYoaSA9IG9sZFZub2RlLmRhdGEpICYmIGlzRGVmKGkgPSBpLnZub2RlKSkgb2xkVm5vZGUgPSBpO1xuICAgIGlmIChpc0RlZihpID0gdm5vZGUuZGF0YSkgJiYgaXNEZWYoaSA9IGkudm5vZGUpKSB7XG4gICAgICBwYXRjaFZub2RlKG9sZFZub2RlLCBpLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgdm5vZGUuZWxtID0gaS5lbG07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlbG0gPSB2bm9kZS5lbG0gPSBvbGRWbm9kZS5lbG0sIG9sZENoID0gb2xkVm5vZGUuY2hpbGRyZW4sIGNoID0gdm5vZGUuY2hpbGRyZW47XG4gICAgaWYgKG9sZFZub2RlID09PSB2bm9kZSkgcmV0dXJuO1xuICAgIGlmICghc2FtZVZub2RlKG9sZFZub2RlLCB2bm9kZSkpIHtcbiAgICAgIHZhciBwYXJlbnRFbG0gPSBhcGkucGFyZW50Tm9kZShvbGRWbm9kZS5lbG0pO1xuICAgICAgZWxtID0gY3JlYXRlRWxtKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIGVsbSwgb2xkVm5vZGUuZWxtKTtcbiAgICAgIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0sIFtvbGRWbm9kZV0sIDAsIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNEZWYodm5vZGUuZGF0YSkpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMudXBkYXRlLmxlbmd0aDsgKytpKSBjYnMudXBkYXRlW2ldKG9sZFZub2RlLCB2bm9kZSk7XG4gICAgICBpID0gdm5vZGUuZGF0YS5ob29rO1xuICAgICAgaWYgKGlzRGVmKGkpICYmIGlzRGVmKGkgPSBpLnVwZGF0ZSkpIGkob2xkVm5vZGUsIHZub2RlKTtcbiAgICB9XG4gICAgaWYgKGlzVW5kZWYodm5vZGUudGV4dCkpIHtcbiAgICAgIGlmIChpc0RlZihvbGRDaCkgJiYgaXNEZWYoY2gpKSB7XG4gICAgICAgIGlmIChvbGRDaCAhPT0gY2gpIHVwZGF0ZUNoaWxkcmVuKGVsbSwgb2xkQ2gsIGNoLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihjaCkpIHtcbiAgICAgICAgaWYgKGlzRGVmKG9sZFZub2RlLnRleHQpKSBhcGkuc2V0VGV4dENvbnRlbnQoZWxtLCAnJyk7XG4gICAgICAgIGFkZFZub2RlcyhlbG0sIG51bGwsIGNoLCAwLCBjaC5sZW5ndGggLSAxLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRDaCkpIHtcbiAgICAgICAgcmVtb3ZlVm5vZGVzKGVsbSwgb2xkQ2gsIDAsIG9sZENoLmxlbmd0aCAtIDEpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRWbm9kZS50ZXh0KSkge1xuICAgICAgICBhcGkuc2V0VGV4dENvbnRlbnQoZWxtLCAnJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvbGRWbm9kZS50ZXh0ICE9PSB2bm9kZS50ZXh0KSB7XG4gICAgICBhcGkuc2V0VGV4dENvbnRlbnQoZWxtLCB2bm9kZS50ZXh0KTtcbiAgICB9XG4gICAgaWYgKGlzRGVmKGhvb2spICYmIGlzRGVmKGkgPSBob29rLnBvc3RwYXRjaCkpIHtcbiAgICAgIGkob2xkVm5vZGUsIHZub2RlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24ob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgdmFyIGksIGVsbSwgcGFyZW50O1xuICAgIHZhciBpbnNlcnRlZFZub2RlUXVldWUgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLnByZS5sZW5ndGg7ICsraSkgY2JzLnByZVtpXSgpO1xuXG4gICAgaWYgKGlzVW5kZWYob2xkVm5vZGUuc2VsKSkge1xuICAgICAgb2xkVm5vZGUgPSBlbXB0eU5vZGVBdChvbGRWbm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKHNhbWVWbm9kZShvbGRWbm9kZSwgdm5vZGUpKSB7XG4gICAgICBwYXRjaFZub2RlKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxtID0gb2xkVm5vZGUuZWxtO1xuICAgICAgcGFyZW50ID0gYXBpLnBhcmVudE5vZGUoZWxtKTtcblxuICAgICAgY3JlYXRlRWxtKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuXG4gICAgICBpZiAocGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgIGFwaS5pbnNlcnRCZWZvcmUocGFyZW50LCB2bm9kZS5lbG0sIGFwaS5uZXh0U2libGluZyhlbG0pKTtcbiAgICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudCwgW29sZFZub2RlXSwgMCwgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGluc2VydGVkVm5vZGVRdWV1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgaW5zZXJ0ZWRWbm9kZVF1ZXVlW2ldLmRhdGEuaG9vay5pbnNlcnQoaW5zZXJ0ZWRWbm9kZVF1ZXVlW2ldKTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGNicy5wb3N0Lmxlbmd0aDsgKytpKSBjYnMucG9zdFtpXSgpO1xuICAgIHJldHVybiB2bm9kZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdDogaW5pdH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlbCwgZGF0YSwgY2hpbGRyZW4sIHRleHQsIGVsbSkge1xuICB2YXIga2V5ID0gZGF0YSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZGF0YS5rZXk7XG4gIHJldHVybiB7c2VsOiBzZWwsIGRhdGE6IGRhdGEsIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICAgICAgICB0ZXh0OiB0ZXh0LCBlbG06IGVsbSwga2V5OiBrZXl9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHQgPSByZXF1aXJlKCd0Y29tYicpO1xudmFyIHN0cmluZ2lmeSA9IHQuc3RyaW5naWZ5O1xuXG52YXIgVmFsaWRhdGlvbkVycm9yID0gdC5zdHJ1Y3Qoe1xuICBtZXNzYWdlOiB0LlN0cixcbiAgYWN0dWFsOiB0LkFueSxcbiAgZXhwZWN0ZWQ6IHQuQW55LFxuICBwYXRoOiB0Lmxpc3QodC51bmlvbihbdC5TdHIsIHQuTnVtXSkpXG59LCAnVmFsaWRhdGlvbkVycm9yJyk7XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlKGFjdHVhbCwgZXhwZWN0ZWQsIHBhdGgpIHtcbiAgdmFyIGV4cGVjdGVkTmFtZSA9IHQuZ2V0VHlwZU5hbWUoZXhwZWN0ZWQpO1xuICB2YXIgdG8gPSBwYXRoLmxlbmd0aCA/ICcvJyArIHBhdGguam9pbignLycpICsgJzogJyArIGV4cGVjdGVkTmFtZSA6IGV4cGVjdGVkTmFtZTtcbiAgcmV0dXJuICdJbnZhbGlkIHZhbHVlICcgKyBzdHJpbmdpZnkoYWN0dWFsKSArICcgc3VwcGxpZWQgdG8gJyArIHRvO1xufVxuXG5mdW5jdGlvbiBnZXRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlKGFjdHVhbCwgZXhwZWN0ZWQsIHBhdGgsIGNvbnRleHQpIHtcbiAgaWYgKHQuRnVuY3Rpb24uaXMoZXhwZWN0ZWQuZ2V0VmFsaWRhdGlvbkVycm9yTWVzc2FnZSkpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQuZ2V0VmFsaWRhdGlvbkVycm9yTWVzc2FnZShhY3R1YWwsIHBhdGgsIGNvbnRleHQpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiBnZXREZWZhdWx0VmFsaWRhdGlvbkVycm9yTWVzc2FnZShhY3R1YWwsIGV4cGVjdGVkLCBwYXRoKTtcbiAgfVxufVxuXG5WYWxpZGF0aW9uRXJyb3Iub2YgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgcGF0aCwgY29udGV4dCkge1xuICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogZ2V0VmFsaWRhdGlvbkVycm9yTWVzc2FnZShhY3R1YWwsIGV4cGVjdGVkLCBwYXRoLCBjb250ZXh0KSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgcGF0aDogcGF0aFxuICB9KTtcbn07XG5cbnZhciBWYWxpZGF0aW9uUmVzdWx0ID0gdC5zdHJ1Y3Qoe1xuICBlcnJvcnM6IHQubGlzdChWYWxpZGF0aW9uRXJyb3IpLFxuICB2YWx1ZTogdC5Bbnlcbn0sICdWYWxpZGF0aW9uUmVzdWx0Jyk7XG5cblZhbGlkYXRpb25SZXN1bHQucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAhKHRoaXMuZXJyb3JzLmxlbmd0aCk7XG59O1xuXG5WYWxpZGF0aW9uUmVzdWx0LnByb3RvdHlwZS5maXJzdEVycm9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyBudWxsIDogdGhpcy5lcnJvcnNbMF07XG59O1xuXG5WYWxpZGF0aW9uUmVzdWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuICdbVmFsaWRhdGlvblJlc3VsdCwgdHJ1ZSwgJyArIHN0cmluZ2lmeSh0aGlzLnZhbHVlKSArICddJztcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gJ1tWYWxpZGF0aW9uUmVzdWx0LCBmYWxzZSwgKCcgKyB0aGlzLmVycm9ycy5tYXAoZnVuY3Rpb24gKGVycikge1xuICAgICAgcmV0dXJuIGVyci5tZXNzYWdlO1xuICAgIH0pLmpvaW4oJywgJykgKyAnKV0nO1xuICB9XG59O1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh4LCB0eXBlLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcGF0aCA9IHQuQXJyYXkuaXMob3B0aW9ucykgPyBvcHRpb25zIDogb3B0aW9ucy5wYXRoIHx8IFtdO1xuICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQocmVjdXJzZSh4LCB0eXBlLCBwYXRoLCBvcHRpb25zKSk7XG59XG5cbmZ1bmN0aW9uIHJlY3Vyc2UoeCwgdHlwZSwgcGF0aCwgb3B0aW9ucykge1xuICBpZiAodC5pc1R5cGUodHlwZSkpIHtcbiAgICByZXR1cm4gdmFsaWRhdG9yc1t0eXBlLm1ldGEua2luZF0oeCwgdHlwZSwgcGF0aCwgb3B0aW9ucyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnMuZXM2Y2xhc3Nlcyh4LCB0eXBlLCBwYXRoLCBvcHRpb25zKTtcbiAgfVxufVxuXG52YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRlLnZhbGlkYXRvcnMgPSB7fTtcblxudmFsaWRhdG9ycy5lczZjbGFzc2VzID0gZnVuY3Rpb24gdmFsaWRhdGVFUzZDbGFzc2VzKHgsIHR5cGUsIHBhdGgsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogeCxcbiAgICBlcnJvcnM6IHggaW5zdGFuY2VvZiB0eXBlID8gW10gOiBbVmFsaWRhdGlvbkVycm9yLm9mKHgsIHR5cGUsIHBhdGgsIG9wdGlvbnMuY29udGV4dCldXG4gIH07XG59O1xuXG4vLyBpcnJlZHVjaWJsZXMgYW5kIGVudW1zXG52YWxpZGF0b3JzLmlycmVkdWNpYmxlID1cbnZhbGlkYXRvcnMuZW51bXMgPSBmdW5jdGlvbiB2YWxpZGF0ZUlycmVkdWNpYmxlKHgsIHR5cGUsIHBhdGgsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogeCxcbiAgICBlcnJvcnM6IHR5cGUuaXMoeCkgPyBbXSA6IFtWYWxpZGF0aW9uRXJyb3Iub2YoeCwgdHlwZSwgcGF0aCwgb3B0aW9ucy5jb250ZXh0KV1cbiAgfTtcbn07XG5cbnZhbGlkYXRvcnMubGlzdCA9IGZ1bmN0aW9uIHZhbGlkYXRlTGlzdCh4LCB0eXBlLCBwYXRoLCBvcHRpb25zKSB7XG5cbiAgLy8geCBzaG91bGQgYmUgYW4gYXJyYXlcbiAgaWYgKCF0LkFyci5pcyh4KSkge1xuICAgIHJldHVybiB7dmFsdWU6IHgsIGVycm9yczogW1ZhbGlkYXRpb25FcnJvci5vZih4LCB0eXBlLCBwYXRoLCBvcHRpb25zLmNvbnRleHQpXX07XG4gIH1cblxuICB2YXIgcmV0ID0ge3ZhbHVlOiBbXSwgZXJyb3JzOiBbXX07XG4gIC8vIGV2ZXJ5IGl0ZW0gc2hvdWxkIGJlIG9mIHR5cGUgYHR5cGUubWV0YS50eXBlYFxuICBmb3IgKHZhciBpID0gMCwgbGVuID0geC5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgaXRlbSA9IHJlY3Vyc2UoeFtpXSwgdHlwZS5tZXRhLnR5cGUsIHBhdGguY29uY2F0KGkpLCBvcHRpb25zKTtcbiAgICByZXQudmFsdWVbaV0gPSBpdGVtLnZhbHVlO1xuICAgIHJldC5lcnJvcnMgPSByZXQuZXJyb3JzLmNvbmNhdChpdGVtLmVycm9ycyk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbnZhbGlkYXRvcnMuc3VidHlwZSA9IGZ1bmN0aW9uIHZhbGlkYXRlU3VidHlwZSh4LCB0eXBlLCBwYXRoLCBvcHRpb25zKSB7XG5cbiAgLy8geCBzaG91bGQgYmUgYSB2YWxpZCBpbm5lciB0eXBlXG4gIHZhciByZXQgPSByZWN1cnNlKHgsIHR5cGUubWV0YS50eXBlLCBwYXRoLCBvcHRpb25zKTtcbiAgaWYgKHJldC5lcnJvcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIHggc2hvdWxkIHNhdGlzZnkgdGhlIHByZWRpY2F0ZVxuICBpZiAoIXR5cGUubWV0YS5wcmVkaWNhdGUocmV0LnZhbHVlKSkge1xuICAgIHJldC5lcnJvcnMgPSBbVmFsaWRhdGlvbkVycm9yLm9mKHgsIHR5cGUsIHBhdGgsIG9wdGlvbnMuY29udGV4dCldO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcblxufTtcblxudmFsaWRhdG9ycy5tYXliZSA9IGZ1bmN0aW9uIHZhbGlkYXRlTWF5YmUoeCwgdHlwZSwgcGF0aCwgb3B0aW9ucykge1xuICByZXR1cm4gdC5OaWwuaXMoeCkgP1xuICAgIHt2YWx1ZTogbnVsbCwgZXJyb3JzOiBbXX0gOlxuICAgIHJlY3Vyc2UoeCwgdHlwZS5tZXRhLnR5cGUsIHBhdGgsIG9wdGlvbnMpO1xufTtcblxudmFsaWRhdG9ycy5zdHJ1Y3QgPSBmdW5jdGlvbiB2YWxpZGF0ZVN0cnVjdCh4LCB0eXBlLCBwYXRoLCBvcHRpb25zKSB7XG5cbiAgLy8geCBzaG91bGQgYmUgYW4gb2JqZWN0XG4gIGlmICghdC5PYmouaXMoeCkpIHtcbiAgICByZXR1cm4ge3ZhbHVlOiB4LCBlcnJvcnM6IFtWYWxpZGF0aW9uRXJyb3Iub2YoeCwgdHlwZSwgcGF0aCwgb3B0aW9ucy5jb250ZXh0KV19O1xuICB9XG5cbiAgLy8gW29wdGltaXphdGlvbl1cbiAgaWYgKHR5cGUuaXMoeCkpIHtcbiAgICByZXR1cm4ge3ZhbHVlOiB4LCBlcnJvcnM6IFtdfTtcbiAgfVxuXG4gIHZhciByZXQgPSB7dmFsdWU6IHt9LCBlcnJvcnM6IFtdfTtcbiAgdmFyIHByb3BzID0gdHlwZS5tZXRhLnByb3BzO1xuICAvLyBldmVyeSBpdGVtIHNob3VsZCBiZSBvZiB0eXBlIGBwcm9wc1tuYW1lXWBcbiAgZm9yICh2YXIgbmFtZSBpbiBwcm9wcykge1xuICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgdmFyIHByb3AgPSByZWN1cnNlKHhbbmFtZV0sIHByb3BzW25hbWVdLCBwYXRoLmNvbmNhdChuYW1lKSwgb3B0aW9ucyk7XG4gICAgICByZXQudmFsdWVbbmFtZV0gPSBwcm9wLnZhbHVlO1xuICAgICAgcmV0LmVycm9ycyA9IHJldC5lcnJvcnMuY29uY2F0KHByb3AuZXJyb3JzKTtcbiAgICB9XG4gIH1cbiAgaWYgKG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgZm9yICh2YXIgZmllbGQgaW4geCkge1xuICAgICAgaWYgKHguaGFzT3duUHJvcGVydHkoZmllbGQpICYmICFwcm9wcy5oYXNPd25Qcm9wZXJ0eShmaWVsZCkgJiYgIXQuTmlsLmlzKHhbZmllbGRdKSkge1xuICAgICAgICByZXQuZXJyb3JzLnB1c2goVmFsaWRhdGlvbkVycm9yLm9mKHhbZmllbGRdLCB0Lk5pbCwgcGF0aC5jb25jYXQoZmllbGQpLCBvcHRpb25zLmNvbnRleHQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFyZXQuZXJyb3JzLmxlbmd0aCkge1xuICAgIHJldC52YWx1ZSA9IG5ldyB0eXBlKHJldC52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbnZhbGlkYXRvcnMudHVwbGUgPSBmdW5jdGlvbiB2YWxpZGF0ZVR1cGxlKHgsIHR5cGUsIHBhdGgsIG9wdGlvbnMpIHtcblxuICB2YXIgdHlwZXMgPSB0eXBlLm1ldGEudHlwZXM7XG4gIHZhciBsZW4gPSB0eXBlcy5sZW5ndGg7XG5cbiAgLy8geCBzaG91bGQgYmUgYW4gYXJyYXkgb2YgYXQgbW9zdCBgbGVuYCBpdGVtc1xuICBpZiAoIXQuQXJyLmlzKHgpIHx8IHgubGVuZ3RoID4gbGVuKSB7XG4gICAgcmV0dXJuIHt2YWx1ZTogeCwgZXJyb3JzOiBbVmFsaWRhdGlvbkVycm9yLm9mKHgsIHR5cGUsIHBhdGgsIG9wdGlvbnMuY29udGV4dCldfTtcbiAgfVxuXG4gIHZhciByZXQgPSB7dmFsdWU6IFtdLCBlcnJvcnM6IFtdfTtcbiAgLy8gZXZlcnkgaXRlbSBzaG91bGQgYmUgb2YgdHlwZSBgdHlwZXNbaV1gXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IHJlY3Vyc2UoeFtpXSwgdHlwZXNbaV0sIHBhdGguY29uY2F0KGkpLCBvcHRpb25zKTtcbiAgICByZXQudmFsdWVbaV0gPSBpdGVtLnZhbHVlO1xuICAgIHJldC5lcnJvcnMgPSByZXQuZXJyb3JzLmNvbmNhdChpdGVtLmVycm9ycyk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbnZhbGlkYXRvcnMuZGljdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRGljdCh4LCB0eXBlLCBwYXRoLCBvcHRpb25zKSB7XG5cbiAgLy8geCBzaG91bGQgYmUgYW4gb2JqZWN0XG4gIGlmICghdC5PYmouaXMoeCkpIHtcbiAgICByZXR1cm4ge3ZhbHVlOiB4LCBlcnJvcnM6IFtWYWxpZGF0aW9uRXJyb3Iub2YoeCwgdHlwZSwgcGF0aCwgb3B0aW9ucy5jb250ZXh0KV19O1xuICB9XG5cbiAgdmFyIHJldCA9IHt2YWx1ZToge30sIGVycm9yczogW119O1xuICAvLyBldmVyeSBrZXkgc2hvdWxkIGJlIG9mIHR5cGUgYGRvbWFpbmBcbiAgLy8gZXZlcnkgdmFsdWUgc2hvdWxkIGJlIG9mIHR5cGUgYGNvZG9tYWluYFxuICBmb3IgKHZhciBrIGluIHgpIHtcbiAgICBpZiAoeC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgdmFyIHN1YnBhdGggPSBwYXRoLmNvbmNhdChrKTtcbiAgICAgIHZhciBrZXkgPSByZWN1cnNlKGssIHR5cGUubWV0YS5kb21haW4sIHN1YnBhdGgsIG9wdGlvbnMpO1xuICAgICAgdmFyIGl0ZW0gPSByZWN1cnNlKHhba10sIHR5cGUubWV0YS5jb2RvbWFpbiwgc3VicGF0aCwgb3B0aW9ucyk7XG4gICAgICByZXQudmFsdWVba10gPSBpdGVtLnZhbHVlO1xuICAgICAgcmV0LmVycm9ycyA9IHJldC5lcnJvcnMuY29uY2F0KGtleS5lcnJvcnMsIGl0ZW0uZXJyb3JzKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbnZhbGlkYXRvcnMudW5pb24gPSBmdW5jdGlvbiB2YWxpZGF0ZVVuaW9uKHgsIHR5cGUsIHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIGN0b3IgPSB0eXBlLmRpc3BhdGNoKHgpO1xuICByZXR1cm4gdC5GdW5jLmlzKGN0b3IpID9cbiAgICByZWN1cnNlKHgsIGN0b3IsIHBhdGguY29uY2F0KHR5cGUubWV0YS50eXBlcy5pbmRleE9mKGN0b3IpKSwgb3B0aW9ucykgOlxuICAgIHt2YWx1ZTogeCwgZXJyb3JzOiBbVmFsaWRhdGlvbkVycm9yLm9mKHgsIHR5cGUsIHBhdGgsIG9wdGlvbnMuY29udGV4dCldfTtcbn07XG5cbnZhbGlkYXRvcnMuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gdmFsaWRhdGVJbnRlcnNlY3Rpb24oeCwgdHlwZSwgcGF0aCwgb3B0aW9ucykge1xuXG4gIHZhciB0eXBlcyA9IHR5cGUubWV0YS50eXBlcztcbiAgdmFyIGxlbiA9IHR5cGVzLmxlbmd0aDtcblxuICB2YXIgcmV0ID0ge3ZhbHVlOiB4LCBlcnJvcnM6IFtdfTtcbiAgLy8geCBzaG91bGQgYmUgb2YgdHlwZSBgdHlwZXNbaV1gIGZvciBhbGwgaVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSByZWN1cnNlKHgsIHR5cGVzW2ldLCBwYXRoLCBvcHRpb25zKTtcbiAgICByZXQuZXJyb3JzID0gcmV0LmVycm9ycy5jb25jYXQoaXRlbS5lcnJvcnMpO1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG50Lm1peGluKHQsIHtcbiAgVmFsaWRhdGlvbkVycm9yOiBWYWxpZGF0aW9uRXJyb3IsXG4gIFZhbGlkYXRpb25SZXN1bHQ6IFZhbGlkYXRpb25SZXN1bHQsXG4gIHZhbGlkYXRlOiB2YWxpZGF0ZVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdDtcbiIsIi8qISBAcHJlc2VydmVcbiAqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNiBHaXVsaW8gQ2FudGlcbiAqXG4gKi9cblxuLy8gY29yZVxudmFyIHQgPSByZXF1aXJlKCcuL2xpYi9hc3NlcnQnKTtcblxuLy8gdHlwZXNcbnQuQW55ID0gcmVxdWlyZSgnLi9saWIvQW55Jyk7XG50LkFycmF5ID0gcmVxdWlyZSgnLi9saWIvQXJyYXknKTtcbnQuQm9vbGVhbiA9IHJlcXVpcmUoJy4vbGliL0Jvb2xlYW4nKTtcbnQuRGF0ZSA9IHJlcXVpcmUoJy4vbGliL0RhdGUnKTtcbnQuRXJyb3IgPSByZXF1aXJlKCcuL2xpYi9FcnJvcicpO1xudC5GdW5jdGlvbiA9IHJlcXVpcmUoJy4vbGliL0Z1bmN0aW9uJyk7XG50Lk5pbCA9IHJlcXVpcmUoJy4vbGliL05pbCcpO1xudC5OdW1iZXIgPSByZXF1aXJlKCcuL2xpYi9OdW1iZXInKTtcbnQuT2JqZWN0ID0gcmVxdWlyZSgnLi9saWIvT2JqZWN0Jyk7XG50LlJlZ0V4cCA9IHJlcXVpcmUoJy4vbGliL1JlZ0V4cCcpO1xudC5TdHJpbmcgPSByZXF1aXJlKCcuL2xpYi9TdHJpbmcnKTtcblxuLy8gc2hvcnQgYWxpYXMgYXJlIGRlcHJlY2F0ZWRcbnQuQXJyID0gdC5BcnJheTtcbnQuQm9vbCA9IHQuQm9vbGVhbjtcbnQuRGF0ID0gdC5EYXRlO1xudC5FcnIgPSB0LkVycm9yO1xudC5GdW5jID0gdC5GdW5jdGlvbjtcbnQuTnVtID0gdC5OdW1iZXI7XG50Lk9iaiA9IHQuT2JqZWN0O1xudC5SZSA9IHQuUmVnRXhwO1xudC5TdHIgPSB0LlN0cmluZztcblxuLy8gY29tYmluYXRvcnNcbnQuZGljdCA9IHJlcXVpcmUoJy4vbGliL2RpY3QnKTtcbnQuZGVjbGFyZSA9IHJlcXVpcmUoJy4vbGliL2RlY2xhcmUnKTtcbnQuZW51bXMgPSByZXF1aXJlKCcuL2xpYi9lbnVtcycpO1xudC5pcnJlZHVjaWJsZSA9IHJlcXVpcmUoJy4vbGliL2lycmVkdWNpYmxlJyk7XG50Lmxpc3QgPSByZXF1aXJlKCcuL2xpYi9saXN0Jyk7XG50Lm1heWJlID0gcmVxdWlyZSgnLi9saWIvbWF5YmUnKTtcbnQucmVmaW5lbWVudCA9IHJlcXVpcmUoJy4vbGliL3JlZmluZW1lbnQnKTtcbnQuc3RydWN0ID0gcmVxdWlyZSgnLi9saWIvc3RydWN0Jyk7XG50LnR1cGxlID0gcmVxdWlyZSgnLi9saWIvdHVwbGUnKTtcbnQudW5pb24gPSByZXF1aXJlKCcuL2xpYi91bmlvbicpO1xudC5mdW5jID0gcmVxdWlyZSgnLi9saWIvZnVuYycpO1xudC5pbnRlcnNlY3Rpb24gPSByZXF1aXJlKCcuL2xpYi9pbnRlcnNlY3Rpb24nKTtcbnQuc3VidHlwZSA9IHQucmVmaW5lbWVudDtcblxuLy8gZnVuY3Rpb25zXG50LmFzc2VydCA9IHQ7XG50LnVwZGF0ZSA9IHJlcXVpcmUoJy4vbGliL3VwZGF0ZScpO1xudC5taXhpbiA9IHJlcXVpcmUoJy4vbGliL21peGluJyk7XG50LmlzVHlwZSA9IHJlcXVpcmUoJy4vbGliL2lzVHlwZScpO1xudC5pcyA9IHJlcXVpcmUoJy4vbGliL2lzJyk7XG50LmdldFR5cGVOYW1lID0gcmVxdWlyZSgnLi9saWIvZ2V0VHlwZU5hbWUnKTtcbnQubWF0Y2ggPSByZXF1aXJlKCcuL2xpYi9tYXRjaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHQ7XG4iLCJ2YXIgaXJyZWR1Y2libGUgPSByZXF1aXJlKCcuL2lycmVkdWNpYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXJyZWR1Y2libGUoJ0FueScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pO1xuIiwidmFyIGlycmVkdWNpYmxlID0gcmVxdWlyZSgnLi9pcnJlZHVjaWJsZScpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBpcnJlZHVjaWJsZSgnQXJyYXknLCBpc0FycmF5KTtcbiIsInZhciBpcnJlZHVjaWJsZSA9IHJlcXVpcmUoJy4vaXJyZWR1Y2libGUnKTtcbnZhciBpc0Jvb2xlYW4gPSByZXF1aXJlKCcuL2lzQm9vbGVhbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlycmVkdWNpYmxlKCdCb29sZWFuJywgaXNCb29sZWFuKTtcbiIsInZhciBpcnJlZHVjaWJsZSA9IHJlcXVpcmUoJy4vaXJyZWR1Y2libGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBpcnJlZHVjaWJsZSgnRGF0ZScsIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4IGluc3RhbmNlb2YgRGF0ZTsgfSk7XG4iLCJ2YXIgaXJyZWR1Y2libGUgPSByZXF1aXJlKCcuL2lycmVkdWNpYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXJyZWR1Y2libGUoJ0Vycm9yJywgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHggaW5zdGFuY2VvZiBFcnJvcjsgfSk7XG4iLCJ2YXIgaXJyZWR1Y2libGUgPSByZXF1aXJlKCcuL2lycmVkdWNpYmxlJyk7XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlycmVkdWNpYmxlKCdGdW5jdGlvbicsIGlzRnVuY3Rpb24pO1xuIiwidmFyIGlycmVkdWNpYmxlID0gcmVxdWlyZSgnLi9pcnJlZHVjaWJsZScpO1xudmFyIGlzTmlsID0gcmVxdWlyZSgnLi9pc05pbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlycmVkdWNpYmxlKCdOaWwnLCBpc05pbCk7XG4iLCJ2YXIgaXJyZWR1Y2libGUgPSByZXF1aXJlKCcuL2lycmVkdWNpYmxlJyk7XG52YXIgaXNOdW1iZXIgPSByZXF1aXJlKCcuL2lzTnVtYmVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXJyZWR1Y2libGUoJ051bWJlcicsIGlzTnVtYmVyKTtcbiIsInZhciBpcnJlZHVjaWJsZSA9IHJlcXVpcmUoJy4vaXJyZWR1Y2libGUnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBpcnJlZHVjaWJsZSgnT2JqZWN0JywgaXNPYmplY3QpO1xuIiwidmFyIGlycmVkdWNpYmxlID0gcmVxdWlyZSgnLi9pcnJlZHVjaWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlycmVkdWNpYmxlKCdSZWdFeHAnLCBmdW5jdGlvbiAoeCkgeyByZXR1cm4geCBpbnN0YW5jZW9mIFJlZ0V4cDsgfSk7XG4iLCJ2YXIgaXJyZWR1Y2libGUgPSByZXF1aXJlKCcuL2lycmVkdWNpYmxlJyk7XG52YXIgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXJyZWR1Y2libGUoJ1N0cmluZycsIGlzU3RyaW5nKTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyk7XG52YXIgaXNOaWwgPSByZXF1aXJlKCcuL2lzTmlsJyk7XG52YXIgZmFpbCA9IHJlcXVpcmUoJy4vZmFpbCcpO1xudmFyIHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG5cbmZ1bmN0aW9uIGFzc2VydChndWFyZCwgbWVzc2FnZSkge1xuICBpZiAoZ3VhcmQgIT09IHRydWUpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihtZXNzYWdlKSkgeyAvLyBoYW5kbGUgbGF6eSBtZXNzYWdlc1xuICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNOaWwobWVzc2FnZSkpIHsgLy8gdXNlIGEgZGVmYXVsdCBtZXNzYWdlXG4gICAgICBtZXNzYWdlID0gJ0Fzc2VydCBmYWlsZWQgKHR1cm4gb24gXCJQYXVzZSBvbiBleGNlcHRpb25zXCIgaW4geW91ciBTb3VyY2UgcGFuZWwpJztcbiAgICB9XG4gICAgYXNzZXJ0LmZhaWwobWVzc2FnZSk7XG4gIH1cbn1cblxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuYXNzZXJ0LnN0cmluZ2lmeSA9IHN0cmluZ2lmeTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NlcnQ7IiwidmFyIGlzVHlwZSA9IHJlcXVpcmUoJy4vaXNUeXBlJyk7XG52YXIgaXNTdHJ1Y3QgPSByZXF1aXJlKCcuL2lzU3RydWN0Jyk7XG52YXIgZ2V0RnVuY3Rpb25OYW1lID0gcmVxdWlyZSgnLi9nZXRGdW5jdGlvbk5hbWUnKTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG5cbi8vIGNyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYSB0eXBlLCBoYW5kbGluZyB0aGUgb3B0aW9uYWwgbmV3IG9wZXJhdG9yXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZSh0eXBlLCB2YWx1ZSwgcGF0aCkge1xuICBpZiAoaXNUeXBlKHR5cGUpKSB7XG4gICAgLy8gZm9yIHN0cnVjdHMgdGhlIG5ldyBvcGVyYXRvciBpcyBhbGxvd2VkXG4gICAgcmV0dXJuIGlzU3RydWN0KHR5cGUpID8gbmV3IHR5cGUodmFsdWUsIHBhdGgpIDogdHlwZSh2YWx1ZSwgcGF0aCk7XG4gIH1cblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIGhlcmUgdHlwZSBzaG91bGQgYmUgYSBjbGFzcyBjb25zdHJ1Y3RvciBhbmQgdmFsdWUgc29tZSBpbnN0YW5jZSwganVzdCBjaGVjayBtZW1iZXJzaGlwIGFuZCByZXR1cm4gdGhlIHZhbHVlXG4gICAgcGF0aCA9IHBhdGggfHwgW2dldEZ1bmN0aW9uTmFtZSh0eXBlKV07XG4gICAgYXNzZXJ0KHZhbHVlIGluc3RhbmNlb2YgdHlwZSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgdmFsdWUgJyArIHN0cmluZ2lmeSh2YWx1ZSkgKyAnIHN1cHBsaWVkIHRvICcgKyBwYXRoLmpvaW4oJy8nKTsgfSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59OyIsInZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIGlzVHlwZU5hbWUgPSByZXF1aXJlKCcuL2lzVHlwZU5hbWUnKTtcbnZhciBpc1R5cGUgPSByZXF1aXJlKCcuL2lzVHlwZScpO1xudmFyIGlzTmlsID0gcmVxdWlyZSgnLi9pc05pbCcpO1xudmFyIG1peGluID0gcmVxdWlyZSgnLi9taXhpbicpO1xudmFyIGdldFR5cGVOYW1lID0gcmVxdWlyZSgnLi9nZXRUeXBlTmFtZScpO1xuXG4vLyBBbGwgdGhlIC5kZWNsYXJlLWQgdHlwZXMgc2hvdWxkIGJlIGNsZWFybHkgZGlmZmVyZW50IGZyb20gZWFjaCBvdGhlciB0aHVzIHRoZXkgc2hvdWxkIGhhdmVcbi8vIGRpZmZlcmVudCBuYW1lcyB3aGVuIGEgbmFtZSB3YXMgbm90IGV4cGxpY2l0bHkgcHJvdmlkZWQuXG52YXIgbmV4dERlY2xhcmVVbmlxdWVJZCA9IDE7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVjbGFyZShuYW1lKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYXNzZXJ0KGlzVHlwZU5hbWUobmFtZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50IG5hbWUgJyArIG5hbWUgKyAnIHN1cHBsaWVkIHRvIGRlY2xhcmUoW25hbWVdKSAoZXhwZWN0ZWQgYSBzdHJpbmcpJzsgfSk7XG4gIH1cblxuICB2YXIgdHlwZTtcblxuICBmdW5jdGlvbiBEZWNsYXJlKHZhbHVlLCBwYXRoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGFzc2VydCghaXNOaWwodHlwZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdUeXBlIGRlY2xhcmVkIGJ1dCBub3QgZGVmaW5lZCwgZG9uXFwndCBmb3JnZXQgdG8gY2FsbCAuZGVmaW5lIG9uIGV2ZXJ5IGRlY2xhcmVkIHR5cGUnOyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGUodmFsdWUsIHBhdGgpO1xuICB9XG5cbiAgRGVjbGFyZS5kZWZpbmUgPSBmdW5jdGlvbiAoc3BlYykge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBhc3NlcnQoaXNUeXBlKHNwZWMpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCB0eXBlICcgKyBhc3NlcnQuc3RyaW5naWZ5KHNwZWMpICsgICcgc3VwcGxpZWQgdG8gZGVmaW5lKHR5cGUpIChleHBlY3RlZCBhIHR5cGUpJzsgfSk7XG4gICAgICBhc3NlcnQoaXNOaWwodHlwZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdEZWNsYXJlLmRlZmluZSh0eXBlKSBjYW4gb25seSBiZSBpbnZva2VkIG9uY2UnOyB9KTtcbiAgICAgIGFzc2VydChpc05pbChzcGVjLm1ldGEubmFtZSkgJiYgT2JqZWN0LmtleXMoc3BlYy5wcm90b3R5cGUpLmxlbmd0aCA9PT0gMCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgdHlwZSAnICsgYXNzZXJ0LnN0cmluZ2lmeShzcGVjKSArICcgc3VwcGxpZWQgdG8gZGVmaW5lKHR5cGUpIChleHBlY3RlZCBhIGZyZXNoLCB1bm5hbWVkIHR5cGUpJzsgfSk7XG4gICAgfVxuXG4gICAgdHlwZSA9IHNwZWM7XG4gICAgbWl4aW4oRGVjbGFyZSwgdHlwZSwgdHJ1ZSk7IC8vIHRydWUgYmVjYXVzZSBpdCBvdmVyd3JpdGVzIERlY2xhcmUuZGlzcGxheU5hbWVcbiAgICBpZiAobmFtZSkge1xuICAgICAgdHlwZS5kaXNwbGF5TmFtZSA9IERlY2xhcmUuZGlzcGxheU5hbWUgPSBuYW1lO1xuICAgICAgRGVjbGFyZS5tZXRhLm5hbWUgPSBuYW1lO1xuICAgIH1cbiAgICAvLyBlbnN1cmUgaWRlbnRpdHkgaXMgc3RpbGwgZmFsc2VcbiAgICBEZWNsYXJlLm1ldGEuaWRlbnRpdHkgPSBmYWxzZTtcbiAgICBEZWNsYXJlLnByb3RvdHlwZSA9IHR5cGUucHJvdG90eXBlO1xuICAgIHJldHVybiBEZWNsYXJlO1xuICB9O1xuXG4gIERlY2xhcmUuZGlzcGxheU5hbWUgPSBuYW1lIHx8ICggZ2V0VHlwZU5hbWUoRGVjbGFyZSkgKyBcIiRcIiArIG5leHREZWNsYXJlVW5pcXVlSWQrKyApO1xuICAvLyBpbiBnZW5lcmFsIEkgY2FuJ3Qgc2F5IGlmIHRoaXMgdHlwZSB3aWxsIGJlIGFuIGlkZW50aXR5LCBmb3Igc2FmZXR5IHNldHRpbmcgdG8gZmFsc2VcbiAgRGVjbGFyZS5tZXRhID0geyBpZGVudGl0eTogZmFsc2UgfTtcbiAgRGVjbGFyZS5wcm90b3R5cGUgPSBudWxsO1xuICByZXR1cm4gRGVjbGFyZTtcbn07XG4iLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9hc3NlcnQnKTtcbnZhciBpc1R5cGVOYW1lID0gcmVxdWlyZSgnLi9pc1R5cGVOYW1lJyk7XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpO1xudmFyIGdldFR5cGVOYW1lID0gcmVxdWlyZSgnLi9nZXRUeXBlTmFtZScpO1xudmFyIGlzSWRlbnRpdHkgPSByZXF1aXJlKCcuL2lzSWRlbnRpdHknKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL2NyZWF0ZScpO1xudmFyIGlzID0gcmVxdWlyZSgnLi9pcycpO1xuXG5mdW5jdGlvbiBnZXREZWZhdWx0TmFtZShkb21haW4sIGNvZG9tYWluKSB7XG4gIHJldHVybiAne1trZXk6ICcgKyBnZXRUeXBlTmFtZShkb21haW4pICsgJ106ICcgKyBnZXRUeXBlTmFtZShjb2RvbWFpbikgKyAnfSc7XG59XG5cbmZ1bmN0aW9uIGRpY3QoZG9tYWluLCBjb2RvbWFpbiwgbmFtZSkge1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYXNzZXJ0KGlzRnVuY3Rpb24oZG9tYWluKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgZG9tYWluICcgKyBhc3NlcnQuc3RyaW5naWZ5KGRvbWFpbikgKyAnIHN1cHBsaWVkIHRvIGRpY3QoZG9tYWluLCBjb2RvbWFpbiwgW25hbWVdKSBjb21iaW5hdG9yIChleHBlY3RlZCBhIHR5cGUpJzsgfSk7XG4gICAgYXNzZXJ0KGlzRnVuY3Rpb24oY29kb21haW4pLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCBjb2RvbWFpbiAnICsgYXNzZXJ0LnN0cmluZ2lmeShjb2RvbWFpbikgKyAnIHN1cHBsaWVkIHRvIGRpY3QoZG9tYWluLCBjb2RvbWFpbiwgW25hbWVdKSBjb21iaW5hdG9yIChleHBlY3RlZCBhIHR5cGUpJzsgfSk7XG4gICAgYXNzZXJ0KGlzVHlwZU5hbWUobmFtZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50IG5hbWUgJyArIGFzc2VydC5zdHJpbmdpZnkobmFtZSkgKyAnIHN1cHBsaWVkIHRvIGRpY3QoZG9tYWluLCBjb2RvbWFpbiwgW25hbWVdKSBjb21iaW5hdG9yIChleHBlY3RlZCBhIHN0cmluZyknOyB9KTtcbiAgfVxuXG4gIHZhciBkaXNwbGF5TmFtZSA9IG5hbWUgfHwgZ2V0RGVmYXVsdE5hbWUoZG9tYWluLCBjb2RvbWFpbik7XG4gIHZhciBkb21haW5OYW1lQ2FjaGUgPSBnZXRUeXBlTmFtZShkb21haW4pO1xuICB2YXIgY29kb21haW5OYW1lQ2FjaGUgPSBnZXRUeXBlTmFtZShjb2RvbWFpbik7XG4gIHZhciBpZGVudGl0eSA9IGlzSWRlbnRpdHkoZG9tYWluKSAmJiBpc0lkZW50aXR5KGNvZG9tYWluKTtcblxuICBmdW5jdGlvbiBEaWN0KHZhbHVlLCBwYXRoKSB7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgaWYgKGlkZW50aXR5KSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTsgLy8ganVzdCB0cnVzdCB0aGUgaW5wdXQgaWYgZWxlbWVudHMgbXVzdCBub3QgYmUgaHlkcmF0ZWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgcGF0aCA9IHBhdGggfHwgW2Rpc3BsYXlOYW1lXTtcbiAgICAgIGFzc2VydChpc09iamVjdCh2YWx1ZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIHZhbHVlICcgKyBhc3NlcnQuc3RyaW5naWZ5KHZhbHVlKSArICcgc3VwcGxpZWQgdG8gJyArIHBhdGguam9pbignLycpOyB9KTtcbiAgICB9XG5cbiAgICB2YXIgaWRlbXBvdGVudCA9IHRydWU7IC8vIHdpbGwgcmVtYWluIHRydWUgaWYgSSBjYW4gcmV1dGlsaXNlIHRoZSBpbnB1dFxuICAgIHZhciByZXQgPSB7fTsgLy8gbWFrZSBhIHRlbXBvcmFyeSBjb3B5LCB3aWxsIGJlIGRpc2NhcmRlZCBpZiBpZGVtcG90ZW50IHJlbWFpbnMgdHJ1ZVxuICAgIGZvciAodmFyIGsgaW4gdmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICBrID0gY3JlYXRlKGRvbWFpbiwgaywgKCBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gcGF0aC5jb25jYXQoZG9tYWluTmFtZUNhY2hlKSA6IG51bGwgKSk7XG4gICAgICAgIHZhciBhY3R1YWwgPSB2YWx1ZVtrXTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gY3JlYXRlKGNvZG9tYWluLCBhY3R1YWwsICggcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHBhdGguY29uY2F0KGsgKyAnOiAnICsgY29kb21haW5OYW1lQ2FjaGUpIDogbnVsbCApKTtcbiAgICAgICAgaWRlbXBvdGVudCA9IGlkZW1wb3RlbnQgJiYgKCBhY3R1YWwgPT09IGluc3RhbmNlICk7XG4gICAgICAgIHJldFtrXSA9IGluc3RhbmNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpZGVtcG90ZW50KSB7IC8vIGltcGxlbWVudHMgaWRlbXBvdGVuY3lcbiAgICAgIHJldCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBPYmplY3QuZnJlZXplKHJldCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIERpY3QubWV0YSA9IHtcbiAgICBraW5kOiAnZGljdCcsXG4gICAgZG9tYWluOiBkb21haW4sXG4gICAgY29kb21haW46IGNvZG9tYWluLFxuICAgIG5hbWU6IG5hbWUsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5XG4gIH07XG5cbiAgRGljdC5kaXNwbGF5TmFtZSA9IGRpc3BsYXlOYW1lO1xuXG4gIERpY3QuaXMgPSBmdW5jdGlvbiAoeCkge1xuICAgIGlmICghaXNPYmplY3QoeCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yICh2YXIgayBpbiB4KSB7XG4gICAgICBpZiAoeC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICBpZiAoIWlzKGssIGRvbWFpbikgfHwgIWlzKHhba10sIGNvZG9tYWluKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBEaWN0LnVwZGF0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgcGF0Y2gpIHtcbiAgICByZXR1cm4gRGljdChhc3NlcnQudXBkYXRlKGluc3RhbmNlLCBwYXRjaCkpO1xuICB9O1xuXG4gIHJldHVybiBEaWN0O1xufVxuXG5kaWN0LmdldERlZmF1bHROYW1lID0gZ2V0RGVmYXVsdE5hbWU7XG5tb2R1bGUuZXhwb3J0cyA9IGRpY3Q7XG4iLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9hc3NlcnQnKTtcbnZhciBpc1R5cGVOYW1lID0gcmVxdWlyZSgnLi9pc1R5cGVOYW1lJyk7XG52YXIgZm9yYmlkTmV3T3BlcmF0b3IgPSByZXF1aXJlKCcuL2ZvcmJpZE5ld09wZXJhdG9yJyk7XG52YXIgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbmZ1bmN0aW9uIGdldERlZmF1bHROYW1lKG1hcCkge1xuICByZXR1cm4gT2JqZWN0LmtleXMobWFwKS5tYXAoZnVuY3Rpb24gKGspIHsgcmV0dXJuIGFzc2VydC5zdHJpbmdpZnkoayk7IH0pLmpvaW4oJyB8ICcpO1xufVxuXG5mdW5jdGlvbiBlbnVtcyhtYXAsIG5hbWUpIHtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGFzc2VydChpc09iamVjdChtYXApLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCBtYXAgJyArIGFzc2VydC5zdHJpbmdpZnkobWFwKSArICcgc3VwcGxpZWQgdG8gZW51bXMobWFwLCBbbmFtZV0pIGNvbWJpbmF0b3IgKGV4cGVjdGVkIGEgZGljdGlvbmFyeSBvZiBTdHJpbmcgLT4gU3RyaW5nIHwgTnVtYmVyKSc7IH0pO1xuICAgIGFzc2VydChpc1R5cGVOYW1lKG5hbWUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCBuYW1lICcgKyBhc3NlcnQuc3RyaW5naWZ5KG5hbWUpICsgJyBzdXBwbGllZCB0byBlbnVtcyhtYXAsIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYSBzdHJpbmcpJzsgfSk7XG4gIH1cblxuICB2YXIgZGlzcGxheU5hbWUgPSBuYW1lIHx8IGdldERlZmF1bHROYW1lKG1hcCk7XG5cbiAgZnVuY3Rpb24gRW51bXModmFsdWUsIHBhdGgpIHtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBmb3JiaWROZXdPcGVyYXRvcih0aGlzLCBFbnVtcyk7XG4gICAgICBwYXRoID0gcGF0aCB8fCBbZGlzcGxheU5hbWVdO1xuICAgICAgYXNzZXJ0KEVudW1zLmlzKHZhbHVlKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgdmFsdWUgJyArIGFzc2VydC5zdHJpbmdpZnkodmFsdWUpICsgJyBzdXBwbGllZCB0byAnICsgcGF0aC5qb2luKCcvJykgKyAnIChleHBlY3RlZCBvbmUgb2YgJyArIGFzc2VydC5zdHJpbmdpZnkoT2JqZWN0LmtleXMobWFwKSkgKyAnKSc7IH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIEVudW1zLm1ldGEgPSB7XG4gICAga2luZDogJ2VudW1zJyxcbiAgICBtYXA6IG1hcCxcbiAgICBuYW1lOiBuYW1lLFxuICAgIGlkZW50aXR5OiB0cnVlXG4gIH07XG5cbiAgRW51bXMuZGlzcGxheU5hbWUgPSBkaXNwbGF5TmFtZTtcblxuICBFbnVtcy5pcyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIG1hcC5oYXNPd25Qcm9wZXJ0eSh4KTtcbiAgfTtcblxuICByZXR1cm4gRW51bXM7XG59XG5cbmVudW1zLm9mID0gZnVuY3Rpb24gKGtleXMsIG5hbWUpIHtcbiAga2V5cyA9IGlzU3RyaW5nKGtleXMpID8ga2V5cy5zcGxpdCgnICcpIDoga2V5cztcbiAgdmFyIHZhbHVlID0ge307XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgIHZhbHVlW2tdID0gaztcbiAgfSk7XG4gIHJldHVybiBlbnVtcyh2YWx1ZSwgbmFtZSk7XG59O1xuXG5lbnVtcy5nZXREZWZhdWx0TmFtZSA9IGdldERlZmF1bHROYW1lO1xubW9kdWxlLmV4cG9ydHMgPSBlbnVtcztcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmYWlsKG1lc3NhZ2UpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignW3Rjb21iXSAnICsgbWVzc2FnZSk7XG59OyIsInZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIGdldFR5cGVOYW1lID0gcmVxdWlyZSgnLi9nZXRUeXBlTmFtZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvcmJpZE5ld09wZXJhdG9yKHgsIHR5cGUpIHtcbiAgYXNzZXJ0KCEoeCBpbnN0YW5jZW9mIHR5cGUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnQ2Fubm90IHVzZSB0aGUgbmV3IG9wZXJhdG9yIHRvIGluc3RhbnRpYXRlIHRoZSB0eXBlICcgKyBnZXRUeXBlTmFtZSh0eXBlKTsgfSk7XG59OyIsInZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIGlzVHlwZU5hbWUgPSByZXF1aXJlKCcuL2lzVHlwZU5hbWUnKTtcbnZhciBGdW5jdGlvblR5cGUgPSByZXF1aXJlKCcuL0Z1bmN0aW9uJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xudmFyIGxpc3QgPSByZXF1aXJlKCcuL2xpc3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL2NyZWF0ZScpO1xudmFyIGlzTmlsID0gcmVxdWlyZSgnLi9pc05pbCcpO1xudmFyIGlzQm9vbGVhbiA9IHJlcXVpcmUoJy4vaXNCb29sZWFuJyk7XG52YXIgdHVwbGUgPSByZXF1aXJlKCcuL3R1cGxlJyk7XG52YXIgZ2V0RnVuY3Rpb25OYW1lID0gcmVxdWlyZSgnLi9nZXRGdW5jdGlvbk5hbWUnKTtcbnZhciBnZXRUeXBlTmFtZSA9IHJlcXVpcmUoJy4vZ2V0VHlwZU5hbWUnKTtcblxuZnVuY3Rpb24gZ2V0RGVmYXVsdE5hbWUoZG9tYWluLCBjb2RvbWFpbikge1xuICByZXR1cm4gJygnICsgZG9tYWluLm1hcChnZXRUeXBlTmFtZSkuam9pbignLCAnKSArICcpID0+ICcgKyBnZXRUeXBlTmFtZShjb2RvbWFpbik7XG59XG5cbmZ1bmN0aW9uIGlzSW5zdHJ1bWVudGVkKGYpIHtcbiAgcmV0dXJuIEZ1bmN0aW9uVHlwZS5pcyhmKSAmJiBpc09iamVjdChmLmluc3RydW1lbnRhdGlvbik7XG59XG5cbmZ1bmN0aW9uIGZ1bmMoZG9tYWluLCBjb2RvbWFpbiwgbmFtZSkge1xuXG4gIGRvbWFpbiA9IGlzQXJyYXkoZG9tYWluKSA/IGRvbWFpbiA6IFtkb21haW5dOyAvLyBoYW5kbGUgaGFuZHkgc3ludGF4IGZvciB1bmFyeSBmdW5jdGlvbnNcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGFzc2VydChsaXN0KEZ1bmN0aW9uVHlwZSkuaXMoZG9tYWluKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgZG9tYWluICcgKyBhc3NlcnQuc3RyaW5naWZ5KGRvbWFpbikgKyAnIHN1cHBsaWVkIHRvIGZ1bmMoZG9tYWluLCBjb2RvbWFpbiwgW25hbWVdKSBjb21iaW5hdG9yIChleHBlY3RlZCBhbiBhcnJheSBvZiB0eXBlcyknOyB9KTtcbiAgICBhc3NlcnQoRnVuY3Rpb25UeXBlLmlzKGNvZG9tYWluKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgY29kb21haW4gJyArIGFzc2VydC5zdHJpbmdpZnkoY29kb21haW4pICsgJyBzdXBwbGllZCB0byBmdW5jKGRvbWFpbiwgY29kb21haW4sIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYSB0eXBlKSc7IH0pO1xuICAgIGFzc2VydChpc1R5cGVOYW1lKG5hbWUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCBuYW1lICcgKyBhc3NlcnQuc3RyaW5naWZ5KG5hbWUpICsgJyBzdXBwbGllZCB0byBmdW5jKGRvbWFpbiwgY29kb21haW4sIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYSBzdHJpbmcpJzsgfSk7XG4gIH1cblxuICB2YXIgZGlzcGxheU5hbWUgPSBuYW1lIHx8IGdldERlZmF1bHROYW1lKGRvbWFpbiwgY29kb21haW4pO1xuXG4gIGZ1bmN0aW9uIEZ1bmNUeXBlKHZhbHVlLCBjdXJyaWVkKSB7XG5cbiAgICBpZiAoIWlzSW5zdHJ1bWVudGVkKHZhbHVlKSkgeyAvLyBhdXRvbWF0aWNhbGx5IGluc3RydW1lbnQgdGhlIGZ1bmN0aW9uXG4gICAgICByZXR1cm4gRnVuY1R5cGUub2YodmFsdWUsIGN1cnJpZWQpO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBhc3NlcnQoRnVuY1R5cGUuaXModmFsdWUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCB2YWx1ZSAnICsgYXNzZXJ0LnN0cmluZ2lmeSh2YWx1ZSkgKyAnIHN1cHBsaWVkIHRvICcgKyBkaXNwbGF5TmFtZTsgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgRnVuY1R5cGUubWV0YSA9IHtcbiAgICBraW5kOiAnZnVuYycsXG4gICAgZG9tYWluOiBkb21haW4sXG4gICAgY29kb21haW46IGNvZG9tYWluLFxuICAgIG5hbWU6IG5hbWUsXG4gICAgaWRlbnRpdHk6IHRydWVcbiAgfTtcblxuICBGdW5jVHlwZS5kaXNwbGF5TmFtZSA9IGRpc3BsYXlOYW1lO1xuXG4gIEZ1bmNUeXBlLmlzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gaXNJbnN0cnVtZW50ZWQoeCkgJiZcbiAgICAgIHguaW5zdHJ1bWVudGF0aW9uLmRvbWFpbi5sZW5ndGggPT09IGRvbWFpbi5sZW5ndGggJiZcbiAgICAgIHguaW5zdHJ1bWVudGF0aW9uLmRvbWFpbi5ldmVyeShmdW5jdGlvbiAodHlwZSwgaSkge1xuICAgICAgICByZXR1cm4gdHlwZSA9PT0gZG9tYWluW2ldO1xuICAgICAgfSkgJiZcbiAgICAgIHguaW5zdHJ1bWVudGF0aW9uLmNvZG9tYWluID09PSBjb2RvbWFpbjtcbiAgfTtcblxuICBGdW5jVHlwZS5vZiA9IGZ1bmN0aW9uIChmLCBjdXJyaWVkKSB7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgYXNzZXJ0KEZ1bmN0aW9uVHlwZS5pcyhmKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgZiBzdXBwbGllZCB0byBmdW5jLm9mICcgKyBkaXNwbGF5TmFtZSArICcgKGV4cGVjdGVkIGEgZnVuY3Rpb24pJzsgfSk7XG4gICAgICBhc3NlcnQoaXNOaWwoY3VycmllZCkgfHwgaXNCb29sZWFuKGN1cnJpZWQpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCBjdXJyaWVkICcgKyBhc3NlcnQuc3RyaW5naWZ5KGN1cnJpZWQpICsgJyBzdXBwbGllZCB0byBmdW5jLm9mICcgKyBkaXNwbGF5TmFtZSArICcgKGV4cGVjdGVkIGEgYm9vbGVhbiknOyB9KTtcbiAgICB9XG5cbiAgICBpZiAoRnVuY1R5cGUuaXMoZikpIHsgLy8gbWFrZXMgRnVuY1R5cGUub2YgaWRlbXBvdGVudFxuICAgICAgcmV0dXJuIGY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm4oKSB7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgbGVuID0gY3VycmllZCA/XG4gICAgICAgIGFyZ3MubGVuZ3RoIDpcbiAgICAgICAgZG9tYWluLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzVHlwZSA9IHR1cGxlKGRvbWFpbi5zbGljZSgwLCBsZW4pKTtcblxuICAgICAgYXJncyA9IGFyZ3NUeXBlKGFyZ3MpOyAvLyB0eXBlIGNoZWNrIGFyZ3VtZW50c1xuXG4gICAgICBpZiAobGVuID09PSBkb21haW4ubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGUoY29kb21haW4sIGYuYXBwbHkodGhpcywgYXJncykpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBnID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoZiwgW3RoaXNdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIHZhciBuZXdkb21haW4gPSBmdW5jKGRvbWFpbi5zbGljZShsZW4pLCBjb2RvbWFpbik7XG4gICAgICAgIHJldHVybiBuZXdkb21haW4ub2YoZywgY3VycmllZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm4uaW5zdHJ1bWVudGF0aW9uID0ge1xuICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICBjb2RvbWFpbjogY29kb21haW4sXG4gICAgICBmOiBmXG4gICAgfTtcblxuICAgIGZuLmRpc3BsYXlOYW1lID0gZ2V0RnVuY3Rpb25OYW1lKGYpO1xuXG4gICAgcmV0dXJuIGZuO1xuXG4gIH07XG5cbiAgcmV0dXJuIEZ1bmNUeXBlO1xuXG59XG5cbmZ1bmMuZ2V0RGVmYXVsdE5hbWUgPSBnZXREZWZhdWx0TmFtZTtcbm1vZHVsZS5leHBvcnRzID0gZnVuYztcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RnVuY3Rpb25OYW1lKGYpIHtcbiAgcmV0dXJuIGYuZGlzcGxheU5hbWUgfHwgZi5uYW1lIHx8ICc8ZnVuY3Rpb24nICsgZi5sZW5ndGggKyAnPic7XG59OyIsInZhciBpc1R5cGUgPSByZXF1aXJlKCcuL2lzVHlwZScpO1xudmFyIGdldEZ1bmN0aW9uTmFtZSA9IHJlcXVpcmUoJy4vZ2V0RnVuY3Rpb25OYW1lJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VHlwZU5hbWUoY29uc3RydWN0b3IpIHtcbiAgaWYgKGlzVHlwZShjb25zdHJ1Y3RvcikpIHtcbiAgICByZXR1cm4gY29uc3RydWN0b3IuZGlzcGxheU5hbWU7XG4gIH1cbiAgcmV0dXJuIGdldEZ1bmN0aW9uTmFtZShjb25zdHJ1Y3Rvcik7XG59OyIsInZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIGlzVHlwZU5hbWUgPSByZXF1aXJlKCcuL2lzVHlwZU5hbWUnKTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xudmFyIGZvcmJpZE5ld09wZXJhdG9yID0gcmVxdWlyZSgnLi9pc0lkZW50aXR5Jyk7XG52YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG52YXIgZ2V0VHlwZU5hbWUgPSByZXF1aXJlKCcuL2dldFR5cGVOYW1lJyk7XG5cbmZ1bmN0aW9uIGdldERlZmF1bHROYW1lKHR5cGVzKSB7XG4gIHJldHVybiB0eXBlcy5tYXAoZ2V0VHlwZU5hbWUpLmpvaW4oJyAmICcpO1xufVxuXG5mdW5jdGlvbiBpbnRlcnNlY3Rpb24odHlwZXMsIG5hbWUpIHtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGFzc2VydChpc0FycmF5KHR5cGVzKSAmJiB0eXBlcy5ldmVyeShpc0Z1bmN0aW9uKSAmJiB0eXBlcy5sZW5ndGggPj0gMiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgdHlwZXMgJyArIGFzc2VydC5zdHJpbmdpZnkodHlwZXMpICsgJyBzdXBwbGllZCB0byBpbnRlcnNlY3Rpb24odHlwZXMsIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYW4gYXJyYXkgb2YgYXQgbGVhc3QgMiB0eXBlcyknOyB9KTtcbiAgICBhc3NlcnQoaXNUeXBlTmFtZShuYW1lKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgbmFtZSAnICsgYXNzZXJ0LnN0cmluZ2lmeShuYW1lKSArICcgc3VwcGxpZWQgdG8gaW50ZXJzZWN0aW9uKHR5cGVzLCBbbmFtZV0pIGNvbWJpbmF0b3IgKGV4cGVjdGVkIGEgc3RyaW5nKSc7IH0pO1xuICB9XG5cbiAgdmFyIGRpc3BsYXlOYW1lID0gbmFtZSB8fCBnZXREZWZhdWx0TmFtZSh0eXBlcyk7XG5cbiAgZnVuY3Rpb24gSW50ZXJzZWN0aW9uKHZhbHVlLCBwYXRoKSB7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgZm9yYmlkTmV3T3BlcmF0b3IodGhpcywgSW50ZXJzZWN0aW9uKTtcbiAgICAgIHBhdGggPSBwYXRoIHx8IFtkaXNwbGF5TmFtZV07XG4gICAgICBhc3NlcnQoSW50ZXJzZWN0aW9uLmlzKHZhbHVlKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgdmFsdWUgJyArIGFzc2VydC5zdHJpbmdpZnkodmFsdWUpICsgJyBzdXBwbGllZCB0byAnICsgcGF0aC5qb2luKCcvJyk7IH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIEludGVyc2VjdGlvbi5tZXRhID0ge1xuICAgIGtpbmQ6ICdpbnRlcnNlY3Rpb24nLFxuICAgIHR5cGVzOiB0eXBlcyxcbiAgICBuYW1lOiBuYW1lLFxuICAgIGlkZW50aXR5OiB0cnVlXG4gIH07XG5cbiAgSW50ZXJzZWN0aW9uLmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWU7XG5cbiAgSW50ZXJzZWN0aW9uLmlzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gdHlwZXMuZXZlcnkoZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIHJldHVybiBpcyh4LCB0eXBlKTtcbiAgICB9KTtcbiAgfTtcblxuICBJbnRlcnNlY3Rpb24udXBkYXRlID0gZnVuY3Rpb24gKGluc3RhbmNlLCBwYXRjaCkge1xuICAgIHJldHVybiBJbnRlcnNlY3Rpb24oYXNzZXJ0LnVwZGF0ZShpbnN0YW5jZSwgcGF0Y2gpKTtcbiAgfTtcblxuICByZXR1cm4gSW50ZXJzZWN0aW9uO1xufVxuXG5pbnRlcnNlY3Rpb24uZ2V0RGVmYXVsdE5hbWUgPSBnZXREZWZhdWx0TmFtZTtcbm1vZHVsZS5leHBvcnRzID0gaW50ZXJzZWN0aW9uO1xuXG4iLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9hc3NlcnQnKTtcbnZhciBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyk7XG52YXIgZm9yYmlkTmV3T3BlcmF0b3IgPSByZXF1aXJlKCcuL2ZvcmJpZE5ld09wZXJhdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXJyZWR1Y2libGUobmFtZSwgcHJlZGljYXRlKSB7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBhc3NlcnQoaXNTdHJpbmcobmFtZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50IG5hbWUgJyArIGFzc2VydC5zdHJpbmdpZnkobmFtZSkgKyAnIHN1cHBsaWVkIHRvIGlycmVkdWNpYmxlKG5hbWUsIHByZWRpY2F0ZSkgKGV4cGVjdGVkIGEgc3RyaW5nKSc7IH0pO1xuICAgIGFzc2VydChpc0Z1bmN0aW9uKHByZWRpY2F0ZSksICdJbnZhbGlkIGFyZ3VtZW50IHByZWRpY2F0ZSAnICsgYXNzZXJ0LnN0cmluZ2lmeShwcmVkaWNhdGUpICsgJyBzdXBwbGllZCB0byBpcnJlZHVjaWJsZShuYW1lLCBwcmVkaWNhdGUpIChleHBlY3RlZCBhIGZ1bmN0aW9uKScpO1xuICB9XG5cbiAgZnVuY3Rpb24gSXJyZWR1Y2libGUodmFsdWUsIHBhdGgpIHtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBmb3JiaWROZXdPcGVyYXRvcih0aGlzLCBJcnJlZHVjaWJsZSk7XG4gICAgICBwYXRoID0gcGF0aCB8fCBbbmFtZV07XG4gICAgICBhc3NlcnQocHJlZGljYXRlKHZhbHVlKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgdmFsdWUgJyArIGFzc2VydC5zdHJpbmdpZnkodmFsdWUpICsgJyBzdXBwbGllZCB0byAnICsgcGF0aC5qb2luKCcvJyk7IH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIElycmVkdWNpYmxlLm1ldGEgPSB7XG4gICAga2luZDogJ2lycmVkdWNpYmxlJyxcbiAgICBuYW1lOiBuYW1lLFxuICAgIHByZWRpY2F0ZTogcHJlZGljYXRlLFxuICAgIGlkZW50aXR5OiB0cnVlXG4gIH07XG5cbiAgSXJyZWR1Y2libGUuZGlzcGxheU5hbWUgPSBuYW1lO1xuXG4gIElycmVkdWNpYmxlLmlzID0gcHJlZGljYXRlO1xuXG4gIHJldHVybiBJcnJlZHVjaWJsZTtcbn07XG4iLCJ2YXIgaXNUeXBlID0gcmVxdWlyZSgnLi9pc1R5cGUnKTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIHggaXMgYW4gaW5zdGFuY2Ugb2YgdHlwZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpcyh4LCB0eXBlKSB7XG4gIGlmIChpc1R5cGUodHlwZSkpIHtcbiAgICByZXR1cm4gdHlwZS5pcyh4KTtcbiAgfVxuICByZXR1cm4geCBpbnN0YW5jZW9mIHR5cGU7IC8vIHR5cGUgc2hvdWxkIGJlIGEgY2xhc3MgY29uc3RydWN0b3Jcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJyYXkoeCkge1xuICByZXR1cm4geCBpbnN0YW5jZW9mIEFycmF5O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQm9vbGVhbih4KSB7XG4gIHJldHVybiB4ID09PSB0cnVlIHx8IHggPT09IGZhbHNlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59OyIsInZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIEJvb2xlYW4gPSByZXF1aXJlKCcuL0Jvb2xlYW4nKTtcbnZhciBpc1R5cGUgPSByZXF1aXJlKCcuL2lzVHlwZScpO1xudmFyIGdldFR5cGVOYW1lID0gcmVxdWlyZSgnLi9nZXRUeXBlTmFtZScpO1xuXG4vLyByZXR1cm4gdHJ1ZSBpZiB0aGUgdHlwZSBjb25zdHJ1Y3RvciBiZWhhdmVzIGxpa2UgdGhlIGlkZW50aXR5IGZ1bmN0aW9uXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzSWRlbnRpdHkodHlwZSkge1xuICBpZiAoaXNUeXBlKHR5cGUpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGFzc2VydChCb29sZWFuLmlzKHR5cGUubWV0YS5pZGVudGl0eSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIG1ldGEgaWRlbnRpdHkgJyArIGFzc2VydC5zdHJpbmdpZnkodHlwZS5tZXRhLmlkZW50aXR5KSArICcgc3VwcGxpZWQgdG8gdHlwZSAnICsgZ2V0VHlwZU5hbWUodHlwZSk7IH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZS5tZXRhLmlkZW50aXR5O1xuICB9XG4gIC8vIGZvciB0Y29tYiB0aGUgb3RoZXIgY29uc3RydWN0b3JzLCBsaWtlIEVTNiBjbGFzc2VzLCBhcmUgaWRlbnRpdHktbGlrZVxuICByZXR1cm4gdHJ1ZTtcbn07IiwidmFyIGlzVHlwZSA9IHJlcXVpcmUoJy4vaXNUeXBlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNNYXliZSh4KSB7XG4gIHJldHVybiBpc1R5cGUoeCkgJiYgKCB4Lm1ldGEua2luZCA9PT0gJ21heWJlJyApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTmlsKHgpIHtcbiAgcmV0dXJuIHggPT09IG51bGwgfHwgeCA9PT0gdm9pZCAwO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTnVtYmVyKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh4KSAmJiAhaXNOYU4oeCk7XG59OyIsInZhciBpc05pbCA9IHJlcXVpcmUoJy4vaXNOaWwnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3QoeCkge1xuICByZXR1cm4gIWlzTmlsKHgpICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiAhaXNBcnJheSh4KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N0cmluZyh4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ3N0cmluZyc7XG59OyIsInZhciBpc1R5cGUgPSByZXF1aXJlKCcuL2lzVHlwZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU3RydWN0KHgpIHtcbiAgcmV0dXJuIGlzVHlwZSh4KSAmJiAoIHgubWV0YS5raW5kID09PSAnc3RydWN0JyApO1xufTsiLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzVHlwZSh4KSB7XG4gIHJldHVybiBpc0Z1bmN0aW9uKHgpICYmIGlzT2JqZWN0KHgubWV0YSk7XG59OyIsInZhciBpc05pbCA9IHJlcXVpcmUoJy4vaXNOaWwnKTtcbnZhciBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1R5cGVOYW1lKG5hbWUpIHtcbiAgcmV0dXJuIGlzTmlsKG5hbWUpIHx8IGlzU3RyaW5nKG5hbWUpO1xufTsiLCJ2YXIgaXNUeXBlID0gcmVxdWlyZSgnLi9pc1R5cGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1VuaW9uKHgpIHtcbiAgcmV0dXJuIGlzVHlwZSh4KSAmJiAoIHgubWV0YS5raW5kID09PSAndW5pb24nICk7XG59OyIsInZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIGlzVHlwZU5hbWUgPSByZXF1aXJlKCcuL2lzVHlwZU5hbWUnKTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyk7XG52YXIgZ2V0VHlwZU5hbWUgPSByZXF1aXJlKCcuL2dldFR5cGVOYW1lJyk7XG52YXIgaXNJZGVudGl0eSA9IHJlcXVpcmUoJy4vaXNJZGVudGl0eScpO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vY3JlYXRlJyk7XG52YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG5mdW5jdGlvbiBnZXREZWZhdWx0TmFtZSh0eXBlKSB7XG4gIHJldHVybiAnQXJyYXk8JyArIGdldFR5cGVOYW1lKHR5cGUpICsgJz4nO1xufVxuXG5mdW5jdGlvbiBsaXN0KHR5cGUsIG5hbWUpIHtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGFzc2VydChpc0Z1bmN0aW9uKHR5cGUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCB0eXBlICcgKyBhc3NlcnQuc3RyaW5naWZ5KHR5cGUpICsgJyBzdXBwbGllZCB0byBsaXN0KHR5cGUsIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYSB0eXBlKSc7IH0pO1xuICAgIGFzc2VydChpc1R5cGVOYW1lKG5hbWUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCBuYW1lICcgKyBhc3NlcnQuc3RyaW5naWZ5KG5hbWUpICsgJyBzdXBwbGllZCB0byBsaXN0KHR5cGUsIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYSBzdHJpbmcpJzsgfSk7XG4gIH1cblxuICB2YXIgZGlzcGxheU5hbWUgPSBuYW1lIHx8IGdldERlZmF1bHROYW1lKHR5cGUpO1xuICB2YXIgdHlwZU5hbWVDYWNoZSA9IGdldFR5cGVOYW1lKHR5cGUpO1xuICB2YXIgaWRlbnRpdHkgPSBpc0lkZW50aXR5KHR5cGUpOyAvLyB0aGUgbGlzdCBpcyBpZGVudGl0eSBpaWYgdHlwZSBpcyBpZGVudGl0eVxuXG4gIGZ1bmN0aW9uIExpc3QodmFsdWUsIHBhdGgpIHtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAoaWRlbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlOyAvLyBqdXN0IHRydXN0IHRoZSBpbnB1dCBpZiBlbGVtZW50cyBtdXN0IG5vdCBiZSBoeWRyYXRlZFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBwYXRoID0gcGF0aCB8fCBbZGlzcGxheU5hbWVdO1xuICAgICAgYXNzZXJ0KGlzQXJyYXkodmFsdWUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCB2YWx1ZSAnICsgYXNzZXJ0LnN0cmluZ2lmeSh2YWx1ZSkgKyAnIHN1cHBsaWVkIHRvICcgKyBwYXRoLmpvaW4oJy8nKSArICcgKGV4cGVjdGVkIGFuIGFycmF5IG9mICcgKyB0eXBlTmFtZUNhY2hlICsgJyknOyB9KTtcbiAgICB9XG5cbiAgICB2YXIgaWRlbXBvdGVudCA9IHRydWU7IC8vIHdpbGwgcmVtYWluIHRydWUgaWYgSSBjYW4gcmV1dGlsaXNlIHRoZSBpbnB1dFxuICAgIHZhciByZXQgPSBbXTsgLy8gbWFrZSBhIHRlbXBvcmFyeSBjb3B5LCB3aWxsIGJlIGRpc2NhcmRlZCBpZiBpZGVtcG90ZW50IHJlbWFpbnMgdHJ1ZVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICAgIHZhciBhY3R1YWwgPSB2YWx1ZVtpXTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IGNyZWF0ZSh0eXBlLCBhY3R1YWwsICggcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHBhdGguY29uY2F0KGkgKyAnOiAnICsgdHlwZU5hbWVDYWNoZSkgOiBudWxsICkpO1xuICAgICAgaWRlbXBvdGVudCA9IGlkZW1wb3RlbnQgJiYgKCBhY3R1YWwgPT09IGluc3RhbmNlICk7XG4gICAgICByZXQucHVzaChpbnN0YW5jZSk7XG4gICAgfVxuXG4gICAgaWYgKGlkZW1wb3RlbnQpIHsgLy8gaW1wbGVtZW50cyBpZGVtcG90ZW5jeVxuICAgICAgcmV0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIE9iamVjdC5mcmVlemUocmV0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgTGlzdC5tZXRhID0ge1xuICAgIGtpbmQ6ICdsaXN0JyxcbiAgICB0eXBlOiB0eXBlLFxuICAgIG5hbWU6IG5hbWUsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5XG4gIH07XG5cbiAgTGlzdC5kaXNwbGF5TmFtZSA9IGRpc3BsYXlOYW1lO1xuXG4gIExpc3QuaXMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBpc0FycmF5KHgpICYmIHguZXZlcnkoZnVuY3Rpb24gKGUpIHtcbiAgICAgIHJldHVybiBpcyhlLCB0eXBlKTtcbiAgICB9KTtcbiAgfTtcblxuICBMaXN0LnVwZGF0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgcGF0Y2gpIHtcbiAgICByZXR1cm4gTGlzdChhc3NlcnQudXBkYXRlKGluc3RhbmNlLCBwYXRjaCkpO1xuICB9O1xuXG4gIHJldHVybiBMaXN0O1xufVxuXG5saXN0LmdldERlZmF1bHROYW1lID0gZ2V0RGVmYXVsdE5hbWU7XG5tb2R1bGUuZXhwb3J0cyA9IGxpc3Q7XG4iLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9hc3NlcnQnKTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyk7XG52YXIgaXNUeXBlID0gcmVxdWlyZSgnLi9pc1R5cGUnKTtcbnZhciBBbnkgPSByZXF1aXJlKCcuL0FueScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hdGNoKHgpIHtcbiAgdmFyIHR5cGUsIGd1YXJkLCBmLCBjb3VudDtcbiAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW47ICkge1xuICAgIHR5cGUgPSBhcmd1bWVudHNbaV07XG4gICAgZ3VhcmQgPSBhcmd1bWVudHNbaSArIDFdO1xuICAgIGYgPSBhcmd1bWVudHNbaSArIDJdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZikgJiYgIWlzVHlwZShmKSkge1xuICAgICAgaSA9IGkgKyAzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGYgPSBndWFyZDtcbiAgICAgIGd1YXJkID0gQW55LmlzO1xuICAgICAgaSA9IGkgKyAyO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBjb3VudCA9IChjb3VudCB8fCAwKSArIDE7XG4gICAgICBhc3NlcnQoaXNUeXBlKHR5cGUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCB0eXBlIGluIGNsYXVzZSAjJyArIGNvdW50OyB9KTtcbiAgICAgIGFzc2VydChpc0Z1bmN0aW9uKGd1YXJkKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgZ3VhcmQgaW4gY2xhdXNlICMnICsgY291bnQ7IH0pO1xuICAgICAgYXNzZXJ0KGlzRnVuY3Rpb24oZiksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGJsb2NrIGluIGNsYXVzZSAjJyArIGNvdW50OyB9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZS5pcyh4KSAmJiBndWFyZCh4KSkge1xuICAgICAgcmV0dXJuIGYoeCk7XG4gICAgfVxuICB9XG4gIGFzc2VydC5mYWlsKCdNYXRjaCBlcnJvcicpO1xufTtcbiIsInZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIGlzVHlwZU5hbWUgPSByZXF1aXJlKCcuL2lzVHlwZU5hbWUnKTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyk7XG52YXIgaXNNYXliZSA9IHJlcXVpcmUoJy4vaXNNYXliZScpO1xudmFyIGlzSWRlbnRpdHkgPSByZXF1aXJlKCcuL2lzSWRlbnRpdHknKTtcbnZhciBBbnkgPSByZXF1aXJlKCcuL0FueScpO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vY3JlYXRlJyk7XG52YXIgTmlsID0gcmVxdWlyZSgnLi9OaWwnKTtcbnZhciBmb3JiaWROZXdPcGVyYXRvciA9IHJlcXVpcmUoJy4vZm9yYmlkTmV3T3BlcmF0b3InKTtcbnZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcbnZhciBnZXRUeXBlTmFtZSA9IHJlcXVpcmUoJy4vZ2V0VHlwZU5hbWUnKTtcblxuZnVuY3Rpb24gZ2V0RGVmYXVsdE5hbWUodHlwZSkge1xuICByZXR1cm4gJz8nICsgZ2V0VHlwZU5hbWUodHlwZSk7XG59XG5cbmZ1bmN0aW9uIG1heWJlKHR5cGUsIG5hbWUpIHtcblxuICBpZiAoaXNNYXliZSh0eXBlKSB8fCB0eXBlID09PSBBbnkgfHwgdHlwZSA9PT0gTmlsKSB7IC8vIG1ha2VzIHRoZSBjb21iaW5hdG9yIGlkZW1wb3RlbnQgYW5kIGhhbmRsZSBBbnksIE5pbFxuICAgIHJldHVybiB0eXBlO1xuICB9XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBhc3NlcnQoaXNGdW5jdGlvbih0eXBlKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgdHlwZSAnICsgYXNzZXJ0LnN0cmluZ2lmeSh0eXBlKSArICcgc3VwcGxpZWQgdG8gbWF5YmUodHlwZSwgW25hbWVdKSBjb21iaW5hdG9yIChleHBlY3RlZCBhIHR5cGUpJzsgfSk7XG4gICAgYXNzZXJ0KGlzVHlwZU5hbWUobmFtZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50IG5hbWUgJyArIGFzc2VydC5zdHJpbmdpZnkobmFtZSkgKyAnIHN1cHBsaWVkIHRvIG1heWJlKHR5cGUsIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYSBzdHJpbmcpJzsgfSk7XG4gIH1cblxuICB2YXIgZGlzcGxheU5hbWUgPSBuYW1lIHx8IGdldERlZmF1bHROYW1lKHR5cGUpO1xuXG4gIGZ1bmN0aW9uIE1heWJlKHZhbHVlLCBwYXRoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGZvcmJpZE5ld09wZXJhdG9yKHRoaXMsIE1heWJlKTtcbiAgICB9XG4gICAgcmV0dXJuIE5pbC5pcyh2YWx1ZSkgPyB2YWx1ZSA6IGNyZWF0ZSh0eXBlLCB2YWx1ZSwgcGF0aCk7XG4gIH1cblxuICBNYXliZS5tZXRhID0ge1xuICAgIGtpbmQ6ICdtYXliZScsXG4gICAgdHlwZTogdHlwZSxcbiAgICBuYW1lOiBuYW1lLFxuICAgIGlkZW50aXR5OiBpc0lkZW50aXR5KHR5cGUpXG4gIH07XG5cbiAgTWF5YmUuZGlzcGxheU5hbWUgPSBkaXNwbGF5TmFtZTtcblxuICBNYXliZS5pcyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE5pbC5pcyh4KSB8fCBpcyh4LCB0eXBlKTtcbiAgfTtcblxuICByZXR1cm4gTWF5YmU7XG59XG5cbm1heWJlLmdldERlZmF1bHROYW1lID0gZ2V0RGVmYXVsdE5hbWU7XG5tb2R1bGUuZXhwb3J0cyA9IG1heWJlO1xuIiwidmFyIGlzTmlsID0gcmVxdWlyZSgnLi9pc05pbCcpO1xudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vYXNzZXJ0Jyk7XG5cbi8vIHNhZmUgbWl4aW4sIGNhbm5vdCBvdmVycmlkZSBwcm9wcyB1bmxlc3Mgc3BlY2lmaWVkXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlLCBvdmVyd3JpdGUpIHtcbiAgaWYgKGlzTmlsKHNvdXJjZSkpIHsgcmV0dXJuIHRhcmdldDsgfVxuICBmb3IgKHZhciBrIGluIHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgIGlmIChvdmVyd3JpdGUgIT09IHRydWUpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICBhc3NlcnQoIXRhcmdldC5oYXNPd25Qcm9wZXJ0eShrKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgY2FsbCB0byBtaXhpbih0YXJnZXQsIHNvdXJjZSwgW292ZXJ3cml0ZV0pOiBjYW5ub3Qgb3ZlcndyaXRlIHByb3BlcnR5IFwiJyArIGsgKyAnXCIgb2YgdGFyZ2V0IG9iamVjdCc7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0YXJnZXRba10gPSBzb3VyY2Vba107XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59OyIsInZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2Fzc2VydCcpO1xudmFyIGlzVHlwZU5hbWUgPSByZXF1aXJlKCcuL2lzVHlwZU5hbWUnKTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyk7XG52YXIgZm9yYmlkTmV3T3BlcmF0b3IgPSByZXF1aXJlKCcuL2ZvcmJpZE5ld09wZXJhdG9yJyk7XG52YXIgaXNJZGVudGl0eSA9IHJlcXVpcmUoJy4vaXNJZGVudGl0eScpO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vY3JlYXRlJyk7XG52YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG52YXIgZ2V0VHlwZU5hbWUgPSByZXF1aXJlKCcuL2dldFR5cGVOYW1lJyk7XG52YXIgZ2V0RnVuY3Rpb25OYW1lID0gcmVxdWlyZSgnLi9nZXRGdW5jdGlvbk5hbWUnKTtcblxuZnVuY3Rpb24gZ2V0RGVmYXVsdE5hbWUodHlwZSwgcHJlZGljYXRlKSB7XG4gIHJldHVybiAneycgKyBnZXRUeXBlTmFtZSh0eXBlKSArICcgfCAnICsgZ2V0RnVuY3Rpb25OYW1lKHByZWRpY2F0ZSkgKyAnfSc7XG59XG5cbmZ1bmN0aW9uIHJlZmluZW1lbnQodHlwZSwgcHJlZGljYXRlLCBuYW1lKSB7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBhc3NlcnQoaXNGdW5jdGlvbih0eXBlKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgdHlwZSAnICsgYXNzZXJ0LnN0cmluZ2lmeSh0eXBlKSArICcgc3VwcGxpZWQgdG8gcmVmaW5lbWVudCh0eXBlLCBwcmVkaWNhdGUsIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYSB0eXBlKSc7IH0pO1xuICAgIGFzc2VydChpc0Z1bmN0aW9uKHByZWRpY2F0ZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50IHByZWRpY2F0ZSBzdXBwbGllZCB0byByZWZpbmVtZW50KHR5cGUsIHByZWRpY2F0ZSwgW25hbWVdKSBjb21iaW5hdG9yIChleHBlY3RlZCBhIGZ1bmN0aW9uKSc7IH0pO1xuICAgIGFzc2VydChpc1R5cGVOYW1lKG5hbWUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCBuYW1lICcgKyBhc3NlcnQuc3RyaW5naWZ5KG5hbWUpICsgJyBzdXBwbGllZCB0byByZWZpbmVtZW50KHR5cGUsIHByZWRpY2F0ZSwgW25hbWVdKSBjb21iaW5hdG9yIChleHBlY3RlZCBhIHN0cmluZyknOyB9KTtcbiAgfVxuXG4gIHZhciBkaXNwbGF5TmFtZSA9IG5hbWUgfHwgZ2V0RGVmYXVsdE5hbWUodHlwZSwgcHJlZGljYXRlKTtcbiAgdmFyIGlkZW50aXR5ID0gaXNJZGVudGl0eSh0eXBlKTtcblxuICBmdW5jdGlvbiBSZWZpbmVtZW50KHZhbHVlLCBwYXRoKSB7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgZm9yYmlkTmV3T3BlcmF0b3IodGhpcywgUmVmaW5lbWVudCk7XG4gICAgICBwYXRoID0gcGF0aCB8fCBbZGlzcGxheU5hbWVdO1xuICAgIH1cblxuICAgIHZhciB4ID0gY3JlYXRlKHR5cGUsIHZhbHVlLCBwYXRoKTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBhc3NlcnQocHJlZGljYXRlKHgpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCB2YWx1ZSAnICsgYXNzZXJ0LnN0cmluZ2lmeSh2YWx1ZSkgKyAnIHN1cHBsaWVkIHRvICcgKyBwYXRoLmpvaW4oJy8nKTsgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICBSZWZpbmVtZW50Lm1ldGEgPSB7XG4gICAga2luZDogJ3N1YnR5cGUnLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgcHJlZGljYXRlOiBwcmVkaWNhdGUsXG4gICAgbmFtZTogbmFtZSxcbiAgICBpZGVudGl0eTogaWRlbnRpdHlcbiAgfTtcblxuICBSZWZpbmVtZW50LmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWU7XG5cbiAgUmVmaW5lbWVudC5pcyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIGlzKHgsIHR5cGUpICYmIHByZWRpY2F0ZSh4KTtcbiAgfTtcblxuICBSZWZpbmVtZW50LnVwZGF0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgcGF0Y2gpIHtcbiAgICByZXR1cm4gUmVmaW5lbWVudChhc3NlcnQudXBkYXRlKGluc3RhbmNlLCBwYXRjaCkpO1xuICB9O1xuXG4gIHJldHVybiBSZWZpbmVtZW50O1xufVxuXG5yZWZpbmVtZW50LmdldERlZmF1bHROYW1lID0gZ2V0RGVmYXVsdE5hbWU7XG5tb2R1bGUuZXhwb3J0cyA9IHJlZmluZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmluZ2lmeSh4KSB7XG4gIHRyeSB7IC8vIGhhbmRsZSBcIkNvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT05cIiBlcnJvclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh4LCBudWxsLCAyKTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIHJldHVybiBTdHJpbmcoeCk7XG4gIH1cbn07IiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vYXNzZXJ0Jyk7XG52YXIgaXNUeXBlTmFtZSA9IHJlcXVpcmUoJy4vaXNUeXBlTmFtZScpO1xudmFyIFN0cmluZyA9IHJlcXVpcmUoJy4vU3RyaW5nJyk7XG52YXIgRnVuY3Rpb24gPSByZXF1aXJlKCcuL0Z1bmN0aW9uJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vY3JlYXRlJyk7XG52YXIgbWl4aW4gPSByZXF1aXJlKCcuL21peGluJyk7XG52YXIgaXNTdHJ1Y3QgPSByZXF1aXJlKCcuL2lzU3RydWN0Jyk7XG52YXIgZ2V0VHlwZU5hbWUgPSByZXF1aXJlKCcuL2dldFR5cGVOYW1lJyk7XG52YXIgZGljdCA9IHJlcXVpcmUoJy4vZGljdCcpO1xuXG5mdW5jdGlvbiBnZXREZWZhdWx0TmFtZShwcm9wcykge1xuICByZXR1cm4gJ3snICsgT2JqZWN0LmtleXMocHJvcHMpLm1hcChmdW5jdGlvbiAocHJvcCkge1xuICAgIHJldHVybiBwcm9wICsgJzogJyArIGdldFR5cGVOYW1lKHByb3BzW3Byb3BdKTtcbiAgfSkuam9pbignLCAnKSArICd9Jztcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG1peGlucywgbmFtZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGFzc2VydChpc0FycmF5KG1peGlucykgJiYgbWl4aW5zLmV2ZXJ5KGZ1bmN0aW9uICh4KSB7XG4gICAgICByZXR1cm4gaXNPYmplY3QoeCkgfHwgaXNTdHJ1Y3QoeCk7XG4gICAgfSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50IG1peGlucyBzdXBwbGllZCB0byBleHRlbmQobWl4aW5zLCBuYW1lKSwgZXhwZWN0ZWQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvciBzdHJ1Y3RzJzsgfSk7XG4gIH1cbiAgdmFyIHByb3BzID0ge307XG4gIHZhciBwcm90b3R5cGUgPSB7fTtcbiAgbWl4aW5zLmZvckVhY2goZnVuY3Rpb24gKHN0cnVjdCkge1xuICAgIGlmIChpc09iamVjdChzdHJ1Y3QpKSB7XG4gICAgICBtaXhpbihwcm9wcywgc3RydWN0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBtaXhpbihwcm9wcywgc3RydWN0Lm1ldGEucHJvcHMpO1xuICAgICAgbWl4aW4ocHJvdG90eXBlLCBzdHJ1Y3QucHJvdG90eXBlKTtcbiAgICB9XG4gIH0pO1xuICB2YXIgcmV0ID0gc3RydWN0KHByb3BzLCBuYW1lKTtcbiAgbWl4aW4ocmV0LnByb3RvdHlwZSwgcHJvdG90eXBlKTtcbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gc3RydWN0KHByb3BzLCBuYW1lKSB7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBhc3NlcnQoZGljdChTdHJpbmcsIEZ1bmN0aW9uKS5pcyhwcm9wcyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50IHByb3BzICcgKyBhc3NlcnQuc3RyaW5naWZ5KHByb3BzKSArICcgc3VwcGxpZWQgdG8gc3RydWN0KHByb3BzLCBbbmFtZV0pIGNvbWJpbmF0b3IgKGV4cGVjdGVkIGEgZGljdGlvbmFyeSBTdHJpbmcgLT4gVHlwZSknOyB9KTtcbiAgICBhc3NlcnQoaXNUeXBlTmFtZShuYW1lKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgbmFtZSAnICsgYXNzZXJ0LnN0cmluZ2lmeShuYW1lKSArICcgc3VwcGxpZWQgdG8gc3RydWN0KHByb3BzLCBbbmFtZV0pIGNvbWJpbmF0b3IgKGV4cGVjdGVkIGEgc3RyaW5nKSc7IH0pO1xuICB9XG5cbiAgdmFyIGRpc3BsYXlOYW1lID0gbmFtZSB8fCBnZXREZWZhdWx0TmFtZShwcm9wcyk7XG5cbiAgZnVuY3Rpb24gU3RydWN0KHZhbHVlLCBwYXRoKSB7XG5cbiAgICBpZiAoU3RydWN0LmlzKHZhbHVlKSkgeyAvLyBpbXBsZW1lbnRzIGlkZW1wb3RlbmN5XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHBhdGggPSBwYXRoIHx8IFtkaXNwbGF5TmFtZV07XG4gICAgICBhc3NlcnQoaXNPYmplY3QodmFsdWUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCB2YWx1ZSAnICsgYXNzZXJ0LnN0cmluZ2lmeSh2YWx1ZSkgKyAnIHN1cHBsaWVkIHRvICcgKyBwYXRoLmpvaW4oJy8nKSArICcgKGV4cGVjdGVkIGFuIG9iamVjdCknOyB9KTtcbiAgICB9XG5cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU3RydWN0KSkgeyAvLyBgbmV3YCBpcyBvcHRpb25hbFxuICAgICAgcmV0dXJuIG5ldyBTdHJ1Y3QodmFsdWUsIHBhdGgpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gcHJvcHMpIHtcbiAgICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWQgPSBwcm9wc1trXTtcbiAgICAgICAgdmFyIGFjdHVhbCA9IHZhbHVlW2tdO1xuICAgICAgICB0aGlzW2tdID0gY3JlYXRlKGV4cGVjdGVkLCBhY3R1YWwsICggcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHBhdGguY29uY2F0KGsgKyAnOiAnICsgZ2V0VHlwZU5hbWUoZXhwZWN0ZWQpKSA6IG51bGwgKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIE9iamVjdC5mcmVlemUodGhpcyk7XG4gICAgfVxuXG4gIH1cblxuICBTdHJ1Y3QubWV0YSA9IHtcbiAgICBraW5kOiAnc3RydWN0JyxcbiAgICBwcm9wczogcHJvcHMsXG4gICAgbmFtZTogbmFtZSxcbiAgICBpZGVudGl0eTogZmFsc2VcbiAgfTtcblxuICBTdHJ1Y3QuZGlzcGxheU5hbWUgPSBkaXNwbGF5TmFtZTtcblxuICBTdHJ1Y3QuaXMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IGluc3RhbmNlb2YgU3RydWN0O1xuICB9O1xuXG4gIFN0cnVjdC51cGRhdGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIHBhdGNoKSB7XG4gICAgcmV0dXJuIG5ldyBTdHJ1Y3QoYXNzZXJ0LnVwZGF0ZShpbnN0YW5jZSwgcGF0Y2gpKTtcbiAgfTtcblxuICBTdHJ1Y3QuZXh0ZW5kID0gZnVuY3Rpb24gKHN0cnVjdHMsIG5hbWUpIHtcbiAgICByZXR1cm4gZXh0ZW5kKFtTdHJ1Y3RdLmNvbmNhdChzdHJ1Y3RzKSwgbmFtZSk7XG4gIH07XG5cbiAgcmV0dXJuIFN0cnVjdDtcbn1cblxuc3RydWN0LmdldERlZmF1bHROYW1lID0gZ2V0RGVmYXVsdE5hbWU7XG5zdHJ1Y3QuZXh0ZW5kID0gZXh0ZW5kO1xubW9kdWxlLmV4cG9ydHMgPSBzdHJ1Y3Q7XG4iLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9hc3NlcnQnKTtcbnZhciBpc1R5cGVOYW1lID0gcmVxdWlyZSgnLi9pc1R5cGVOYW1lJyk7XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpO1xudmFyIGdldFR5cGVOYW1lID0gcmVxdWlyZSgnLi9nZXRUeXBlTmFtZScpO1xudmFyIGlzSWRlbnRpdHkgPSByZXF1aXJlKCcuL2lzSWRlbnRpdHknKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9jcmVhdGUnKTtcbnZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuZnVuY3Rpb24gZ2V0RGVmYXVsdE5hbWUodHlwZXMpIHtcbiAgcmV0dXJuICdbJyArIHR5cGVzLm1hcChnZXRUeXBlTmFtZSkuam9pbignLCAnKSArICddJztcbn1cblxuZnVuY3Rpb24gdHVwbGUodHlwZXMsIG5hbWUpIHtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGFzc2VydChpc0FycmF5KHR5cGVzKSAmJiB0eXBlcy5ldmVyeShpc0Z1bmN0aW9uKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgdHlwZXMgJyArIGFzc2VydC5zdHJpbmdpZnkodHlwZXMpICsgJyBzdXBwbGllZCB0byB0dXBsZSh0eXBlcywgW25hbWVdKSBjb21iaW5hdG9yIChleHBlY3RlZCBhbiBhcnJheSBvZiB0eXBlcyknOyB9KTtcbiAgICBhc3NlcnQoaXNUeXBlTmFtZShuYW1lKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgbmFtZSAnICsgYXNzZXJ0LnN0cmluZ2lmeShuYW1lKSArICcgc3VwcGxpZWQgdG8gdHVwbGUodHlwZXMsIFtuYW1lXSkgY29tYmluYXRvciAoZXhwZWN0ZWQgYSBzdHJpbmcpJzsgfSk7XG4gIH1cblxuICB2YXIgZGlzcGxheU5hbWUgPSBuYW1lIHx8IGdldERlZmF1bHROYW1lKHR5cGVzKTtcbiAgdmFyIGlkZW50aXR5ID0gdHlwZXMuZXZlcnkoaXNJZGVudGl0eSk7XG5cbiAgZnVuY3Rpb24gVHVwbGUodmFsdWUsIHBhdGgpIHtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAoaWRlbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBwYXRoID0gcGF0aCB8fCBbZGlzcGxheU5hbWVdO1xuICAgICAgYXNzZXJ0KGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gdHlwZXMubGVuZ3RoLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCB2YWx1ZSAnICsgYXNzZXJ0LnN0cmluZ2lmeSh2YWx1ZSkgKyAnIHN1cHBsaWVkIHRvICcgKyBwYXRoLmpvaW4oJy8nKSArICcgKGV4cGVjdGVkIGFuIGFycmF5IG9mIGxlbmd0aCAnICsgdHlwZXMubGVuZ3RoICsgJyknOyB9KTtcbiAgICB9XG5cbiAgICB2YXIgaWRlbXBvdGVudCA9IHRydWU7XG4gICAgdmFyIHJldCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGV4cGVjdGVkID0gdHlwZXNbaV07XG4gICAgICB2YXIgYWN0dWFsID0gdmFsdWVbaV07XG4gICAgICB2YXIgaW5zdGFuY2UgPSBjcmVhdGUoZXhwZWN0ZWQsIGFjdHVhbCwgKCBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gcGF0aC5jb25jYXQoaSArICc6ICcgKyBnZXRUeXBlTmFtZShleHBlY3RlZCkpIDogbnVsbCApKTtcbiAgICAgIGlkZW1wb3RlbnQgPSBpZGVtcG90ZW50ICYmICggYWN0dWFsID09PSBpbnN0YW5jZSApO1xuICAgICAgcmV0LnB1c2goaW5zdGFuY2UpO1xuICAgIH1cblxuICAgIGlmIChpZGVtcG90ZW50KSB7IC8vIGltcGxlbWVudHMgaWRlbXBvdGVuY3lcbiAgICAgIHJldCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBPYmplY3QuZnJlZXplKHJldCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIFR1cGxlLm1ldGEgPSB7XG4gICAga2luZDogJ3R1cGxlJyxcbiAgICB0eXBlczogdHlwZXMsXG4gICAgbmFtZTogbmFtZSxcbiAgICBpZGVudGl0eTogaWRlbnRpdHlcbiAgfTtcblxuICBUdXBsZS5kaXNwbGF5TmFtZSA9IGRpc3BsYXlOYW1lO1xuXG4gIFR1cGxlLmlzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gaXNBcnJheSh4KSAmJlxuICAgICAgeC5sZW5ndGggPT09IHR5cGVzLmxlbmd0aCAmJlxuICAgICAgdHlwZXMuZXZlcnkoZnVuY3Rpb24gKHR5cGUsIGkpIHtcbiAgICAgICAgcmV0dXJuIGlzKHhbaV0sIHR5cGUpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgVHVwbGUudXBkYXRlID0gZnVuY3Rpb24gKGluc3RhbmNlLCBwYXRjaCkge1xuICAgIHJldHVybiBUdXBsZShhc3NlcnQudXBkYXRlKGluc3RhbmNlLCBwYXRjaCkpO1xuICB9O1xuXG4gIHJldHVybiBUdXBsZTtcbn1cblxudHVwbGUuZ2V0RGVmYXVsdE5hbWUgPSBnZXREZWZhdWx0TmFtZTtcbm1vZHVsZS5leHBvcnRzID0gdHVwbGU7IiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vYXNzZXJ0Jyk7XG52YXIgaXNUeXBlTmFtZSA9IHJlcXVpcmUoJy4vaXNUeXBlTmFtZScpO1xudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKTtcbnZhciBnZXRUeXBlTmFtZSA9IHJlcXVpcmUoJy4vZ2V0VHlwZU5hbWUnKTtcbnZhciBpc0lkZW50aXR5ID0gcmVxdWlyZSgnLi9pc0lkZW50aXR5Jyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vY3JlYXRlJyk7XG52YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG52YXIgZm9yYmlkTmV3T3BlcmF0b3IgPSByZXF1aXJlKCcuL2ZvcmJpZE5ld09wZXJhdG9yJyk7XG52YXIgaXNUeXBlID0gcmVxdWlyZSgnLi9pc1R5cGUnKTtcbnZhciBpc1VuaW9uID0gcmVxdWlyZSgnLi9pc1VuaW9uJyk7XG52YXIgaXNOaWwgPSByZXF1aXJlKCcuL2lzTmlsJyk7XG5cbmZ1bmN0aW9uIGdldERlZmF1bHROYW1lKHR5cGVzKSB7XG4gIHJldHVybiB0eXBlcy5tYXAoZ2V0VHlwZU5hbWUpLmpvaW4oJyB8ICcpO1xufVxuXG5mdW5jdGlvbiB1bmlvbih0eXBlcywgbmFtZSkge1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYXNzZXJ0KGlzQXJyYXkodHlwZXMpICYmIHR5cGVzLmV2ZXJ5KGlzRnVuY3Rpb24pICYmIHR5cGVzLmxlbmd0aCA+PSAyLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudCB0eXBlcyAnICsgYXNzZXJ0LnN0cmluZ2lmeSh0eXBlcykgKyAnIHN1cHBsaWVkIHRvIHVuaW9uKHR5cGVzLCBbbmFtZV0pIGNvbWJpbmF0b3IgKGV4cGVjdGVkIGFuIGFycmF5IG9mIGF0IGxlYXN0IDIgdHlwZXMpJzsgfSk7XG4gICAgYXNzZXJ0KGlzVHlwZU5hbWUobmFtZSksIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50IG5hbWUgJyArIGFzc2VydC5zdHJpbmdpZnkobmFtZSkgKyAnIHN1cHBsaWVkIHRvIHVuaW9uKHR5cGVzLCBbbmFtZV0pIGNvbWJpbmF0b3IgKGV4cGVjdGVkIGEgc3RyaW5nKSc7IH0pO1xuICB9XG5cbiAgdmFyIGRpc3BsYXlOYW1lID0gbmFtZSB8fCBnZXREZWZhdWx0TmFtZSh0eXBlcyk7XG4gIHZhciBpZGVudGl0eSA9IHR5cGVzLmV2ZXJ5KGlzSWRlbnRpdHkpO1xuXG4gIGZ1bmN0aW9uIFVuaW9uKHZhbHVlLCBwYXRoKSB7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgaWYgKGlkZW50aXR5KSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9IFVuaW9uLmRpc3BhdGNoKHZhbHVlKTtcbiAgICBpZiAoIXR5cGUgJiYgVW5pb24uaXModmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGZvcmJpZE5ld09wZXJhdG9yKHRoaXMsIFVuaW9uKTtcbiAgICAgIHBhdGggPSBwYXRoIHx8IFtkaXNwbGF5TmFtZV07XG4gICAgICBhc3NlcnQoaXNUeXBlKHR5cGUpLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnSW52YWxpZCB2YWx1ZSAnICsgYXNzZXJ0LnN0cmluZ2lmeSh2YWx1ZSkgKyAnIHN1cHBsaWVkIHRvICcgKyBwYXRoLmpvaW4oJy8nKSArICcgKG5vIGNvbnN0cnVjdG9yIHJldHVybmVkIGJ5IGRpc3BhdGNoKSc7IH0pO1xuICAgICAgcGF0aFtwYXRoLmxlbmd0aCAtIDFdICs9ICcoJyArIGdldFR5cGVOYW1lKHR5cGUpICsgJyknO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGUodHlwZSwgdmFsdWUsIHBhdGgpO1xuICB9XG5cbiAgVW5pb24ubWV0YSA9IHtcbiAgICBraW5kOiAndW5pb24nLFxuICAgIHR5cGVzOiB0eXBlcyxcbiAgICBuYW1lOiBuYW1lLFxuICAgIGlkZW50aXR5OiBpZGVudGl0eVxuICB9O1xuXG4gIFVuaW9uLmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWU7XG5cbiAgVW5pb24uaXMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB0eXBlcy5zb21lKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICByZXR1cm4gaXMoeCwgdHlwZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgVW5pb24uZGlzcGF0Y2ggPSBmdW5jdGlvbiAoeCkgeyAvLyBkZWZhdWx0IGRpc3BhdGNoIGltcGxlbWVudGF0aW9uXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgICAgdmFyIHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgIGlmIChpc1VuaW9uKHR5cGUpKSB7IC8vIGhhbmRsZSB1bmlvbiBvZiB1bmlvbnNcbiAgICAgICAgdmFyIHQgPSB0eXBlLmRpc3BhdGNoKHgpO1xuICAgICAgICBpZiAoIWlzTmlsKHQpKSB7XG4gICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzKHgsIHR5cGUpKSB7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBVbmlvbi51cGRhdGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIHBhdGNoKSB7XG4gICAgcmV0dXJuIFVuaW9uKGFzc2VydC51cGRhdGUoaW5zdGFuY2UsIHBhdGNoKSk7XG4gIH07XG5cbiAgcmV0dXJuIFVuaW9uO1xufVxuXG51bmlvbi5nZXREZWZhdWx0TmFtZSA9IGdldERlZmF1bHROYW1lO1xubW9kdWxlLmV4cG9ydHMgPSB1bmlvbjtcblxuIiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vYXNzZXJ0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcbnZhciBpc051bWJlciA9IHJlcXVpcmUoJy4vaXNOdW1iZXInKTtcbnZhciBtaXhpbiA9IHJlcXVpcmUoJy4vbWl4aW4nKTtcblxuZnVuY3Rpb24gZ2V0U2hhbGxvd0NvcHkoeCkge1xuICBpZiAoaXNBcnJheSh4KSkge1xuICAgIHJldHVybiB4LmNvbmNhdCgpO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRGF0ZSB8fCB4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIG1peGluKHt9LCB4KTtcbiAgfVxuICByZXR1cm4geDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKGluc3RhbmNlLCBwYXRjaCkge1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYXNzZXJ0KGlzT2JqZWN0KHBhdGNoKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnQgcGF0Y2ggJyArIGFzc2VydC5zdHJpbmdpZnkocGF0Y2gpICsgJyBzdXBwbGllZCB0byBmdW5jdGlvbiB1cGRhdGUoaW5zdGFuY2UsIHBhdGNoKTogZXhwZWN0ZWQgYW4gb2JqZWN0IGNvbnRhaW5pbmcgY29tbWFuZHMnOyB9KTtcbiAgfVxuXG4gIHZhciB2YWx1ZSA9IGdldFNoYWxsb3dDb3B5KGluc3RhbmNlKTtcbiAgdmFyIGlzQ2hhbmdlZCA9IGZhbHNlO1xuICBmb3IgKHZhciBrIGluIHBhdGNoKSB7XG4gICAgaWYgKHBhdGNoLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICBpZiAodXBkYXRlLmNvbW1hbmRzLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIHZhbHVlID0gdXBkYXRlLmNvbW1hbmRzW2tdKHBhdGNoW2tdLCB2YWx1ZSk7XG4gICAgICAgIGlzQ2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdXBkYXRlKHZhbHVlW2tdLCBwYXRjaFtrXSk7XG4gICAgICAgIGlzQ2hhbmdlZCA9IGlzQ2hhbmdlZCB8fCAoIG5ld1ZhbHVlICE9PSB2YWx1ZVtrXSApO1xuICAgICAgICB2YWx1ZVtrXSA9IG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaXNDaGFuZ2VkID8gdmFsdWUgOiBpbnN0YW5jZTtcbn1cblxuLy8gYnVpbHQtaW4gY29tbWFuZHNcblxuZnVuY3Rpb24gJGFwcGx5KGYsIHZhbHVlKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYXNzZXJ0KGlzRnVuY3Rpb24oZiksICdJbnZhbGlkIGFyZ3VtZW50IGYgc3VwcGxpZWQgdG8gaW1tdXRhYmlsaXR5IGhlbHBlciB7ICRhcHBseTogZiB9IChleHBlY3RlZCBhIGZ1bmN0aW9uKScpO1xuICB9XG4gIHJldHVybiBmKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gJHB1c2goZWxlbWVudHMsIGFycikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGFzc2VydChpc0FycmF5KGVsZW1lbnRzKSwgJ0ludmFsaWQgYXJndW1lbnQgZWxlbWVudHMgc3VwcGxpZWQgdG8gaW1tdXRhYmlsaXR5IGhlbHBlciB7ICRwdXNoOiBlbGVtZW50cyB9IChleHBlY3RlZCBhbiBhcnJheSknKTtcbiAgICBhc3NlcnQoaXNBcnJheShhcnIpLCAnSW52YWxpZCB2YWx1ZSBzdXBwbGllZCB0byBpbW11dGFiaWxpdHkgaGVscGVyICRwdXNoIChleHBlY3RlZCBhbiBhcnJheSknKTtcbiAgfVxuICByZXR1cm4gYXJyLmNvbmNhdChlbGVtZW50cyk7XG59XG5cbmZ1bmN0aW9uICRyZW1vdmUoa2V5cywgb2JqKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYXNzZXJ0KGlzQXJyYXkoa2V5cyksICdJbnZhbGlkIGFyZ3VtZW50IGtleXMgc3VwcGxpZWQgdG8gaW1tdXRhYmlsaXR5IGhlbHBlciB7ICRyZW1vdmU6IGtleXMgfSAoZXhwZWN0ZWQgYW4gYXJyYXkpJyk7XG4gICAgYXNzZXJ0KGlzT2JqZWN0KG9iaiksICdJbnZhbGlkIHZhbHVlIHN1cHBsaWVkIHRvIGltbXV0YWJpbGl0eSBoZWxwZXIgJHJlbW92ZSAoZXhwZWN0ZWQgYW4gb2JqZWN0KScpO1xuICB9XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgIGRlbGV0ZSBvYmpba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gJHNldCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uICRzcGxpY2Uoc3BsaWNlcywgYXJyKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYXNzZXJ0KGlzQXJyYXkoc3BsaWNlcykgJiYgc3BsaWNlcy5ldmVyeShpc0FycmF5KSwgJ0ludmFsaWQgYXJndW1lbnQgc3BsaWNlcyBzdXBwbGllZCB0byBpbW11dGFiaWxpdHkgaGVscGVyIHsgJHNwbGljZTogc3BsaWNlcyB9IChleHBlY3RlZCBhbiBhcnJheSBvZiBhcnJheXMpJyk7XG4gICAgYXNzZXJ0KGlzQXJyYXkoYXJyKSwgJ0ludmFsaWQgdmFsdWUgc3VwcGxpZWQgdG8gaW1tdXRhYmlsaXR5IGhlbHBlciAkc3BsaWNlIChleHBlY3RlZCBhbiBhcnJheSknKTtcbiAgfVxuICByZXR1cm4gc3BsaWNlcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgc3BsaWNlKSB7XG4gICAgYWNjLnNwbGljZS5hcHBseShhY2MsIHNwbGljZSk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwgYXJyKTtcbn1cblxuZnVuY3Rpb24gJHN3YXAoY29uZmlnLCBhcnIpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBhc3NlcnQoaXNPYmplY3QoY29uZmlnKSwgJ0ludmFsaWQgYXJndW1lbnQgY29uZmlnIHN1cHBsaWVkIHRvIGltbXV0YWJpbGl0eSBoZWxwZXIgeyAkc3dhcDogY29uZmlnIH0gKGV4cGVjdGVkIGFuIG9iamVjdCknKTtcbiAgICBhc3NlcnQoaXNOdW1iZXIoY29uZmlnLmZyb20pLCAnSW52YWxpZCBhcmd1bWVudCBjb25maWcuZnJvbSBzdXBwbGllZCB0byBpbW11dGFiaWxpdHkgaGVscGVyIHsgJHN3YXA6IGNvbmZpZyB9IChleHBlY3RlZCBhIG51bWJlciknKTtcbiAgICBhc3NlcnQoaXNOdW1iZXIoY29uZmlnLnRvKSwgJ0ludmFsaWQgYXJndW1lbnQgY29uZmlnLnRvIHN1cHBsaWVkIHRvIGltbXV0YWJpbGl0eSBoZWxwZXIgeyAkc3dhcDogY29uZmlnIH0gKGV4cGVjdGVkIGEgbnVtYmVyKScpO1xuICAgIGFzc2VydChpc0FycmF5KGFyciksICdJbnZhbGlkIHZhbHVlIHN1cHBsaWVkIHRvIGltbXV0YWJpbGl0eSBoZWxwZXIgJHN3YXAgKGV4cGVjdGVkIGFuIGFycmF5KScpO1xuICB9XG4gIHZhciBlbGVtZW50ID0gYXJyW2NvbmZpZy50b107XG4gIGFycltjb25maWcudG9dID0gYXJyW2NvbmZpZy5mcm9tXTtcbiAgYXJyW2NvbmZpZy5mcm9tXSA9IGVsZW1lbnQ7XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uICR1bnNoaWZ0KGVsZW1lbnRzLCBhcnIpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBhc3NlcnQoaXNBcnJheShlbGVtZW50cyksICdJbnZhbGlkIGFyZ3VtZW50IGVsZW1lbnRzIHN1cHBsaWVkIHRvIGltbXV0YWJpbGl0eSBoZWxwZXIgeyR1bnNoaWZ0OiBlbGVtZW50c30gKGV4cGVjdGVkIGFuIGFycmF5KScpO1xuICAgIGFzc2VydChpc0FycmF5KGFyciksICdJbnZhbGlkIHZhbHVlIHN1cHBsaWVkIHRvIGltbXV0YWJpbGl0eSBoZWxwZXIgJHVuc2hpZnQgKGV4cGVjdGVkIGFuIGFycmF5KScpO1xuICB9XG4gIHJldHVybiBlbGVtZW50cy5jb25jYXQoYXJyKTtcbn1cblxuZnVuY3Rpb24gJG1lcmdlKG9iaiwgdmFsdWUpIHtcbiAgcmV0dXJuIG1peGluKG1peGluKHt9LCB2YWx1ZSksIG9iaiwgdHJ1ZSk7XG59XG5cbnVwZGF0ZS5jb21tYW5kcyA9IHtcbiAgJGFwcGx5OiAkYXBwbHksXG4gICRwdXNoOiAkcHVzaCxcbiAgJHJlbW92ZTogJHJlbW92ZSxcbiAgJHNldDogJHNldCxcbiAgJHNwbGljZTogJHNwbGljZSxcbiAgJHN3YXA6ICRzd2FwLFxuICAkdW5zaGlmdDogJHVuc2hpZnQsXG4gICRtZXJnZTogJG1lcmdlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc25hYmJkb20gPSByZXF1aXJlKCdzbmFiYmRvbScpO1xudmFyIHBhdGNoID0gc25hYmJkb20uaW5pdChbXG4gICAgcmVxdWlyZSgnc25hYmJkb20vbW9kdWxlcy9jbGFzcycpLFxuICAgIHJlcXVpcmUoJ3NuYWJiZG9tL21vZHVsZXMvcHJvcHMnKSxcbiAgICByZXF1aXJlKCdzbmFiYmRvbS9tb2R1bGVzL2F0dHJpYnV0ZXMnKSxcbiAgICByZXF1aXJlKCdzbmFiYmRvbS9tb2R1bGVzL3N0eWxlJyksXG4gICAgcmVxdWlyZSgnc25hYmJkb20vbW9kdWxlcy9ldmVudGxpc3RlbmVycycpXG5dKTtcbnZhciBoeXBlciA9IHJlcXVpcmUoJ3NuYWJiZG9tL2gnKTtcbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnaHlwZXJzY3JpcHQtaGVscGVycycpKGh5cGVyKTtcbnZhciBTaWduYWwgPSByZXF1aXJlKCdtaW5pLXNpZ25hbHMnKTtcbnZhciB1bmlxdWVJZCA9IHJlcXVpcmUoJ2xvZGFzaC91bmlxdWVJZCcpO1xudmFyIG5vb3AgPSByZXF1aXJlKCdsb2Rhc2gvbm9vcCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC9hc3NpZ24nKTtcbnZhciBjbG9uZSA9IHJlcXVpcmUoJ2xvZGFzaC9jbG9uZURlZXAnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmZ1bmN0aW9uIENvbXBvbmVudCgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQ29tcG9uZW50KSkge1xuICAgICAgICByZXR1cm4gbmV3IENvbXBvbmVudCgpO1xuICAgIH1cbiAgICB0aGlzLmNvbXBvbmVudE5hbWUgPSAnY29tcG9uZW50JztcbiAgICB0aGlzLnByb3BzID0ge307XG4gICAgdGhpcy52bm9kZSA9IG51bGw7XG4gICAgdGhpcy50aHVuayA9IGZhbHNlO1xuICAgIHRoaXMubW91bnRlZFZub2RlID0gbnVsbDtcbiAgICB0aGlzLmlzTW91bnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2lnbmFscyA9IHtcbiAgICAgICAgd2lsbE1vdW50OiBuZXcgU2lnbmFsKCksXG4gICAgICAgIGRpZE1vdW50OiBuZXcgU2lnbmFsKCksXG4gICAgICAgIHdpbGxVcGRhdGU6IG5ldyBTaWduYWwoKSxcbiAgICAgICAgZGlkVXBkYXRlOiBuZXcgU2lnbmFsKCksXG4gICAgICAgIHdpbGxVbm1vdW50OiBuZXcgU2lnbmFsKClcbiAgICB9O1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuY2lkID0gdW5pcXVlSWQodGhpcy5jb21wb25lbnROYW1lICsgJ18nKTtcbn1cblxuQ29tcG9uZW50LmNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvKSB7XG4gICAgdmFyIENoaWxkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBDb21wb25lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENoaWxkKCk7XG4gICAgICAgIH1cbiAgICAgICAgQ29tcG9uZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGluaGVyaXRzKENoaWxkLCBDb21wb25lbnQpO1xuICAgIGFzc2lnbihDaGlsZC5wcm90b3R5cGUsIHByb3RvKTtcbiAgICByZXR1cm4gQ2hpbGQ7XG59O1xuXG5Db21wb25lbnQucHJvdG90eXBlLmluaXQgPSBub29wO1xuXG5Db21wb25lbnQucHJvdG90eXBlLnJlbmRlciA9IG5vb3A7XG5cbkNvbXBvbmVudC5wcm90b3R5cGUuY29tcG9uZW50V2lsbE1vdW50ID0gbm9vcDtcblxuQ29tcG9uZW50LnByb3RvdHlwZS5jb21wb25lbnREaWRNb3VudCA9IG5vb3A7XG5cbkNvbXBvbmVudC5wcm90b3R5cGUuY29tcG9uZW50V2lsbFVubW91bnQgPSBub29wO1xuXG5Db21wb25lbnQucHJvdG90eXBlLmNvbXBvbmVudFdpbGxVcGRhdGUgPSBub29wO1xuXG5Db21wb25lbnQucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZSA9IG5vb3A7XG5cbkNvbXBvbmVudC5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMgPT09IG5leHRQcm9wcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gaG9va3MoY29udGV4dCwgdm5vZGUpIHtcbiAgICB2YXIgY29tcEhvb2tzID0gdm5vZGUuZGF0YS5ob29rO1xuXG4gICAgaWYgKHZub2RlLmRhdGEuaG9vaykge1xuICAgICAgICBjb25zb2xlLndhcm4oJ3Zub2RlIHZub2RlIGFscmVhZHkgaGFzIGhvb2tzIGRlZmluZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb21wSG9va3MgPSB2bm9kZS5kYXRhLmhvb2sgPSB7fTtcbiAgICB9XG5cbiAgICBjb21wSG9va3MuY3JlYXRlID0gZnVuY3Rpb24oZW1wdHlWTm9kZSwgdm5vZGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NyZWF0ZScsIGNvbnRleHQuY2lkKTtcbiAgICAgICAgaWYgKGNvbnRleHQudGh1bmspIHtcbiAgICAgICAgICAgIGNvbnRleHQubW91bnRlZFZub2RlLmRhdGEudm5vZGUgPSB2bm9kZTtcbiAgICAgICAgICAgIGNvbnRleHQubW91bnRlZFZub2RlLmVsbSA9IHZub2RlLmVsbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQubW91bnRlZFZub2RlID0gdm5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbnRleHQuaXNNb3VudGVkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNpZ25hbHMud2lsbE1vdW50LmRpc3BhdGNoKCk7XG4gICAgICAgICAgICBjb250ZXh0LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnY29tcG9uZW50V2lsbE1vdW50JywgY29udGV4dC5jaWQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb21wSG9va3MuaW5zZXJ0ID0gZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2luc2VydCAnLCBjb250ZXh0LmNpZCk7XG4gICAgICAgIGlmIChjb250ZXh0LmlzTW91bnRlZCkge1xuICAgICAgICAgICAgY29udGV4dC5zaWduYWxzLmRpZFVwZGF0ZS5kaXNwYXRjaCgpO1xuICAgICAgICAgICAgY29udGV4dC5jb21wb25lbnREaWRVcGRhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2NvbXBvbmVudERpZFVwZGF0ZSAnLCBjb250ZXh0LmNpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LmlzTW91bnRlZCA9IHRydWU7XG4gICAgICAgICAgICBjb250ZXh0LnNpZ25hbHMuZGlkTW91bnQuZGlzcGF0Y2goKTtcbiAgICAgICAgICAgIGNvbnRleHQuY29tcG9uZW50RGlkTW91bnQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2NvbXBvbmVudERpZE1vdW50JywgY29udGV4dC5jaWQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb21wSG9va3MuZGVzdHJveSA9IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGlmICh2bm9kZSA9PT0gY29udGV4dC5tb3VudGVkVm5vZGUpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2lnbmFscy53aWxsVW5tb3VudC5kaXNwYXRjaCgpO1xuICAgICAgICAgICAgY29udGV4dC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICAgICAgY29udGV4dC5pc01vdW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ3VubW91bnQgJywgY29udGV4dC5jaWQsIHZub2RlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29tcEhvb2tzLnByZXBhdGNoID0gZnVuY3Rpb24ob2xkLCBuZXdOb2RlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUuZGVidWcoJ3ByZXBhdGNoICcsIGNvbnRleHQuY2lkLCBjbG9uZShvbGQpLCBjbG9uZShuZXdOb2RlKSk7XG4gICAgfTtcbiAgICBjb21wSG9va3MucG9zdHBhdGNoID0gZnVuY3Rpb24ob2xkLCBuZXdOb2RlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUuZGVidWcoJ3Bvc3RwYWNoICcsIGNvbnRleHQuY2lkLCBuZXdOb2RlKTtcbiAgICAgICAgY29udGV4dC5zaWduYWxzLmRpZFVwZGF0ZS5kaXNwYXRjaCgpO1xuICAgICAgICBjb250ZXh0LmNvbXBvbmVudERpZFVwZGF0ZSgpO1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdjb21wb25lbnREaWRVcGRhdGUgJywgY29udGV4dC5jaWQpO1xuICAgIH07XG59XG5cbkNvbXBvbmVudC5wcm90b3R5cGUubW91bnQgPSBmdW5jdGlvbihwcm9wcywgaGFuZGxlcnMpIHtcbiAgICAvLyBjb25zb2xlLmRlYnVnKCdNb3VudDogJywgdGhpcy5jaWQsIHByb3BzKTtcbiAgICBpZiAodGhpcy5pc01vdW50ZWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignUmVuZGVyIGFnYWluPycpO1xuICAgIH1cbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzO1xuICAgIHRoaXMudm5vZGUgPSB0aGlzLnJlbmRlcihwcm9wcywgaGFuZGxlcnMpO1xuICAgIGlmICghdGhpcy52bm9kZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ2VtcHR5IHJlbmRlciA/IT8nKTtcbiAgICB9XG4gICAgaG9va3ModGhpcywgdGhpcy52bm9kZSk7XG4gICAgcmV0dXJuIHRoaXMudm5vZGU7XG59O1xuXG5Db21wb25lbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG5leHRQcm9wcywgaGFuZGxlcnMpIHtcbiAgICB2YXIgb2xkUm9vdCA9IHRoaXMudm5vZGU7XG4gICAgdmFyIHZub2RlO1xuXG4gICAgLy8gdXBkYXRlIGhhbmRsZXJzXG4gICAgaWYgKHR5cGVvZiBoYW5kbGVycyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzO1xuICAgIH1cblxuICAgIC8vIHByb3RlY3QgdXBkYXRlIHdpdGggZW1wdHkgcHJvcHNcbiAgICBpZiAoIW5leHRQcm9wcykge1xuICAgICAgICBuZXh0UHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzTW91bnRlZCkge1xuICAgICAgICBpZiAodGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSkge1xuICAgICAgICAgICAgdGhpcy5zaWduYWxzLndpbGxVcGRhdGUuZGlzcGF0Y2gobmV4dFByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5kZWJ1ZygnVXBkYXRlOiAnLCB0aGlzLmNpZCwgbmV4dFByb3BzKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMgPSBuZXh0UHJvcHM7XG5cbiAgICAgICAgICAgIC8vIFJlcGxhY2UgRE9NXG4gICAgICAgICAgICB2bm9kZSA9IHRoaXMucmVuZGVyKHRoaXMucHJvcHMsIHRoaXMuaGFuZGxlcnMpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnZub2RlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdlbXB0eSByZW5kZXIgPyE/Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBob29rcyh0aGlzLCB2bm9kZSk7XG4gICAgICAgICAgICB0aGlzLnZub2RlID0gcGF0Y2gob2xkUm9vdCwgdm5vZGUpO1xuICAgICAgICAgICAgdGhpcy5tb3VudGVkVm5vZGUuZGF0YS52bm9kZSA9IHRoaXMudm5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTa2lwZWQ6ICcsIHRoaXMuY2lkKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignV2h5IHVwZGF0ZSB3aGVuIG5vdCBtb3VudGVkPyAnLCB0aGlzLmNpZCk7XG4gICAgfVxufTtcblxuLy8gbW9kdWxlLmV4cG9ydHMuaCA9IGh5cGVyO1xubW9kdWxlLmV4cG9ydHMuaGVscGVycyA9IGhlbHBlcnM7XG5tb2R1bGUuZXhwb3J0cy5wYXRjaCA9IHBhdGNoO1xubW9kdWxlLmV4cG9ydHMuQ29tcG9uZW50ID0gQ29tcG9uZW50O1xubW9kdWxlLmV4cG9ydHMubW91bnQgPSBmdW5jdGlvbihlbGVtLCBjb21wLCBzdGF0ZSkge1xuICAgIHZhciB2bm9kZSA9IGNvbXAoKS5tb3VudChzdGF0ZSk7XG4gICAgdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGVtcC5pZCA9ICdqYXNraGRqc2FoZGtqYWhzZGprJztcbiAgICBwYXRjaChlbGVtLmFwcGVuZENoaWxkKHRlbXApLCB2bm9kZSk7XG4gICAgcmV0dXJuIHZub2RlO1xufTtcblxubW9kdWxlLmV4cG9ydHMuaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb21wb25lbnQgPSBhcmd1bWVudHNbMF07XG4gICAgdmFyIHByb3BzID0gYXJndW1lbnRzWzFdICYmIGFyZ3VtZW50c1sxXS5wcm9wcyB8fCB7fTtcbiAgICB2YXIgaGFuZGxlcnMgPSBhcmd1bWVudHNbMV0gJiYgYXJndW1lbnRzWzFdLm9uIHx8IHt9O1xuICAgIHZhciBjaGlsZHJlbiA9IGFyZ3VtZW50c1syXTtcblxuICAgIGlmIChjb21wb25lbnQuc3VwZXJfID09PSBDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHByb3BzLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cG9ydHMucmV1c2UocHJvcHMua2V5LCBjb21wb25lbnQsIHByb3BzLCBoYW5kbGVycywgY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQoKS5tb3VudChwcm9wcywgaGFuZGxlcnMsIGNoaWxkcmVuKTtcbiAgICB9XG4gICAgcmV0dXJuIGh5cGVyLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG59O1xuXG5mdW5jdGlvbiBpbml0KHRodW5rVm5vZGUpIHtcbiAgICB2YXIgZGF0YSA9IHRodW5rVm5vZGUuZGF0YTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdJTklUIHRodW5rJywgdGh1bmtWbm9kZSk7XG4gICAgdGh1bmtWbm9kZS5kYXRhLmhvb2suZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZGVzdHJveSB1bm1vdW50JywgdGh1bmtWbm9kZS5zZWwsIGRhdGEuaW5zdGFuY2UuY2lkKTtcbiAgICAgICAgZGF0YS5pbnN0YW5jZS5zaWduYWxzLndpbGxVbm1vdW50LmRpc3BhdGNoKCk7XG4gICAgICAgIGRhdGEuaW5zdGFuY2UuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICB9O1xuXG4gICAgZGF0YS5pbnN0YW5jZSA9IGRhdGEudHlwZSgpO1xuICAgIGRhdGEuaW5zdGFuY2UudGh1bmsgPSB0cnVlO1xuICAgIGRhdGEuaW5zdGFuY2UubW91bnRlZFZub2RlID0gdGh1bmtWbm9kZTtcbiAgICBkYXRhLmluc3RhbmNlLm1vdW50KGRhdGEuYXJnc1swXSwgZGF0YS5hcmdzWzFdKTtcbiAgICBkYXRhLnZub2RlID0gZGF0YS5pbnN0YW5jZS52bm9kZTtcbn1cblxuZnVuY3Rpb24gcHJlcGF0Y2gob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgdmFyIHBhdGNoO1xuICAgIC8vIGNvbnNvbGUubG9nKCdwcmVwYXRjaCBvbGQnLCBjbG9uZShvbGRWbm9kZSkpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdwcmVwYXRjaCB2bm9kZScsIGNsb25lKHZub2RlKSk7XG5cbiAgICBpZiAob2xkVm5vZGUuZGF0YS50eXBlID09PSB2bm9kZS5kYXRhLnR5cGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdyZXVzZScpO1xuICAgICAgICBvbGRWbm9kZS5kYXRhLmluc3RhbmNlLnVwZGF0ZSh2bm9kZS5kYXRhLmFyZ3NbMF0sIHZub2RlLmRhdGEuYXJnc1sxXSk7XG4gICAgICAgIGNvbnNvbGUud2FybignZmluaXNoIHJldXNlJyk7XG4gICAgICAgIHBhdGNoID0gb2xkVm5vZGUuZGF0YS5pbnN0YW5jZS52bm9kZTtcbiAgICAgICAgdm5vZGUuZGF0YSA9IG9sZFZub2RlLmRhdGE7XG4gICAgICAgIHZub2RlLmRhdGEudm5vZGUgPSBwYXRjaDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ2RpZG50IHJldXNlJyk7XG4gICAgfVxufVxuXG5leHBvcnRzLnJldXNlID0gZnVuY3Rpb24obmFtZSwgZm4gLyogYXJncyAqLyApIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgZm9yIChpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBhcmdzW2kgLSAyXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gaHlwZXIoJ3RodW5rJyArIG5hbWUsIHtcbiAgICAgICAgaG9vazogeyBpbml0OiBpbml0LCBwcmVwYXRjaDogcHJlcGF0Y2ggfSxcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICAgIHR5cGU6IGZuLFxuICAgICAgICBhcmdzOiBhcmdzXG4gICAgfSk7XG59O1xuIl19
