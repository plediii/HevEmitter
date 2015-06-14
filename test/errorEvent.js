/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var H = require('../index').EventEmitter;

describe('HevEmitter error', function () {
    
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

    var shouldNotReceive = function (onRoute, emitRoute) {
        it('should *not* receive at ' + '"' + onRoute.join('/') + '" messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            try {
                assert(!h.emit(emitRoute, msg));
                assert(!h.emit(emitRoute, msg));
            } catch (expected) {}
            assert.equal(0, msg.emitted);
        });
    };

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
            try {
                assert(!h.emit(onRoute, msg), 'unexpectedly emitted after removal');
            } catch (expected) {}
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
            try {
                assert(!h.emit(deleteRoute, msg), 'unexpectedly emitted after removal');
            } catch (expected) {}
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not leak when deleting listeners ' + '"' + onRoute.join('/') + '" by route "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            assert(_.isEmpty(h._errorTree.hash), 'was not empty to start with');
            h.on(onRoute, f);
            assert(!_.isEmpty(h._errorTree.hash), 'was empty even after adding listener');
            h.removeListener(deleteRoute, f);
            assert(_.isEmpty(h._errorTree.hash), 'was not empty after removal');
        });


        it('should not receive at ' + '"' + onRoute.join('/') + '" after deleting all listeners at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeAllListeners(deleteRoute);
            try {
                assert(!h.emit(onRoute, msg), 'unexpectedly emitted after removal');
            } catch (expected) {}
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not leak when deleting all listeners ' + '"' + onRoute.join('/') + '" by route "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            assert(_.isEmpty(h._errorTree.hash), 'was not empty to start with');
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(!_.isEmpty(h._errorTree.hash), 'was empty even after adding listener');
            h.removeAllListeners(deleteRoute);
            assert(_.isEmpty(h._errorTree.hash), 'was not empty after removal');
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

        it('should receive at ' + '"' + onRoute.join('/') + '" after deleting all listeners at "' + deleteRoute.join('/') + '"', function () {
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

    _.each([
        [['error'], ['error']]
        , [['error'], ['error', 'name']]
        , [['error'], ['error', 'name', 'name2']]
        , [['error', 'name'], ['error', 'name']]
        , [['error', '*'], ['error', 'name']]
        , [['error', '*', '*'], ['error', 'name', 'name2']]
        , [['error', '**'], ['error', 'name']]
        , [['error', '**'], ['error', 'name', 'name2']]
    ], function (args) {
        shouldReceive.apply(null, args);
    });

    _.each([
        [['error'], ['name']]
        , [['error'], ['*']]
        , [['error'], ['**']]
        , [['error', 'name'], ['*', 'othername']]
        , [['error', 'name'], ['*', 'name']]
        , [['error', 'name'], ['*', '*']]
        , [['error', '*'], ['*', 'name']]
        , [['error', '*'], ['*', '*']]
        , [['error', '*'], ['*', '**']]
        , [['error', '**'], ['*', 'name']]
        , [['error', '**'], ['*', '*']]
        , [['error', '**'], ['*', '**']]
    ], function (args) {
        shouldNotReceive.apply(null, args);
    });

    _.each([
        [['error'], ['error']]
        , [['error', 'name'], ['error', 'name']]
        , [['error', 'name'], ['error', '*']]
        , [['error', 'name'], ['error', '**']]
        , [['error', '*'], ['error', '*']]
        , [['error', '*'], ['error', '**']]
        , [['error', '**'], ['error', '**']]
        , [['error', 'name', 'name2'], ['error', 'name', 'name2']]
        , [['error', 'name', 'name2'], ['error', 'name', '*']]
        , [['error', 'name', 'name2'], ['error', '*', 'name2']]
        , [['error', 'name', 'name2'], ['error', '*', '*']]
        , [['error', 'name', 'name2'], ['error', '*', '**']]
        , [['error', 'name', 'name2'], ['error', '**']]
        , [['error', '*', 'name2'], ['error', '*', 'name2']]
        , [['error', '*', 'name2'], ['error', '*', '*']]
        , [['error', '*', 'name2'], ['error', '*', '**']]
        , [['error', '*', 'name2'], ['error', '**']]
        , [['error', 'name', '*'], ['error', 'name', '*']]
        , [['error', 'name', '*'], ['error', 'name', '**']]
        , [['error', 'name', '*'], ['error', '*', '*']]
        , [['error', 'name', '*'], ['error', '*', '**']]
        , [['error', 'name', '*'], ['error', '**']]
    ], function (args) {
        shouldBeDeletedAt.apply(null, args);
    });

    _.each([
        [['error'], ['*']]
        , [['error'], ['**']]
        , [['error', 'name'], ['*', '*']]
        , [['error', 'name'], ['*', '**']]
        , [['error', 'name'], ['**']]
    ], function (args) {
        shouldNotBeDeletedAt.apply(null, args);
    });

});
