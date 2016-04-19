'use strict';

var hyper = require('snabbdom/h');
var helpers = require('hyperscript-helpers')(hyper);
var { Component, patch } = require('./src/component.js');
var reuse = require('./src/reuse.js');

exports.helpers = helpers;
exports.patch = patch;
exports.Component = Component;
exports.reuse = reuse;
exports.mount = function(elem, comp, state) {
    var vnode = comp().create(state);
    var temp = document.createElement('span');

    temp.id = 'jaskhdjsahdkjahsdjk';
    patch(elem.appendChild(temp), vnode);
    return vnode;
};

exports.h = function() {
    var component = arguments[0];
    var props = arguments[1] && arguments[1].props || {};
    var handlers = arguments[1] && arguments[1].on || {};
    var children = arguments[2];

    // TODO check swap children to arguments[1] if array
    // to allow undefined data object
    if (component.super_ === Component) {
        if (arguments[1] && arguments[1].key) {
            return reuse(arguments[1].key, component, props, handlers, children);
        }
        return component().mount(props, handlers, children);
    }
    return hyper.apply(null, arguments);
};
