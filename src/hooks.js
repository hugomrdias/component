'use strict';
var noop = require('lodash/noop');

function copyToThunk(vnode, thunk) {
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
    thunk.sel = vnode.sel;
    // thunk.custom = 'CUSTOM';
}

exports.root = {
    init: function init(thunk) {
        var instance = thunk.data.instance || thunk.data.type();
        instance.key = thunk.key;
        var vnode = instance.prepare.apply(instance, thunk.data.args);
        console.log('INIT thunk', vnode, thunk);
        copyToThunk(vnode, thunk)
        instance.vnode = thunk;
        instance.signals.willMount.dispatch();
        instance.componentWillMount();
    },

    prepatch: function prepatch(oldVnode, vnode) {
        var instance = oldVnode.data.instance;
        var args = vnode.data.args;

        // console.log('PREPATCH', clone(oldVnode), clone(vnode));

        if (oldVnode.data.type === vnode.data.type) {
            console.warn('reuse');

            var vnode2 = instance.update.apply(instance, args);
            copyToThunk(vnode2, vnode)
            instance.vnode = vnode;
            console.warn('finish reuse');
        } else {
            console.warn('didnt reuse');
        }
    },

};

exports.vnode = function hooks(context, vnode) {
    var compHooks = vnode.data.hook || {};
    var proxyHooks = {
        insert: compHooks.insert || noop,
        postpatch: compHooks.postpatch || noop
    };

    if (vnode.data.hook) {
        console.warn('Root vnode already has hooks defined, user defined hook will be proxied.');
    }

    vnode.data.instance = context;
    vnode.data.type = context.constructor;
    vnode.key = context.key;

    compHooks.init = function init(vnode) {
        console.debug('init')
        context.signals.willMount.dispatch();
        context.componentWillMount();
    };

    compHooks.insert = function(vnode) {
        console.debug('insert ', context.cid, vnode);
        if (context.isMounted) {
            context.signals.didUpdate.dispatch();
            context.componentDidUpdate();
            // context.vnode = vnode;
        } else {
            context.isMounted = true;
            context.signals.didMount.dispatch();
            context.componentDidMount();
        }
        proxyHooks.insert.apply(null, arguments);
    };

    compHooks.postpatch = function(old, newNode) {
        console.debug('postpatch ', context.cid, newNode);
        context.signals.didUpdate.dispatch();
        context.componentDidUpdate();
        // context.root.children[0] = newNode;
        proxyHooks.postpatch.apply(null, arguments);
    };

    compHooks.destroy = function destroy(vnode) {
        context.signals.willUnmount.dispatch();
        context.componentWillUnmount();
        context.isMounted = false;
    }

    vnode.data.hook = compHooks;
}
