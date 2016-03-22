'use strict';

var redux = require('redux');
var Component = require('./component');
var applyMiddleware = redux.applyMiddleware;
var combineReducers = redux.combineReducers;
var App = require('./app.js');
var CounterList = require('./counterList.js');
var List = require('./nesting/list.js');

var reducer = combineReducers({
    examples: App.reducer,
    counters: CounterList.reducer,
    list: List.reducer
});

function logger(store) {
    var getState = store.getState;

    return (next) => (action) => {
        console.log('will dispatch', action);

        // Call the next dispatch method in the middleware chain.
        let returnValue = next(action);

        console.log('state after dispatch', getState());

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    };
}

var store = redux.createStore(reducer, applyMiddleware(logger));
Component.store = store;
Component.dispatch = store.dispatch;

var app = new App();

var root = document.getElementById('root');

root.appendChild(app.render(store.getState().examples));
