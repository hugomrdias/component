'use strict';
var Signal = require('mini-signals');
var uniqueId = require('lodash/uniqueId');
var noop = require('lodash/noop');
var assign = require('lodash/assign');
var inherits = require('inherits');
var hyper = require('snabbdom/h');
var helpers = require('hyperscript-helpers')(hyper);
var snabbdom = require('snabbdom');
var patch = snabbdom.init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners')
]);

function Component() {
    if (!(this instanceof Component)) {
        return new Component();
    }
    this.componentName = 'component';
    this.props = {};
    this.handlers = {};
    this.children = [];

    this.vnode = null;
    this.isMounted = false;
    this.thunk = null;

    this.signals = {
        willMount: new Signal(),
        didMount: new Signal(),
        willUpdate: new Signal(),
        didUpdate: new Signal(),
        willUnmount: new Signal()
    };
    this.init();
    this.cid = uniqueId(this.componentName + '_');
    // this.signals.willMount.add(() => console.debug('will mount', this.cid));
    this.signals.didMount.add(() => console.debug('did mount', this.cid));
    // this.signals.willUpdate.add(() => console.debug('will update', this.cid));
    this.signals.didUpdate.add(() => console.debug('did update', this.cid));
    this.signals.willUnmount.add(() => console.debug('will unmount', this.cid));
}
Component.create = function(proto) {
    var Child = function() {
        if (!(this instanceof Component)) {
            return new Child();
        }
        Component.apply(this, arguments);
    };

    inherits(Child, Component);
    assign(Child.prototype, proto);
    return Child;
};

Component.prototype.init = noop;

Component.prototype.render = noop;

Component.prototype.componentWillMount = noop;

Component.prototype.componentDidMount = noop;

Component.prototype.componentWillUnmount = noop;

Component.prototype.componentWillUpdate = noop;

Component.prototype.componentDidUpdate = noop;

Component.prototype.shouldComponentUpdate = function(nextProps, handlers, children) {
    if (this.props === nextProps) {
        return false;
    }
    return true;
};

Component.prototype.update = function(
    nextProps = this.props,
    handlers = this.handlers,
    children = this.children
) {
    if (this.thunk === null || !this.isMounted) {
        console.warn('Component is unmounted and you are trying to update!', this.cid);
        return this.vnode;
    }

    if (this.shouldComponentUpdate(nextProps, handlers, children)) {
        this.signals.willUpdate.dispatch(nextProps, handlers, children);
        this.componentWillUpdate(nextProps, handlers, children);
        // console.debug('Update: ', this.cid, nextProps);

        this.prepare(nextProps, handlers, children);
        patch(this.thunk.data.vnode, this.vnode);
    } else {
        console.debug('Skiped: ', this.cid);
    }
    return this.vnode;
};

Component.prototype.prepare = function(props, handlers, children) {
    this.props = props;
    this.handlers = handlers;
    this.children = children;

    this.vnode = this.render(this.props, this.handlers, this.children);
    if (!this.vnode) {
        console.warn('empty render ?!?');
    }

    // setup didMount and didUpdate
    hooks(this, this.vnode);
    return this.vnode;
};

Component.prototype.create = function(props, handlers, children) {
    this.thunk = hyper('thunk_' + this.cid, {
        hook: { init: init, prepatch: prepatch, destroy: destroy },
        instance: this,
        type: this.constructor,
        args: arguments
    });

    return this.thunk;
};

exports.Component = Component;

function hooks(context, vnode) {
    var compHooks = vnode.data.hook || {};
    var proxyHooks = {
        insert: compHooks.insert || noop,
        postpatch: compHooks.postpatch || noop
    };

    if (vnode.data.hook) {
        console.warn('Root vnode already has hooks defined, user defined hook will be proxied.');
    }

    compHooks.insert = function(vnode) {
        // console.log('insert ', context.cid);
        if (context.isMounted) {
            context.signals.didUpdate.dispatch();
            context.componentDidUpdate();
            context.thunk.data.vnode = vnode;
        } else {
            context.isMounted = true;
            context.signals.didMount.dispatch();
            context.componentDidMount();
        }
        proxyHooks.insert.apply(null, arguments);
    };

    compHooks.postpatch = function(old, newNode) {
        // console.debug('postpach ', context.cid, newNode);
        context.signals.didUpdate.dispatch();
        context.componentDidUpdate();
        context.thunk.data.vnode = newNode;
        proxyHooks.postpatch.apply(null, arguments);
    };

    vnode.data.hook = compHooks;
}

function init(vnode) {
    var instance = vnode.data.instance || vnode.data.type();

    // console.log('INIT thunk', vnode);

    instance.signals.willMount.dispatch();
    instance.componentWillMount();
    instance.thunk = vnode;

    vnode.data.vnode = instance.prepare.apply(instance, vnode.data.args);
    vnode.data.instance = instance;
}

function prepatch(oldVnode, vnode) {
    var instance = oldVnode.data.instance;
    var args = vnode.data.args;

    // console.log('prepatch old', oldVnode);
    // console.log('prepatch vnode', vnode);

    if (oldVnode.data.type === vnode.data.type) {
        console.warn('reuse');
        instance.thunk = vnode;

        vnode.data = oldVnode.data;
        vnode.data.vnode = instance.update.apply(instance, args);
        console.warn('finish reuse');
    } else {
        console.warn('didnt reuse');
    }
}

function destroy(vnode) {
    var instance = vnode.data.instance;

    instance.signals.willUnmount.dispatch();
    instance.componentWillUnmount();
    instance.isMounted = false;
    instance.thunk = null;
}

exports.reuse = function(name, fn) {
    var i;
    var args = [];

    for (i = 2; i < arguments.length; ++i) {
        args[i - 2] = arguments[i];
    }

    let thunk = hyper('reuse_thunk_' + name, {
        hook: { init: init, prepatch: prepatch, destroy: destroy },
        instance: null,
        type: fn,
        args: args
    });

    return thunk;
};

exports.h = function() {
    var component = arguments[0];
    var props = arguments[1] && arguments[1].props || {};
    var handlers = arguments[1] && arguments[1].on || {};
    var children = arguments[2];

    // TODO check swap children to arguments[1] if array
    // to allow undefined data object
    if (component.super_ === Component) {
        if (arguments[1] && arguments[1].key) {
            return exports.reuse(arguments[1].key, component, props, handlers, children);
        }
        return component().create(props, handlers, children);
    }
    return hyper.apply(null, arguments);
};

exports.helpers = helpers;

exports.mount = function(elem, comp, state) {
    var vnode = comp().create(state);
    var temp = document.createElement('span');

    temp.id = 'jaskhdjsahdkjahsdjk';
    patch(elem.appendChild(temp), vnode);
    return vnode;
};
