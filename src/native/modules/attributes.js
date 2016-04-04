'use strict';

var booleanAttrs = ['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'compact', 'controls', 'declare',
    'default', 'defaultchecked', 'defaultmuted', 'defaultselected', 'defer', 'disabled', 'draggable',
    'enabled', 'formnovalidate', 'hidden', 'indeterminate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple',
    'muted', 'nohref', 'noresize', 'noshade', 'novalidate', 'nowrap', 'open', 'pauseonexit', 'readonly',
    'required', 'reversed', 'scoped', 'seamless', 'selected', 'sortable', 'spellcheck', 'translate',
    'truespeed', 'typemustmatch', 'visible'
];
var booleanAttrsDict = {};
var i;
var len;

for (i = 0, len = booleanAttrs.length; i < len; i++) {
    booleanAttrsDict[booleanAttrs[i]] = true;
}

module.exports = function updateAttrs(vnode) {
    var elm = vnode.elm;
    var attrs = vnode.data ? vnode.data.attrs : null;
    var cur;

    for (name in attrs) {
        cur = attrs[name];
        if (!cur && booleanAttrsDict[name]) {
            // skip
        } else {
            elm.setAttribute(name, cur);
        }
    }
};
