'use strict';
var uniqueId = require('lodash/uniqueId');
var noop = require('lodash/noop');
var assign = require('lodash/assign');
var inherits = require('inherits');

function Component() {
    this.componentName = 'component';
    this.props = {};
    this.root = null;
    this.container = null;
    this.isMounted = false;
    this.rafMount = null;
    this.rafUpdate = null;
    this._components = [];
    this.init();
    this.cid = uniqueId(this.componentName + '_');
}

Component.create = function(proto) {
    var child = function() {
        Component.apply(this, arguments);
    };

    inherits(child, Component);
    assign(child.prototype, proto);
    return child;
};

Component.prototype.init = noop;

Component.prototype.render = noop;

Component.prototype.afterRender = noop;

Component.prototype.componentWillMount = function() {};

Component.prototype.componentDidMount = function() {};

Component.prototype.componentWillUnmount = function() {};

Component.prototype.componentWillUpdate = function() {};

Component.prototype.componentDidUpdate = function() {};

Component.prototype.shouldComponentUpdate = function(nextProps) {
    if (this.props === nextProps) {
        return false;
    }
    return true;
};

Component.prototype.unmount = function() {
    window.cancelAnimationFrame(this.rafMount);
    window.cancelAnimationFrame(this.rafUpdate);
    this.componentWillUnmount();
    this._clean();
    this.isMounted = false;
    console.log('Unmount', this.cid);
};

Component.prototype._clean = function() {
    this._components.forEach(function(comp) {
        comp.unmount();
    });
    this._components = [];
};

function compose(component, props, handlers) {
    var instance;

    if (component instanceof Component) {
        instance = component;
    } else if (component.super_ === Component) {
        instance = new component();
    } else {
        throw new Error('Must be instance of Component or inherit from Component');
    }

    this._components.push(instance);
    return instance.mount(props, handlers);
}

Component.prototype.update = function(nextProps, handlers) {
    var newRoot;
    var prevProps;

    window.cancelAnimationFrame(this.rafUpdate);
    if (typeof handlers !== 'undefined') {
        this.handlers = handlers;
    }

    if (this.isMounted) {
        if (this.shouldComponentUpdate(nextProps)) {
            this.componentWillUpdate(nextProps);
            console.debug('Update: ', this.cid, nextProps);
            this._clean();
            prevProps = this.props;
            this.props = nextProps;
            // Replace DOM
            this.container = this.root.parentNode;
            newRoot = this.render(compose.bind(this));
            this.container.replaceChild(newRoot, this.root);
            this.root = newRoot;
            // Send update to the next tick
            this.rafUpdate = window.requestAnimationFrame(function() {
                this.componentDidUpdate(prevProps);
            }.bind(this));
        } else {
            console.log('Skiped: ', this.cid);
        }
    } else {
        console.warn('Why update when not mounted? ', this.cid);
    }
};

Component.prototype.mount = function(props, handlers) {
    window.cancelAnimationFrame(this.rafMount);

    console.debug('Render: ', this.cid, props);
    if (this.isMounted) {
        console.error('Render again?');
    }
    this.props = props;
    this.handlers = handlers;
    this.componentWillMount();
    this.root = this.render(compose.bind(this));
    // pass

    this.rafMount = window.requestAnimationFrame(function() {
        this.isMounted = true;
        this.componentDidMount();
    }.bind(this));
    return this.root;
};

module.exports = Component;
