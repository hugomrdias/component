/**
 * Actions for counter list component
 */
'use strict';

var actionsTypes = require('./reducer-counter-list.js').actionTypes;
var store = require('./../store.js').store;
var dispatch = store.dispatch;

exports.addCounter = function() {
    dispatch({
        type: actionsTypes.ADD_COUNTER
    });
};
exports.resetCounter = function() {
    dispatch({
        type: actionsTypes.RESET_COUNTER
    });
};
exports.removeCounter = function(id) {
    dispatch({
        type: actionsTypes.REMOVE_COUNTER,
        id: id
    });
};
exports.incrementCounter = function(id) {
    dispatch({
        type: actionsTypes.INCREMENT_COUNTER,
        id: id
    });
};
exports.decrementCounter = function(id) {
    dispatch({
        type: actionsTypes.DECREMENT_COUNTER,
        id: id
    });
};
