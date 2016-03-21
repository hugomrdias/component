'use strict';

var redux = require('redux');
var CounterList = require('./example.js');
var reducer = redux.combineReducers({
    counterList: CounterList.reducer
});
var store = redux.createStore(reducer);

module.exports = new CounterList({
    store: store,
    state: store.getState().counterList
});
