/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var H = require('../index').EventEmitter;
var routes = require('./routes');

describe('HevEmitter removeAllListners', function () {

    var h;
    beforeEach(function () {
        h = new H();
    });

    var shouldBeDeletedAt = function (onRoute, deleteRoute) {
        it('should not receive at ' + '"' + onRoute.join('/') + '" after deleting all listeners at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeAllListeners(deleteRoute);
            assert(!h.emit(onRoute, msg), 'unexpectedly emitted after removal');
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not leak when deleting all listeners ' + '"' + onRoute.join('/') + '" by route "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            assert(_.isEmpty(h._eventTree.hash), 'was not empty to start with');
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(!_.isEmpty(h._eventTree.hash), 'was empty even after adding listener');
            h.removeAllListeners(deleteRoute);
            assert(_.isEmpty(h._eventTree.hash), 'was not empty after removal');
        });
    };

    var shouldNotBeDeletedAt = function (onRoute, deleteRoute) {
        it('should receive at ' + '"' + onRoute.join('/') + '" after deleting at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeAllListeners(deleteRoute);
            assert(h.emit(onRoute, msg), 'was not emitted after mismatching removal');
            assert.equal(2, msg.emitted, 'was not called after mismatching removal');
        });
    };

    _.each(routes.deleteRoutes, function (args) {
        shouldBeDeletedAt.apply(null, args);
    });

    _.each(routes.notDeleteRoutes, function (args) {
        shouldNotBeDeletedAt.apply(null, args);
    });

});
