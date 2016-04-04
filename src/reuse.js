'use strict';
var hyper = require('snabbdom/h');

function init(thunkVnode) {
    var data = thunkVnode.data;

    // console.log('INIT thunk', thunkVnode);
    thunkVnode.data.hook.destroy = function() {
        console.info('destroy unmount', thunkVnode.sel, data.instance.cid);
        data.instance.signals.willUnmount.dispatch();
        data.instance.componentWillUnmount();
        data.instance.isMounted = false;
    };

    data.instance = data.type();
    data.instance.thunk = true;
    data.instance.mountedVnode = thunkVnode;
    data.instance.mount.apply(data.instance, data.args);
    data.vnode = data.instance.vnode;
}

function prepatch(oldVnode, vnode) {
    var patch;
    // console.log('prepatch old', clone(oldVnode));
    // console.log('prepatch vnode', vnode);

    if (oldVnode.data.type === vnode.data.type) {
        console.warn('reuse');
        oldVnode.data.instance.update.apply(
            oldVnode.data.instance,
            vnode.data.args);
        console.warn('finish reuse');
        patch = oldVnode.data.instance.vnode;
        vnode.data = oldVnode.data;
        vnode.data.vnode = patch;
    } else {
        console.warn('didnt reuse');
    }
}

module.exports = function(name, fn) {
    var i;
    var args = [];

    for (i = 2; i < arguments.length; ++i) {
        args[i - 2] = arguments[i];
    }

    return hyper('thunk' + name, {
        hook: { init: init, prepatch: prepatch },
        instance: null,
        type: fn,
        args: args
    });
};
