'use strict';

const h = require('snabbdom/h');
const check = require('./icons/icon-check.js');
const Dropdown = require('halo-dropdown');

module.exports = function MenuItem({
    icon,
    onClick
}, children = '') {
    return h('div.Menu', [
        h('button.Menu-toggle', {
            attrs: { 'data-dropdown': '.Dropdown' },
            hook: {
                insert: vnode => {
                    vnode.dropdown = new Dropdown({
                        toggle: vnode.elm,
                        autoClose: false
                    });
                },
                prepatch: (prev, next) => {
                    next.dropdown = prev.dropdown;
                    prev.dropdown = null;
                },

                destroy: vnode => vnode.dropdown.destroy()
            }
        }, [check({}), 'Menu']),
        h('div.Dropdown', children)
    ]);
};
