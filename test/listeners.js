/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter listeners', function () {
    var h;

    beforeEach(function () {
        h = new H();
    });


    it('should return a "name" listener for "name"', function () {
        var listener = function () {};
        h.on(['tiger'], listener);
        var listeners = h.listeners(['tiger']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return not return a "name" listener for different "name"', function () {
        var listener = function () {};
        h.on(['quarters'], listener);
        var listeners = h.listeners(['way']);
        assert.equal(0, listeners.length);
    });


    it('should return a "*" listener for "*"', function () {
        var listener = function () {};
        h.on(['*'], listener);
        var listeners = h.listeners(['*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "*" listener for "name"', function () {
        var listener = function () {};
        h.on(['*'], listener);
        var listeners = h.listeners(['name']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name" listener for "*"', function () {
        var listener = function () {};
        h.on(['else'], listener);
        var listeners = h.listeners(['*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });


    it('should return a "**" listener for "**"', function () {
        var listener = function () {};
        h.on(['**'], listener);
        var listeners = h.listeners(['**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name" listener for "**"', function () {
        var listener = function () {};
        h.on(['effect'], listener);
        var listeners = h.listeners(['**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "**" listener for "name"', function () {
        var listener = function () {};
        h.on(['**'], listener);
        var listeners = h.listeners(['shields']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "**" listener for "*"', function () {
        var listener = function () {};
        h.on(['**'], listener);
        var listeners = h.listeners(['*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "*" listener for "**"', function () {
        var listener = function () {};
        h.on(['*'], listener);
        var listeners = h.listeners(['**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/name" listener for "name/name"', function () {
        var listener = function () {};
        h.on(['we', 'know'], listener);
        var listeners = h.listeners(['we', 'know']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return not return a "name/name" listener for different "name/name"', function () {
        var listener = function () {};
        h.on(['scary', 'real'], listener);
        var listeners = h.listeners(['scary', 'ship']);
        assert.equal(0, listeners.length);
    });

    it('should return not return a "name/name" listener for different "*/name"', function () {
        var listener = function () {};
        h.on(['room', 'ship'], listener);
        var listeners = h.listeners(['*', 'being']);
        assert.equal(0, listeners.length);
    });

    it('should return a "name/name" listener for "*/name"', function () {
        var listener = function () {};
        h.on(['is', 'she'], listener);
        var listeners = h.listeners(['*', 'she']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/name" listener for "**"', function () {
        var listener = function () {};
        h.on(['lets', 'see'], listener);
        var listeners = h.listeners(['**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });


    it('should return a "name/name" listener for "name/**"', function () {
        var listener = function () {};
        h.on(['maybe', 'closet'], listener);
        var listeners = h.listeners(['maybe', '**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/name" listener for "name/name/**"', function () {
        var listener = function () {};
        h.on(['wouldnt', 'let'], listener);
        var listeners = h.listeners(['wouldnt', 'let', '**']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/name" listener for "name/*"', function () {
        var listener = function () {};
        h.on(['young', 'children'], listener);
        var listeners = h.listeners(['young', '*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "*/name" listener for "*/name"', function () {
        var listener = function () {};
        h.on(['*', 'claire'], listener);
        var listeners = h.listeners(['*', 'claire']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "name/*" listener for "name/*"', function () {
        var listener = function () {};
        h.on(['protect', '*'], listener);
        var listeners = h.listeners(['protect', '*']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    it('should return a "**" listener for "name/name"', function () {
        var listener = function () {};
        h.on(['**'], listener);
        var listeners = h.listeners(['isabella', 'isabella']);
        assert.equal(1, listeners.length);
        assert(_.contains(listeners, listener));
    });

    describe('1 level listener', function () {
        
        describe('listing specific listener', function () {

            it('should return a single "on" listener', function () {
                var f = function () {};
                h.on(['command'], f);
                var l = h.listeners(['command']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should return two "on" listeners', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['command'], g);
                var l = h.listeners(['command']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

            it('should return two "on" listeners in order', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['command'], g);
                var l = h.listeners(['command']);
                assert(_.indexOf(l, f) < _.indexOf(l, g));
            });

            it('should not return other "on" listener', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['me'], g);
                var l = h.listeners(['command']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

        });

        describe('listing * listener', function () {

            it('should return a single "on" listener', function () {
                var f = function () {};
                h.on(['command'], f);
                var l = h.listeners(['*']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should return two "on" listeners', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['command'], g);
                var l = h.listeners(['*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

            it('should return two "on" listeners in order', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['command'], g);
                var l = h.listeners(['*']);
                assert(_.indexOf(l, f) < _.indexOf(l, g));
            });

            it('should return other "on" listener', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['me'], g);
                var l = h.listeners(['command']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

        });

        describe('listing ** listener', function () {

            it('should return a single "on" listener', function () {
                var f = function () {};
                h.on(['command'], f);
                var l = h.listeners(['**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should return two "on" listeners', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['command'], g);
                var l = h.listeners(['**']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

            it('should return two "on" listeners in order', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['command'], g);
                var l = h.listeners(['**']);
                assert(_.indexOf(l, f) < _.indexOf(l, g));
            });

            it('should return other "on" listener', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['me'], g);
                var l = h.listeners(['command']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

        });

    });

});
