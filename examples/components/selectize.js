'use strict';

const h = require('snabbdom/h');
const $ = require('jquery');
const selectize = require('selectize');

module.exports = function selectize({ onselect, select }, children = '') {
    return h('select#selectize', {
        hook: {
            insert: vnode => {
                $(vnode.elm).selectize({
                    allowEmptyOption: true,
                    selectOnTab: true,
                    valueField: 'id',
                    labelField: 'name',
                    searchField: ['id', 'name'],
                    sortField: [
                        { field: 'name', direction: 'asc' },
                        { field: 'id', direction: 'asc' }
                    ],
                    options: [
                        { name: 'NorteShopping', id: 1 },
                        { name: 'SportZone NorteShopping', id: 11 },
                        { name: 'SportZone NorteShopping 2', id: 111 }
                    ]
                });
                let selectize = vnode.elm.selectize;

                vnode.selectize = selectize;
                selectize.on('change', value => onselect(value));
                // selectize.on('destroy', () => console.log('destroy'));
                selectize.on('dropdown_open', function() { this.clear(true) });
                selectize.on('blur', function() {
                    if (!this.isFull()) {
                        this.setValue(select, true);
                    }
                });

                selectize.addItem(select, true);
            },
            prepatch: (prev, next) => {
                next.selectize = prev.selectize;
                prev.selectize = null;
                next.selectize.addItem(select, true);
            },

            destroy: vnode => vnode.selectize.destroy()
        }
    });
};
