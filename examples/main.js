'use strict';
var { Component, mount } = require('./../src/component-simple.js');
var { store, dispatch } = require('./store.js');
var root = document.getElementById('root');
var App;

Component.store = store;
Component.dispatch = dispatch;

App = require('./app.js');
mount(root, App, store.getState().examples);
