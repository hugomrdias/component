'use strict';

var updateClass = require('./modules/class.js');
var updateAttrs = require('./modules/attributes.js');
var updateEventListeners = require('./modules/event-listeners.js');
var is = {
    array: Array.isArray,
    primitive: function(s) {
        return typeof s === 'string' ||
            typeof s === 'number' ||
            typeof s === 'boolean' ||
            s instanceof Date ||
            s instanceof RegExp;
    }
};

function createElement(vnode) {
    var i;
    var elm;
    var sel = vnode.sel;
    var data = vnode.data;
    var children = vnode.children;

    if (sel) {
        // Parse selector
        var hashIdx = sel.indexOf('#');
        var dotIdx = sel.indexOf('.', hashIdx);
        var hash = hashIdx > 0 ? hashIdx : sel.length;
        var dot = dotIdx > 0 ? dotIdx : sel.length;
        var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
        elm = vnode.elm = document.createElement(tag);

        if (hash < dot) {
            elm.id = sel.slice(hash + 1, dot);
        }
        if (dotIdx > 0) {
            elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
        }
        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                elm.appendChild(children[i]);
            }
        } else if (is.primitive(vnode.text)) {
            elm.appendChild(document.createTextNode(vnode.text));
        }
    } else {
        elm = vnode.elm = document.createTextNode(vnode.text);
    }

    updateEventListeners(vnode);
    updateClass(vnode);
    updateAttrs(vnode);
    return vnode.elm;
}

function node(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;

    return {
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key
    };
}

function h(sel, b, c) {
    var data = {};
    var children;
    var text;
    var i;

    if (arguments.length === 3) {
        data = b;
        if (is.array(c)) {
            children = c;
        } else if (is.primitive(c)) {
            text = c;
        }
    } else if (arguments.length === 2) {
        if (is.array(b)) {
            children = b;
        } else if (is.primitive(b)) {
            text = b;
        } else {
            data = b;
        }
    }
    if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i])) {
                children[i] = createElement(node(undefined, undefined, undefined, children[i]));
            }
        }
    }

    return createElement(node(sel, data, children, text, undefined));
}

module.exports = h;
