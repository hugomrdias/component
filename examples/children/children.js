'use strict';

var { Component, h, helpers } = require('./../../src/component-simple.js');
var { div } = helpers;
var item = require('./../components/menu-item.js');
var menu = require('./../components/menu.js');
var selectize = require('./../components/selectize.js');

module.exports = Component.create({
    init: function() {
        this.componentName = 'children';
    },

    render: function(props, { onclick, onselect }, children) {
        return div('#drop', [
            h('span', 'selected: ' + props.selected),
            h('hr'),
            menu({}, [
                item({
                    selected: props.selected === 'test1',
                    onClick: () => props.selected === 'test1' ? onclick('') : onclick('test1'),
                    showIcon: true
                }, 'test1'),
                item({
                    showIcon: true,
                    onClick: () => onclick('test2'),
                    selected: props.selected === 'test2'
                }, 'test2')
            ]),
            h('hr'),
            h('div', 'selected: ' + props.select),
            h('button', {
                on: {
                    click: () => onselect(11)
                }
            }, 'change'),
            selectize({ onselect, select: props.select })
        ]);
    }
});
