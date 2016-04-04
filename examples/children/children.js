'use strict';

var { Component, h, helpers } = require('./../../index.js');
var { ul, div, button } = helpers;
var Dropdown = require('halo-dropdown');

module.exports = Component.create({
    init: function() {
        this.componentName = 'children';
    },
    componentDidMount: function() {
        this.dropdown = new Dropdown({
            toggle: '#toggle',
            autoClose: false
        });
    },
    componentWillUnmount: function() {
        this.dropdown.destroy();
    },
    render: function(props, handlers, children) {
        console.log(props, handlers, children);
        return div('#drop', [
            button({
                on: {
                    click: () => handlers.onclick('three')
                }
            }, 'change selected'),
            h('hr'),
            h('span', 'selected: ' + this.props.selected),
            h('hr'),
            button('#toggle', {
                attrs: { 'data-dropdown': '#drop-children' }
            }, 'Menu'),
            ul('#drop-children.Dropdown', children.map(child => {
                if (child.sel === 'li#one') {
                    child.data.on = {
                        click: () => handlers.onclick('two')
                    };
                }

                if (child.sel === ('li#' + this.props.selected)) {
                    child.text = child.text + ' selected';
                }

                return child;
            }))
        ]);
    }
});
