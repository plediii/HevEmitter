/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var H = require('../index').EventEmitter;
var routes = require('./routes');

describe('HevEmitter on listener', function () {

    var h;
    beforeEach(function () {
        h = new H();
    });

    var shouldReceive = function (onRoute, emitRoute) {
        it('should receive at ' + '"' + onRoute.join('/') + '" messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(emitRoute, msg));
            assert(h.emit(emitRoute, msg));
            assert.equal(2, msg.emitted);
        });
    };

    var shouldReceiveInOrder = function (firstRoute, secondRoute, emitRoute) {
        it('should receive at ' + '"' + firstRoute.join('/') + '" before "' + secondRoute.join('/') + '" on messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: [] };
            h.on(firstRoute, function (msg) {
                msg.emitted.push('a') 
            });
            h.on(secondRoute, function (msg) {
                msg.emitted.push('b') 
            });
            assert(h.emit(emitRoute, msg));
            assert.deepEqual(['a', 'b'], msg.emitted);
        });

        it('should receive at ' + '"' + firstRoute.join('/') + '" before "' + secondRoute.join('/') + '" on messages emitted to "' + emitRoute.join('/') + '" (opposite order)', function () {
            var msg = { emitted: [] };
            h.on(secondRoute, function (msg) {
                msg.emitted.push('b') 
            });
            h.on(firstRoute, function (msg) {
                msg.emitted.push('a') 
            });
            assert(h.emit(emitRoute, msg));
            assert.deepEqual(['a', 'b'], msg.emitted);
        });
    };


    var shouldNotReceive = function (onRoute, emitRoute) {
        it('should *not* receive at ' + '"' + onRoute.join('/') + '" messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(!h.emit(emitRoute, msg));
            assert(!h.emit(emitRoute, msg));
            assert.equal(0, msg.emitted);
        });
    };

    _.each(routes.matchRoutes, function (args) {
        shouldReceive.apply(null, args);
    });


    _.each(routes.notMatchRoutes, function (args) {
        shouldNotReceive.apply(null, args);
    });

    _.each(routes.matchOrders, function (args) {
        shouldReceiveInOrder.apply(null, args);
    });


});
