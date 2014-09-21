/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter listeners', function () {

    it('should return a "name" listener for "name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['tiger'], listener);
        var listeners = h.listeners(['tiger']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return not return a "name" listener for different "name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['quarters'], listener);
        var listeners = h.listeners(['way']);
        assert.equal(0, listeners.length);
    });


    it('should return a "*" listener for "*"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['*'], listener);
        var listeners = h.listeners(['*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "*" listener for "name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['*'], listener);
        var listeners = h.listeners(['name']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name" listener for "*"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['else'], listener);
        var listeners = h.listeners(['*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });


    it('should return a "**" listener for "**"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['**'], listener);
        var listeners = h.listeners(['**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name" listener for "**"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['effect'], listener);
        var listeners = h.listeners(['**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "**" listener for "name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['**'], listener);
        var listeners = h.listeners(['shields']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "**" listener for "*"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['**'], listener);
        var listeners = h.listeners(['*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "*" listener for "**"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['*'], listener);
        var listeners = h.listeners(['**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/name" listener for "name/name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['we', 'know'], listener);
        var listeners = h.listeners(['we', 'know']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return not return a "name/name" listener for different "name/name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['scary', 'real'], listener);
        var listeners = h.listeners(['scary', 'ship']);
        assert.equal(0, listeners.length);
    });


    it('should return not return a "name/name" listener for different "*/name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['room', 'ship'], listener);
        var listeners = h.listeners(['*', 'being']);
        assert.equal(0, listeners.length);
    });

    it('should return a "name/name" listener for "*/name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['is', 'she'], listener);
        var listeners = h.listeners(['*', 'she']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/name" listener for "**"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['lets', 'see'], listener);
        var listeners = h.listeners(['**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });


    it('should return a "name/name" listener for "name/**"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['maybe', 'closet'], listener);
        var listeners = h.listeners(['maybe', '**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/name" listener for "name/name/**"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['wouldnt', 'let'], listener);
        var listeners = h.listeners(['wouldnt', 'let', '**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });


    it('should return a "name/name" listener for "name/*"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['young', 'children'], listener);
        var listeners = h.listeners(['young', '*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "*/name" listener for "*/name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['*', 'claire'], listener);
        var listeners = h.listeners(['*', 'claire']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/*" listener for "name/*"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['protect', '*'], listener);
        var listeners = h.listeners(['protect', '*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "**" listener for "name/name"', function () {
        var h = new H();
        var listener = function () {};
        h.on(['**'], listener);
        var listeners = h.listeners(['isabella', 'isabella']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });



});
