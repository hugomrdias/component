'use strict';
const h = require('snabbdom/h');
var { div } = require('hyperscript-helpers')(h);
var dividerComp = require('./../src/components/divider.js');
var buttonComp = require('./../src/components/button.js');

module.exports = function() {
    function log(e) {
        console.log('log event', e);
    }
    return div('#main', [
        buttonComp({ flat: true, type: 'submit' }, 'Submit'),
        dividerComp(),
        buttonComp({ flat: false, onClick: log }, 'Go'),
        dividerComp(),
        buttonComp({ flat: false }, 'Disabled')
    ]);
};
