'use strict';
var h = require('hyperscript');
var random = require('lodash/random');
var Component = exports.component = require('./src/component');
exports.app = require('./src/main.js');

exports.List = Component.create({
    init: function() {
        this.componentName = 'List';
        this.button = new exports.Button();
        this.buttonProps = { button: 'OK' };
    },

    template: function(compose) {
        return h('ul.antes#first.second', { style: 'background-color: red' },
            this.props.values.map(function(item) {
                return compose(exports.ListItem, { value: item });
            }),
            h('div#cenas',
                compose(this.button, this.buttonProps)
            )
        );
    },

    // afterRender: function() {
    //     var box = this.root.querySelector('#cenas').getBoundingClientRect();

    //     console.log(box);
    // },

    shouldUpdate: function(props, state) {
        this.button.render({ button: 'OK NOT' });
        return false;
    }
});

exports.ListItem = Component.create({
    init: function() {
        this.componentName = 'ListItem';
    },
    template: function() {
        var click = function(e) {
            this.render({ value: this.cid });
        }.bind(this);

        return h('li', { onclick: click }, this.props.value);
    },
    shouldUpdate: function(props, state) {
        if (this.props.value === props.value) {
            return false;
        }
        return true;
    }
});

exports.Button = Component.create({
    template: function() {
        return h('button', this.props.button);
    }
});
