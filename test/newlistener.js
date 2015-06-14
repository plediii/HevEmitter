/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

var routes = require('./routes');

describe('HevEmitter newlistener', function () {

    var h;
    beforeEach(function () {
        h = new H();
    });

    describe('on events', function () {

        var shouldReceive = function (onRoute, emitRoute) {
            it('should receive at ' + '"' + onRoute.join('/') + '" when listeners are added at "' + emitRoute.join('/') + '"', function () {
                var count = 0;
                h.on(onRoute, function (msg) {
                    count++;
                });
                assert.equal(0, count);
                h.on(emitRoute, function () {});
                assert.equal(1, count);
            });

            it('should receive listener route at ' + '"' + onRoute.join('/') + '" when listeners are added at "' + emitRoute.join('/') + '"', function (done) {
                h.on(onRoute, function (route) {
                    assert.deepEqual(route, emitRoute);
                    done();
                });
                h.on(emitRoute, function () {});
            });

            it('should receive listener function at ' + '"' + onRoute.join('/') + '" when listeners are added at "' + emitRoute.join('/') + '"', function (done) {
                var f = function () {};
                h.on(onRoute, function (route, g) {
                    assert.equal(f, g);
                    done();
                });
                h.on(emitRoute, f);
            });
        };  

        var shouldNotReceive = function (onRoute, emitRoute) {
            it('should *not* receive at ' + '"' + onRoute.join('/') + '" when listeners are added at "' + emitRoute.join('/') + '"', function () {
                var count = 0;
                h.on(onRoute, function (msg) {
                    count++;
                });
                assert.equal(0, count);
                h.on(emitRoute, function () {});
                assert.equal(0, count);
            });
        };

        var shouldBeDeleted = function (onRoute, emitRoute) {
            it('should not receive at ' + '"' + onRoute.join('/') + '" when listeners are removed at "' + emitRoute.join('/') + '"', function () {
                var count = 0;
                var f = function (msg) {
                    count++;
                };
                h.on(onRoute, f);
                assert.equal(0, count);
                h.on(onRoute, function () {});
                assert.equal(1, count, 'listener was not called to begin with');
                h.removeListener(emitRoute, f);
                assert.equal(1, count, 'listener was called again after removal');
            });

            it('should not receive at ' + '"' + onRoute.join('/') + '" when listeners are removed at "' + emitRoute.join('/') + '"', function () {
                var count = 0;
                h.on(onRoute, function (msg) {
                    count++;
                });
                assert.equal(0, count);
                h.on(onRoute, function () {});
                assert.equal(1, count, 'listener was not called to begin with');
                h.removeAllListeners(emitRoute);
                assert.equal(1, count, 'listener was called again after removal');
            });
        };

        _.each(_.map(routes.matchRoutes, function (basicMatch) {
            return [['newListener'], basicMatch[1]];
        }).concat(_.map(routes.matchRoutes, function (basicMatch) {
            return [['newListener'].concat(basicMatch[0]), basicMatch[1]];
        })), function (args) {
            shouldReceive.apply(null, args);
        });

        _.each(_.map(routes.matchRoutes, function (basicMatch) {
            return [['newListener'].concat(basicMatch[0]), basicMatch[1]];
        }), function (args) {
            var listenRoute = args[0];
            shouldNotReceive.apply(null, args);
        });

    });

});
