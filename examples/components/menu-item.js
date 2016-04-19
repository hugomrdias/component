'use strict';

const h = require('snabbdom/h');
const noop = require('lodash/noop');
const check = require('./icons/icon-check.js');

module.exports = function MenuItem({
    icon,
    selected = false,
    showIcon = false,
    onClick
}, children = '') {
    function iconNode() {
        if (showIcon) {
            const iconElm = selected ? check({ width: 16, height: 16 }) : icon;

            return h('span', [iconElm || '\u00A0']);
        }
        return h('span', '');
    }

    return h('div.Menu-item', {
        on: {
            click: onClick || noop
        }
    }, [
        iconNode(),
        h('span', children)
    ]);
};
