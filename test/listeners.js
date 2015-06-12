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

    var listenerShouldMatch = function (listenerRoute, matchRoute) {
        it('"' + listenerRoute.join('/') + '" should be returned by listeners of "' + matchRoute.join('/') + '"', function () {
            var f = function () {};
            h.on(listenerRoute, f);
            var l = h.listeners(matchRoute);
            assert.equal(1, listeners.length);
            assert(_.contains(l, f));
        });
    };

    var listenerShouldNotMatch = function (listenerRoute, matchRoute) {
        it('"' + listenerRoute.join('/') + '" should be returned by listeners of "' + matchRoute.join('/') + '"', function () {
            var f = function () {};
            h.on(listenerRoute, f);
            var l = h.listeners(matchRoute);
            assert.equal(0, listeners.length);
        });
    };

    _.each([
        [['name'], ['name']]
        , [['name'], ['*']]
        , [['name'], ['**']]
        , [['*'], ['name']]
        , [['*'], ['*']]
        , [['*'], ['**']]
        , [['**'], ['name']]
        , [['**'], ['*']]
        , [['**'], ['**']]

        , [['name', 'name2'], ['name', 'name2']]
        , [['name', 'name2'], ['*', 'name2']]
        , [['name', 'name2'], ['name', '*']]
        , [['name', 'name2'], ['**']]
        , [['name', 'name2'], ['name', '**']]

        , [['*', 'name2'], ['name', 'name2']]
        , [['*', 'name2'], ['*', 'name2']]
        , [['*', 'name2'], ['name', '*']]
        , [['*', 'name2'], ['**']]
        , [['*', 'name2'], ['name', '**']]

        , [['name', '*'], ['name', 'name2']]
        , [['name', '*'], ['*', 'name2']]
        , [['name', '*'], ['name', '*']]
        , [['name', '*'], ['**']]
        , [['name', '*'], ['name', '**']]

        , [['**'], ['name', 'name2']]
        , [['**'], ['*', 'name2']]
        , [['**'], ['name', '*']]
        , [['**'], ['**']]
        , [['**'], ['name', '**']]
    ], function (args) {
        listenerShouldMatch.apply(args);
    });

    _.each([
        [['name'], ['otherName']]
        , [['name'], ['name', '**']]

        , [['name', 'otherName'], ['name', 'anotherName']]
        , [['otherName', 'name'], ['anotherName', 'name']]
        , [['name', 'name2'], ['*', 'anotherName']]
        , [['name', 'name2'], ['anotherName', '*']]
        , [['name', 'name2'], ['anotherName', '**']]

        , [['*', 'name2'], ['name', 'anotherName']]
        , [['*', 'name2'], ['*', 'anotherName']]

        , [['name', '*'], ['anotherName', 'name2']]
        , [['name', '*'], ['anotherName', '*']]
        , [['name', '*'], ['**']]
        , [['name', '*'], ['anotherName', '**']]

        , [['name', 'name2'], ['name', 'name2', '**']]
        , [['name', 'name2'], ['*', 'name2', '**']]
        , [['name', 'name2'], ['name', '*', '**']]

        , [['*', 'name2'], ['name', 'name2', '**']]
        , [['*', 'name2'], ['*', 'name2', '**']]
        , [['*', 'name2'], ['name', '*', '**']]

        , [['name', '*'], ['name', 'name2', '**']]
        , [['name', '*'], ['*', 'name2', '**']]
        , [['name', '*'], ['name', '*', '**']]

        , [['name', 'name2', '**'], ['name', 'name2']]
        , [['name', 'name2', '**'], ['*', 'name2']]
        , [['name', 'name2', '**'], ['name', '*']]
        , [['name', 'name2', '**'], ['**']]
        , [['name', 'name2', '**'], ['name', '**']]

        , [['*', 'name2', '**'], ['name', 'name2']]
        , [['*', 'name2', '**'], ['*', 'name2']]
        , [['*', 'name2', '**'], ['name', '*']]
        , [['*', 'name2', '**'], ['**']]
        , [['*', 'name2', '**'], ['name', '**']]

        , [['name', '*', '**'], ['name', 'name2']]
        , [['name', '*', '**'], ['*', 'name2']]
        , [['name', '*', '**'], ['name', '*']]
        , [['name', '*', '**'], ['**']]
        , [['name', '*', '**'], ['name', '**']]

    ], function (args) {
        listenerNotShouldMatch.apply(args);
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

    // ** shoud no longer match empty set
    // it('should return a "name/name" listener for "name/name/**"', function () {
    //     var listener = function () {};
    //     h.on(['wouldnt', 'let'], listener);
    //     var listeners = h.listeners(['wouldnt', 'let', '**']);
    //     assert.equal(1, listeners.length);
    //     assert(_.contains(listeners, listener));
    // });

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
                assert(_.contains(l, f));
                assert(_.contains(l, g));
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

            it('should return specific and * listeners', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['*'], g);
                var l = h.listeners(['*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

            it('should return specific and * listeners in order', function () {
                var f = function () {};
                var g = function () {};
                h.on(['*'], g);
                h.on(['command'], f);
                var l = h.listeners(['*']);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should return specific and * listeners in order specified in opposite', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['*'], g);
                var l = h.listeners(['*']);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should return specific and * listeners in order on two level *', function () {
                var f = function () {};
                var g = function () {};
                h.on(['*', 'professor'], g);
                h.on(['command', 'professor'], f);
                var l = h.listeners(['*', 'professor']);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should return specific and * listeners in order specified in opposite', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command', 'professor'], f);
                h.on(['*', 'professor'], g);
                var l = h.listeners(['*', 'professor']);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });


            it('should return ** and * listeners in order on two level *', function () {
                var f = function () {};
                var g = function () {};
                h.on(['available', 'professor'], g);
                h.on(['**'], f);
                var l = h.listeners(['*', 'professor']);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, f) < _.indexOf(l, g));
            });

            it('should return ** and * listeners in order specified in opposite', function () {
                var f = function () {};
                var g = function () {};
                h.on(['**'], f);
                h.on(['available', 'professor'], g);
                var l = h.listeners(['*', 'professor']);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, f) < _.indexOf(l, g));
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
                var l = h.listeners(['*']);
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
                var l = h.listeners(['**']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

            it('should return specific and * listeners', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['*'], g);
                var l = h.listeners(['**']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

            it('should return specific and * listeners in order', function () {
                var f = function () {};
                var g = function () {};
                h.on(['Command'], f);
                h.on(['*'], g);
                var l = h.listeners(['**']);
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should return specific and * listeners in order specified in opposite', function () {
                var f = function () {};
                var g = function () {};
                h.on(['*'], g);
                h.on(['Command'], f);
                var l = h.listeners(['**']);
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should return ** and * listeners', function () {
                var f = function () {};
                var g = function () {};
                h.on(['**'], f);
                h.on(['*'], g);
                var l = h.listeners(['**']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

            it('should return ** and * listeners in order', function () {
                var f = function () {};
                var g = function () {};
                h.on(['**'], f);
                h.on(['*'], g);
                var l = h.listeners(['**']);
                assert(_.indexOf(l, f) < _.indexOf(l, g));
            });

            it('should return ** and * listeners in order specified in opposite', function () {
                var f = function () {};
                var g = function () {};
                h.on(['*'], g);
                h.on(['**'], f);
                var l = h.listeners(['**']);
                assert(_.indexOf(l, f) < _.indexOf(l, g));
            });

            it('should return specific and ** listeners', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['**'], g);
                var l = h.listeners(['**']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
            });

            it('should return specific and ** listeners in order', function () {
                var f = function () {};
                var g = function () {};
                h.on(['command'], f);
                h.on(['**'], g);
                var l = h.listeners(['**']);
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should return specific and ** listeners in order specified in opposite', function () {
                var f = function () {};
                var g = function () {};
                h.on(['**'], g);
                h.on(['command'], f);
                var l = h.listeners(['**']);
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

        });

    });

    describe('2 level listener', function () {

        describe('name/name', function () {

            it('should be returned for name/name', function () {
                var f = function () {};
                h.on(['bug', 'covers'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should not be returned for name/othername', function () {
                var f = function () {};
                h.on(['bug', 'coverz'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(0, l.length);
            });

            it('should not be returned for othername/name', function () {
                var f = function () {};
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['bug', 'coverz']);
                assert.equal(0, l.length);
            });

            it('should be returned for name/*', function () {
                var f = function () {};
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['bugz', '*']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for name/*, after name/*', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['bugz', '*'], g);
                var l = h.listeners(['bugz', '*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for name/*, after name/* (opposite order)', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['bugz', '*'], g);
                var l = h.listeners(['bugz', '*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });


            it('should be returned for name/*, after */name', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['*', 'coverz'], g);
                var l = h.listeners(['bugz', '*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for name/*, after */name, (opposite order)', function () {
                var f = function () {};
                var g = function () {};
                h.on(['*', 'coverz'], g);
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['bugz', '*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for name/*, after */**', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['*', '**'], g);
                var l = h.listeners(['bugz', '*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for name/*, after */**, (opposite order)', function () {
                var f = function () {};
                var g = function () {};
                h.on(['*', '**'], g);
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['bugz', '*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for name/*, after **', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['**'], g);
                var l = h.listeners(['bugz', '*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for name/*, after */**, (opposite order)', function () {
                var f = function () {};
                var g = function () {};
                h.on(['**'], g);
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['bugz', '*']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });


            it('should be returned for */name', function () {
                var f = function () {};
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });


            it('should be returned for */name, after name/*', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['bugz', '*'], g);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for */name, after name/* (opposite order)', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['bugz', '*'], g);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });


            it('should be returned for */name, after */name', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['bugz', '*'], g);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for */name, after */name, (opposite order)', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', '*'], g);
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for */name, after */**', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['*', '**'], g);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for */name, after */**, (opposite order)', function () {
                var f = function () {};
                var g = function () {};
                h.on(['*', '**'], g);
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });
            
            it('should be returned for */name, after **', function () {
                var f = function () {};
                var g = function () {};
                h.on(['bugz', 'coverz'], f);
                h.on(['**'], g);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for */name, after */**, (opposite order)', function () {
                var f = function () {};
                var g = function () {};
                h.on(['**'], g);
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(2, l.length);
                assert(_.contains(l, f));
                assert(_.contains(l, g));
                assert(_.indexOf(l, g) < _.indexOf(l, f));
            });

            it('should be returned for name/**', function () {
                var f = function () {};
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['bugz', '**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for **', function () {
                var f = function () {};
                h.on(['bugz', 'coverz'], f);
                var l = h.listeners(['**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            describe('ordering', function () {

                it('should come after name/*', function () {
                    var f = function () {};
                    var g = function () {};
                    h.on(['busy', '*'], g);
                    h.on(['busy', 'bug'], f);
                    var l = h.listeners(['**']);
                    assert(_.indexOf(l, g) < _.indexOf(l, f));
                });

                it('should come after name/* (other insertion order)', function () {
                    var f = function () {};
                    var g = function () {};
                    h.on(['busy', 'bug'], f);
                    h.on(['busy', '*'], g);
                    var l = h.listeners(['**']);
                    assert(_.indexOf(l, g) < _.indexOf(l, f));
                });

                it('should come after */name', function () {
                    var f = function () {};
                    var g = function () {};
                    h.on(['*', 'bug'], g);
                    h.on(['busy', 'bug'], f);
                    var l = h.listeners(['**']);
                    assert(_.indexOf(l, g) < _.indexOf(l, f));
                });

                it('should come after name/* (other insertion order)', function () {
                    var f = function () {};
                    var g = function () {};
                    h.on(['busy', 'bug'], f);
                    h.on(['busy', '*'], g);
                    var l = h.listeners(['**']);
                    assert(_.indexOf(l, g) < _.indexOf(l, f));
                });

            });

        });

        describe('*/name', function () {

            it('should be returned for name/name', function () {
                var f = function () {};
                h.on(['*', 'covers'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should not be returned for name/othername', function () {
                var f = function () {};
                h.on(['*', 'coverz'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(0, l.length);
            });

            it('should be returned for othername/name', function () {
                var f = function () {};
                h.on(['*', 'coverz'], f);
                var l = h.listeners(['bugz', 'coverz']);
                assert.equal(0, l.length);
            });

            it('should be returned for name/*', function () {
                var f = function () {};
                h.on(['*', 'coverz'], f);
                var l = h.listeners(['bugz', '*']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for */name', function () {
                var f = function () {};
                h.on(['*', 'coverz'], f);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for name/**', function () {
                var f = function () {};
                h.on(['*', 'coverz'], f);
                var l = h.listeners(['bugz', '**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for **', function () {
                var f = function () {};
                h.on(['*', 'coverz'], f);
                var l = h.listeners(['**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

        });

        describe('name/*', function () {

            it('should be returned for name/name', function () {
                var f = function () {};
                h.on(['bug', '*'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for name/othername', function () {
                var f = function () {};
                h.on(['bug', '*'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(1, l.length);
            });

            it('should not be returned for othername/name', function () {
                var f = function () {};
                h.on(['bug', '*'], f);
                var l = h.listeners(['bugz', 'coverz']);
                assert.equal(0, l.length);
            });

            it('should be returned for name/*', function () {
                var f = function () {};
                h.on(['bug', '*'], f);
                var l = h.listeners(['bug', '*']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for */name', function () {
                var f = function () {};
                h.on(['bug', '*'], f);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for name/**', function () {
                var f = function () {};
                h.on(['bug', '*'], f);
                var l = h.listeners(['bug', '**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for **', function () {
                var f = function () {};
                h.on(['bug', '*'], f);
                var l = h.listeners(['**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

        });

        describe('name/*', function () {

            it('should be returned for name/name', function () {
                var f = function () {};
                h.on(['bug', '**'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for name/othername', function () {
                var f = function () {};
                h.on(['bug', '**'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(1, l.length);
            });

            it('should not be returned for othername/name', function () {
                var f = function () {};
                h.on(['bug', '**'], f);
                var l = h.listeners(['bugz', 'coverz']);
                assert.equal(0, l.length);
            });

            it('should be returned for name/*', function () {
                var f = function () {};
                h.on(['bug', '**'], f);
                var l = h.listeners(['bug', '*']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for */name', function () {
                var f = function () {};
                h.on(['bug', '**'], f);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for name/**', function () {
                var f = function () {};
                h.on(['bug', '**'], f);
                var l = h.listeners(['bug', '**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for **', function () {
                var f = function () {};
                h.on(['bug', '**'], f);
                var l = h.listeners(['**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

        });

        describe('*/**', function () {

            it('should be returned for name/name', function () {
                var f = function () {};
                h.on(['*', '**'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for name/othername', function () {
                var f = function () {};
                h.on(['*', '**'], f);
                var l = h.listeners(['bug', 'covers']);
                assert.equal(1, l.length);
            });

            it('should be returned for name/*', function () {
                var f = function () {};
                h.on(['*', '**'], f);
                var l = h.listeners(['bug', '*']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for */name', function () {
                var f = function () {};
                h.on(['*', '**'], f);
                var l = h.listeners(['*', 'coverz']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for name/**', function () {
                var f = function () {};
                h.on(['*', '**'], f);
                var l = h.listeners(['bug', '**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should be returned for **', function () {
                var f = function () {};
                h.on(['*', '**'], f);
                var l = h.listeners(['**']);
                assert.equal(1, l.length);
                assert(_.contains(l, f));
            });

            it('should not be returned for **', function () {
                var f = function () {};
                h.on(['*', '**'], f);
                var l = h.listeners(['*']);
                assert.equal(0, l.length);
            });

        });

        describe('ordering', function () {

            /*

            name,* < name,name
            *,name < name,name
            *,** < name,name
            ** < name,name

            *, name < name,*
            *,** < name,*
            ** < name,*

            *,** < *,name 
            ** < *,name
            
            ** < *,**
            
              */

        });

    });

});
