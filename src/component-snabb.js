'use strict';

var snabbdom = require('snabbdom');
var patch = snabbdom.init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    require('snabbdom/modules/eventlisteners')
]);
var hyper = require('snabbdom/h');
var helpers = require('hyperscript-helpers')(hyper);
var Signal = require('mini-signals');
var uniqueId = require('lodash/uniqueId');
var noop = require('lodash/noop');
var assign = require('lodash/assign');
var clone = require('lodash/cloneDeep');
var inherits = require('inherits');

function Component() {
    if (!(this instanceof Component)) {
        return new Component();
    }
    this.componentName = 'component';
    this.props = {};
    this.vnode = null;
    this.thunk = false;
    this.mountedVnode = null;
    this.isMounted = false;
    this.signals = {
        willMount: new Signal(),
        didMount: new Signal(),
        willUpdate: new Signal(),
        didUpdate: new Signal(),
        willUnmount: new Signal()
    };
    this.init();
    this.cid = uniqueId(this.componentName + '_');
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

Component.prototype.shouldComponentUpdate = function(nextProps) {
    if (this.props === nextProps) {
        return false;
    }
    return true;
};

function hooks(context, vnode) {
    var compHooks = vnode.data.hook;

    if (vnode.data.hook) {
        console.warn('vnode vnode already has hooks defined');
    } else {
        compHooks = vnode.data.hook = {};
    }

    compHooks.create = function(emptyVNode, vnode) {
        // console.log('create', context.cid);
        if (context.thunk) {
            context.mountedVnode.data.vnode = vnode;
            context.mountedVnode.elm = vnode.elm;
        } else {
            context.mountedVnode = vnode;
        }

        if (!context.isMounted) {
            context.signals.willMount.dispatch();
            context.componentWillMount();
            console.debug('componentWillMount', context.cid);
        }
    };
    compHooks.insert = function(vnode) {
        // console.log('insert ', context.cid);
        if (context.isMounted) {
            context.signals.didUpdate.dispatch();
            context.componentDidUpdate();
            console.debug('componentDidUpdate ', context.cid);
        } else {
            context.isMounted = true;
            context.signals.didMount.dispatch();
            context.componentDidMount();
            console.debug('componentDidMount', context.cid);
        }
    };
    compHooks.destroy = function(vnode) {
        if (vnode === context.mountedVnode) {
            context.signals.willUnmount.dispatch();
            context.componentWillUnmount();
            context.isMounted = false;
            console.debug('unmount ', context.cid, vnode);
        }
    };
    compHooks.prepatch = function(old, newNode) {
        // console.debug('prepatch ', context.cid, clone(old), clone(newNode));
    };
    compHooks.postpatch = function(old, newNode) {
        // console.debug('postpach ', context.cid, newNode);
        context.signals.didUpdate.dispatch();
        context.componentDidUpdate();
        console.debug('componentDidUpdate ', context.cid);
    };
}

Component.prototype.mount = function(props, handlers) {
    // console.debug('Mount: ', this.cid, props);
    if (this.isMounted) {
        console.error('Render again?');
    }
    this.props = props;
    this.handlers = handlers;
    this.vnode = this.render(props, handlers);
    if (!this.vnode) {
        console.warn('empty render ?!?');
    }
    hooks(this, this.vnode);
    return this.vnode;
};

Component.prototype.update = function(nextProps, handlers) {
    var oldRoot = this.vnode;
    var vnode;

    // update handlers
    if (typeof handlers !== 'undefined') {
        this.handlers = handlers;
    }

    // protect update with empty props
    if (!nextProps) {
        nextProps = this.props;
    }

    if (this.isMounted) {
        if (this.shouldComponentUpdate(nextProps)) {
            this.signals.willUpdate.dispatch(nextProps);
            this.componentWillUpdate(nextProps);
            // console.debug('Update: ', this.cid, nextProps);
            this.props = nextProps;

            // Replace DOM
            vnode = this.render(this.props, this.handlers);
            if (!this.vnode) {
                console.warn('empty render ?!?');
            }
            hooks(this, vnode);
            this.vnode = patch(oldRoot, vnode);
            this.mountedVnode.data.vnode = this.vnode;
        } else {
            console.debug('Skiped: ', this.cid);
        }
    } else {
        console.warn('Why update when not mounted? ', this.cid);
    }
};

// module.exports.h = hyper;
module.exports.helpers = helpers;
module.exports.patch = patch;
module.exports.Component = Component;
module.exports.mount = function(elem, comp, state) {
    var vnode = comp().mount(state);
    var temp = document.createElement('span');
    temp.id = 'jaskhdjsahdkjahsdjk';
    patch(elem.appendChild(temp), vnode);
    return vnode;
};

module.exports.h = function() {
    var component = arguments[0];
    var props = arguments[1] && arguments[1].props || {};
    var handlers = arguments[1] && arguments[1].on || {};
    var children = arguments[2];

    if (component.super_ === Component) {
        if (props.key) {
            return exports.reuse(props.key, component, props, handlers, children);
        }
        return component().mount(props, handlers, children);
    }
    return hyper.apply(null, arguments);
};

function init(thunkVnode) {
    var data = thunkVnode.data;

    // console.log('INIT thunk', thunkVnode);
    thunkVnode.data.hook.destroy = function() {
        // console.log('destroy unmount', thunkVnode.sel, data.instance.cid);
        data.instance.signals.willUnmount.dispatch();
        data.instance.componentWillUnmount();
    };

    data.instance = data.type();
    data.instance.thunk = true;
    data.instance.mountedVnode = thunkVnode;
    data.instance.mount(data.args[0], data.args[1]);
    data.vnode = data.instance.vnode;
}

function prepatch(oldVnode, vnode) {
    var patch;
    // console.log('prepatch old', clone(oldVnode));
    // console.log('prepatch vnode', clone(vnode));

    if (oldVnode.data.type === vnode.data.type) {
        console.warn('reuse');
        oldVnode.data.instance.update(vnode.data.args[0], vnode.data.args[1]);
        console.warn('finish reuse');
        patch = oldVnode.data.instance.vnode;
        vnode.data = oldVnode.data;
        vnode.data.vnode = patch;
    } else {
        console.warn('didnt reuse');
    }
}

exports.reuse = function(name, fn /* args */ ) {
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
