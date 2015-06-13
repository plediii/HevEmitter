/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var H = require('../index').EventEmitter;
var routes = require('./routes');

describe('HevEmitter removeListener', function () {

    var h;
    beforeEach(function () {
        h = new H();
    });

    var shouldBeDeletedAt = function (onRoute, deleteRoute) {
        it('should not receive at ' + '"' + onRoute.join('/') + '" after deleting at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            h.on(onRoute, f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute, f);
            assert(!h.emit(onRoute, msg), 'unexpectedly emitted after removal');
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not receive at ' + '"' + onRoute.join('/') + '" after deleting at "' + deleteRoute.join('/') + '" when deleting by handle', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            var g = f.listener = function () {};
            h.on(onRoute, f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute, g);
            assert(!h.emit(deleteRoute, msg), 'unexpectedly emitted after removal');
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not leak when deleting listeners ' + '"' + onRoute.join('/') + '" by route "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            assert(_.isEmpty(h._eventTree.hash), 'was not empty to start with');
            h.on(onRoute, f);
            h.removeListener(deleteRoute, f);
            assert(_.isEmpty(h._eventTree.hash), 'was not empty after removal');
        });
    };

    var shouldNotBeDeletedAt = function (onRoute, deleteRoute) {
        it('should receive at ' + '"' + onRoute.join('/') + '" after deleting at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            h.on(onRoute, f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute, f);
            assert(h.emit(onRoute, msg), 'was not emitted after mismatching removal');
            assert.equal(2, msg.emitted, 'was not called after mismatching removal');
        });
    };

    _.each(routes.deleteRoutes, function (args) {
        shouldBeDeletedAt.apply(null, args);
    });

    _.each(routes.notDeleteRoutes, function (args) {
        console.log('not delete ', args);
        shouldNotBeDeletedAt.apply(null, args);
    });

});
