'use strict';

var actionTypes = require('./reducer-nesting.js').actionTypes;
var store = require('./../store.js').store;
var dispatch = store.dispatch;

exports.increment = function(id) {
    dispatch({
        type: actionTypes.INCREMENT,
        id: id
    });
};
