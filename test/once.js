/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var H = require('../index').EventEmitter;
var routes = require('./routes');

describe('HevEmitter once listener', function () {

    var h;
    beforeEach(function () {
        h = new H();
    });

    var shouldReceiveOnce = function (onRoute, emitRoute) {
        it('should receive once at ' + '"' + onRoute.join('/') + '" messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.once(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert.equal(0, msg.emitted, 'bad initial state');
            assert(h.emit(emitRoute, msg), 'did not emit as expected');
            assert.equal(1, msg.emitted, 'method was not called once');
            assert(!h.emit(emitRoute, msg), 'unexpectedly emitted a second time');
            assert.equal(1, msg.emitted, 'method was called a second time');
        });

        it('should receive at ' + '"' + onRoute.join('/') + '" messages emitted with multiple arguments to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.once(onRoute, function (a, msg) {
                assert.equal(a, 'a');
                msg.emitted += 1;
            });
            assert.equal(0, msg.emitted, 'bad initial state');
            assert(h.emit(emitRoute, 'a', msg), 'did not emit as expected');
            assert.equal(1, msg.emitted, 'method was not called');
            assert(!h.emit(emitRoute, 'a', msg), 'unexpectedly emitted a second time');
            assert.equal(1, msg.emitted, 'method was called a second time');
        });

        it('should not leak once listener at ' + '"' + onRoute.join('/') + '" after messages to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            assert(_.isEmpty(h._eventTree.hash), 'was not empty to start with');
            h.once(onRoute, function (a, msg) {
                assert.equal(a, 'a');
                msg.emitted += 1;
            });
            assert(!_.isEmpty(h._eventTree.hash), 'was not empty after adding listener');
            assert(h.emit(emitRoute, 'a', msg), 'did not emit as expected');
            assert(_.isEmpty(h._eventTree.hash), 'listener was leaked after triggering once');
        });

    };

    var shouldReceiveInOrder = function (firstRoute, secondRoute, emitRoute) {
        it('should receive at ' + '"' + firstRoute.join('/') + '" before "' + secondRoute.join('/') + '" on messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: [] };
            h.once(firstRoute, function (msg) {
                msg.emitted.push('a') 
            });
            h.once(secondRoute, function (msg) {
                msg.emitted.push('b') 
            });
            assert(h.emit(emitRoute, msg), 'did not emit as expected');
            assert.deepEqual(['a', 'b'], msg.emitted, 'did not receive events in order');
        });

        it('should receive at ' + '"' + firstRoute.join('/') + '" before "' + secondRoute.join('/') + '" on messages emitted to "' + emitRoute.join('/') + '" (opposite order)', function () {
            var msg = { emitted: [] };
            h.once(secondRoute, function (msg) {
                msg.emitted.push('b') 
            });
            h.once(firstRoute, function (msg) {
                msg.emitted.push('a') 
            });
            assert(h.emit(emitRoute, msg), 'did not emit as expected');
            assert.deepEqual(['a', 'b'], msg.emitted, 'did not receive events in order');
        });
    };


    var shouldNotReceive = function (onRoute, emitRoute) {
        it('should *not* receive at ' + '"' + onRoute.join('/') + '" messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.once(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(!h.emit(emitRoute, msg), 'unexpectedly emitted');
            assert.equal(0, msg.emitted, 'method was unexpectedly called');
        });
    };

    _.each(routes.matchRoutes, function (args) {
        shouldReceiveOnce.apply(null, args);
    });


    _.each(routes.notMatchRoutes, function (args) {
        shouldNotReceive.apply(null, args);
    });

    _.each(routes.matchOrders, function (args) {
        shouldReceiveInOrder.apply(null, args);
    });


});
