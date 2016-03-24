'use strict';

var redux = require('redux');
var applyMiddleware = redux.applyMiddleware;
var combineReducers = redux.combineReducers;
var compose = redux.compose;
var thunk = require('redux-thunk').default;
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
var reducerApp = require('./reducerApp.js').reducer;
var reducerList = require('./nesting/list.js').reducer;

var reducer = combineReducers({
    examples: reducerApp,
    // counters: CounterList.reducer,
    list: reducerList
});

var Store = redux.createStore(reducer, compose(
    applyMiddleware(thunk, logger),
    window.devToolsExtension ? window.devToolsExtension() : function(f) {
        return f;
    }
));

module.exports = Store;
