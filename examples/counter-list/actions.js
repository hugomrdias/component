/**
 * Actions for counter list component
 */
'use strict';

var actionsTypes = require('./reducer-counter-list.js').actionTypes;

exports.addCounter = function(store) {
    store.dispatch({
        type: actionsTypes.ADD_COUNTER
    });
};
exports.resetCounter = function(store) {
    store.dispatch({
        type: actionsTypes.RESET_COUNTER
    });
};
exports.removeCounter = function(store, id) {
    store.dispatch({
        type: actionsTypes.REMOVE_COUNTER,
        id: id
    });
};
exports.incrementCounter = function(store, id) {
    store.dispatch({
        type: actionsTypes.INCREMENT_COUNTER,
        id: id
    });
};
exports.decrementCounter = function(store, id) {
    store.dispatch({
        type: actionsTypes.DECREMENT_COUNTER,
        id: id
    });
};
