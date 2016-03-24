'use strict';

var actionsTypes = require('./reducer-app.js').actionsTypes;
var store = require('./store.js').store;
var dispatch = store.dispatch;

exports.changeExample = function(example) {
    dispatch({
        type: actionsTypes.CHANGE_EXAMPLE,
        example: example
    });
};
