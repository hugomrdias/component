'use strict';
var uniqueId = require('lodash/uniqueId');
var noop = require('lodash/noop');
var assign = require('lodash/assign');
var isNil = require('lodash/isNil');
var filter = require('lodash/filter');
var inherits = require('inherits');
var isEqual = require('lodash/isEqualWith');
var isFunction = require(('lodash/isFunction'))
var customizer = function(obj1, obj2) {
    if (isFunction(obj1) && isFunction(obj2)) {
        return true
    }
}

function Component(props, state) {
    this.componentName = 'component';
    this.props = props;
    this.state = state;
    this.root = null;
    this.container = null;
    this.isMounted = false;
    this.raf = null;
    this._components = [];
    this._renderIndex = -1;
    this.init();
    this.cid = uniqueId(this.componentName + '_');
}

Component.create = function(proto) {
    var child = function() {
        Component.apply(this, arguments);
    };

    inherits(child, Component);
    assign(child.prototype, proto);
    child.render = function(props, state) {
        if (!(this instanceof child)) {
            return new child().render(props, state);
        }
    };
    return child;
};

Component.prototype.init = noop;

Component.prototype.template = noop;

Component.prototype.afterRender = noop;

Component.prototype.componentWillMount = function() {
    // console.log('Will Mount', this.cid);
};
Component.prototype.componentDidMount = function() {
    // console.log('Mount', this.cid);
};

Component.prototype.componentWillUnmount = function() {
    console.log('Unmount', this.cid);
};

Component.prototype.shouldUpdate = function(props, state) {
    if (isEqual(this.props, props, customizer)) {
        return false;
    }
    return true;
};

Component.prototype._clean = function() {
    this.componentWillUnmount();
    this._components.forEach(function(comp) {
        comp._clean();
    });
    this._components = [];
};

function compose(component, props, key) {
    var cached;
    var instance;

    this._renderIndex += 1;
    cached = this._components[this._renderIndex];

    if (component instanceof Component) {
        instance = component;
        if (cached && cached.instance !== instance) {
            cached.instance._clean();
        }
        this._components[this._renderIndex] = { id: instance.cid, instance: instance };
    } else if (component.super_ === Component) {
        if (cached && cached.instance instanceof component) {
            console.debug('Re-using cached: ' + cached.id);
            instance = cached.instance;
        } else {
            instance = new component();
            if (cached) {
                cached.instance._clean();
            }
            this._components[this._renderIndex] = { id: instance.cid, instance: instance };
        }
    } else {
        throw new Error('Must be instance of Component or inherit from Component');
    }

    return instance.render(props);
}

function cleanup(components, renderIndex) {
    return filter(components, function(value, index) {
        if (index > renderIndex) {
            value.instance._clean();
            return false;
        }
        return true;
    });
}

Component.prototype.render = function(props, state) {
    var newRoot;

    this._renderIndex = -1;
    if (isNil(props)) {
        props = this.props;
    }

    if (isNil(state)) {
        state = this.state;
    }
    window.cancelAnimationFrame(this.raf);

    if (this.isMounted) {
        if (this.shouldUpdate(props, state)) {
            this.props = props;
            this.state = state;
            this.container = this.root.parentNode;
            newRoot = this.template(compose.bind(this));
            this.container.replaceChild(newRoot, this.root);
            this.root = newRoot;
            this._components = cleanup(this._components, this._renderIndex);
            console.log('Updated: ', this.cid, this.props);
        } else {
            console.log('Skiped render: ', this.cid);
            // return this.root;
        }
    } else {
        this.state = state;
        this.props = props;
        this.componentWillMount();
        this.root = this.template(compose.bind(this));
        this.isMounted = true;
        this.componentDidMount();
    }

    this.raf = window.requestAnimationFrame(this.afterRender.bind(this));
    return this.root;
};

module.exports = Component;
