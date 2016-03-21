'use strict';
var camelCase = require('camelcase');
var Utils = {};
var style = document.createElement('p').style;
var prefixes = 'O ms Moz Webkit'.split(' ');
var hasPrefix = /^(o|ms|moz|webkit)/;
var upper = /([A-Z])/g;

Utils.cache = {};

Utils.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
};

Utils.prefixed = function(key) {
    var camelCaseKey = camelCase(key);
    var i = prefixes.length;
    var name;
    var capitalizedKey;

    if (typeof style[camelCaseKey] !== 'undefined') {
        return camelCaseKey;
    }

    capitalizedKey = Utils.capitalize(camelCaseKey);
    while (i--) {
        name = prefixes[i] + capitalizedKey;
        if (typeof style[name] !== 'undefined') {
            return name;
        }
    }

    return false;
};

// cache transform
Utils.cache.transform = Utils.prefixed('transform');

Utils.prefixedCSS = function(key) {
    var prefixedKey = Utils.prefixed(key);

    if (upper.test(prefixedKey)) {
        prefixedKey = (hasPrefix.test(prefixedKey) ? '-' : '') + prefixedKey.replace(upper, '-$1');
        return prefixedKey.toLowerCase();
    }

    return key;
};

Utils.prefix = (function() {
    var styles = window.getComputedStyle(document.documentElement, '');
    var pre = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];
    var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

    return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
    };
})();

Utils.insertSheet = function insertSheet(id) {
    var style = document.createElement('style');

    style.id = id;

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")

    // WebKit hack :(
    style.appendChild(document.createTextNode(''));

    // Add the <style> element to the page
    document.head.appendChild(style);

    return style;
};

Utils.calculateWebkitFill = function calculateWebkitFill(element, selector, activeClass, colorLower, colorUpper, colorUpperActive) {
    var gradValue = Math.round((element.value / element.getAttribute('max') * 1) * 100);
    var grad = 'linear-gradient(90deg,' + colorLower + ' ' + gradValue + '%,' + colorUpper + ' ' + (gradValue + 1) + '%)';
    var gradActive = 'linear-gradient(90deg,' + colorLower + ' ' + gradValue + '%,' + colorUpperActive + ' ' + (gradValue + 1) + '%)';
    var styleString = '';

    styleString += selector + '::-webkit-slider-runnable-track {background: ' + grad + ';} ';
    styleString += selector + ':focus:not(:active)::-webkit-slider-runnable-track,' +
        '.' + activeClass + ' > ' + selector + '::-webkit-slider-runnable-track,' +
        selector + ':active::-webkit-slider-runnable-track {background: ' + gradActive + ';} ';

    return styleString;
};

Utils.translateTooltip = function translateTooltip(input, tooltip, thumbWidth) {
    var width = input.offsetWidth;
    var offset = tooltip.offsetWidth / 2 - thumbWidth / 2;
    var newPoint = (input.value - input.getAttribute('min')) / (input.getAttribute('max') - input.getAttribute('min'));
    var newPlace;

    if (newPoint < 0) {
        newPlace = 0;
    } else if (newPoint > 1) {
        newPlace = width;
    } else {
        newPlace = width * newPoint - (offset + (thumbWidth * newPoint));
    }

    tooltip.style[Utils.cache.transform] = 'translateX(' + newPlace + 'px)';
};

Utils.simulateEvent = function eventFire(el, etype) {
    var evObj;

    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
};

module.exports = Utils;
