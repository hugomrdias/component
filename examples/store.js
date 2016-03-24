'use strict';

var redux = require('redux');
var applyMiddleware = redux.applyMiddleware;
var combineReducers = redux.combineReducers;
var compose = redux.compose;
var thunk = require('redux-thunk').default;
var bindActionCreators = require('redux').bindActionCreators;
// var logger = require('redux-logger');

var logger = function logger(store) {
    var getState = store.getState;

    return (next) => (action) => {
        console.info('will dispatch', action);

        // Call the next dispatch method in the middleware chain.
        let returnValue = next(action);

        console.info('state after dispatch', getState());

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    };
};

// Reducers
var reducerApp = require('./reducer-app.js').reducer;
var reducerList = require('./nesting/reducer-nesting.js').reducer;
var reducerCounterList = require('./counter-list/reducer-counter-list.js').reducer;
var reducer = combineReducers({
    examples: reducerApp,
    counters: reducerCounterList,
    list: reducerList
});

var Store = redux.createStore(reducer, compose(
    applyMiddleware(thunk, logger),
    window.devToolsExtension ? window.devToolsExtension() : function(f) {
        return f;
    }
));

exports.store = Store;
exports.bind = function(creators) {
    return bindActionCreators(creators, Store.dispatch);
};

// TODO remove dispatch injection
// TODO add obj support "simple action" dispatch
// action(actions.changeExample, 'home')('dhdh');
// action({ type: 'CENAS' })
// action({ type: 'CENAS' })()

// dispatch({ type: 'CENAS' })

// function() { dispatch({ type: 'CENAS' }) }
// (dispatch) => (event) => dispatch({ type: 'CENAS' })

exports.action = function(fn) {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);

    if (typeof fn === 'function') {
        return function() {
            return fn.apply(this, args.concat(slice.call(arguments, 0)));
        };
    }
    if (typeof fn !== 'object' || fn === null || typeof fn === 'undefined') {
        throw new Error('action expected an object or a function, instead received ' + (fn === 'null' ? 'null' : typeof fn));
    }

    if (typeof fn === 'object') {
        return function() {
            return Store.dispatch(fn);
        };
    }
};
