'use strict';

var redux = require('redux');
var applyMiddleware = redux.applyMiddleware;
var CounterList = require('./counterList.js');
var App = require('./app.js');

var reducer = redux.combineReducers({
    examples: App.reducer,
    counters: CounterList.reducer
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

var app = new App();

var root = document.getElementById('root');

root.appendChild(app.render({
    store: store,
    state: store.getState().examples
}));
