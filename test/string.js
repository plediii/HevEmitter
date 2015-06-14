/*jslint node: true */
"use strict";

var _ = require('lodash');
var assert = require('assert');

var H = require('../index').EventEmitter;
var routes = require('./routes');

describe('HevEmitter string routes', function () {

    var h;
    beforeEach(function () {
        h = new H({ delimiter: '/' });
    });

    var shouldReceive = function (onRoute, emitRoute) {
        it('should receive at literal ' + '"' + onRoute.join('/') + '" messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute.join('/'), function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(emitRoute.join('/'), msg));
            assert(h.emit(emitRoute, msg));
            assert.equal(2, msg.emitted);
        });


        it('should receive at ' + '"' + onRoute.join('/') + '" messages emitted to literal "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(emitRoute.join('/'), msg));
            assert(h.emit(emitRoute.join('/'), msg));
            assert.equal(2, msg.emitted);
        });


    };

    var shouldReceiveInOrder = function (firstRoute, secondRoute, emitRoute) {
        it('should receive at literal ' + '"' + firstRoute.join('/') + '" before literal "' + secondRoute.join('/') + '" on messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: [] };
            h.on(firstRoute.join('/'), function (msg) {
                msg.emitted.push('a') 
            });
            h.on(secondRoute.join('/'), function (msg) {
                msg.emitted.push('b') 
            });
            assert(h.emit(emitRoute, msg));
            assert.deepEqual(['a', 'b'], msg.emitted);
        });

        it('should receive at literal ' + '"' + firstRoute.join('/') + '" before literal "' + secondRoute.join('/') + '" on messages emitted to "' + emitRoute.join('/') + '" (opposite order)', function () {
            var msg = { emitted: [] };
            h.on(secondRoute.join('/'), function (msg) {
                msg.emitted.push('b') 
            });
            h.on(firstRoute.join('/'), function (msg) {
                msg.emitted.push('a') 
            });
            assert(h.emit(emitRoute, msg));
            assert.deepEqual(['a', 'b'], msg.emitted);
        });

        it('should receive at ' + '"' + firstRoute.join('/') + '" before  "' + secondRoute.join('/') + '" on messages emitted to literal "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: [] };
            h.on(firstRoute, function (msg) {
                msg.emitted.push('a') 
            });
            h.on(secondRoute, function (msg) {
                msg.emitted.push('b') 
            });
            assert(h.emit(emitRoute.join('/'), msg));
            assert.deepEqual(['a', 'b'], msg.emitted);
        });

        it('should receive at ' + '"' + firstRoute.join('/') + '" before  "' + secondRoute.join('/') + '" on messages emitted to literal "' + emitRoute.join('/') + '" (opposite order)', function () {
            var msg = { emitted: [] };
            h.on(secondRoute, function (msg) {
                msg.emitted.push('b') 
            });
            h.on(firstRoute, function (msg) {
                msg.emitted.push('a') 
            });
            assert(h.emit(emitRoute.join('/'), msg));
            assert.deepEqual(['a', 'b'], msg.emitted);
        });


    };

    var shouldNotReceive = function (onRoute, emitRoute) {
        it('should *not* receive at literal ' + '"' + onRoute.join('/') + '" messages emitted to "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute.join('/'), function (msg) {
                msg.emitted += 1;
            });
            assert(!h.emit(emitRoute, msg));
            assert(!h.emit(emitRoute, msg));
            assert.equal(0, msg.emitted);
        });

        it('should *not* receive at ' + '"' + onRoute.join('/') + '" messages emitted to literal "' + emitRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(!h.emit(emitRoute.join('/'), msg));
            assert(!h.emit(emitRoute.join('/'), msg));
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

    var shouldBeDeletedAt = function (onRoute, deleteRoute) {
        it('should not receive at literal ' + '"' + onRoute.join('/') + '" after deleting at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            h.on(onRoute.join('/'), f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute, f);
            assert(!h.emit(onRoute, msg), 'unexpectedly emitted after removal');
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not receive at literal ' + '"' + onRoute.join('/') + '" after deleting at "' + deleteRoute.join('/') + '" when deleting by handle', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            var g = f.listener = function () {};
            h.on(onRoute.join('/'), f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute, g);
            assert(!h.emit(deleteRoute, msg), 'unexpectedly emitted after removal');
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not leak when deleting listeners at literal ' + '"' + onRoute.join('/') + '" by route "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            assert(_.isEmpty(h._eventTree.hash), 'was not empty to start with');
            h.on(onRoute.join('/'), f);
            assert(!_.isEmpty(h._eventTree.hash), 'was empty even after adding listener');
            h.removeListener(deleteRoute, f);
            assert(_.isEmpty(h._eventTree.hash), 'was not empty after removal');
        });

        it('should not receive at ' + '"' + onRoute.join('/') + '" after deleting at literal "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            h.on(onRoute, f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute.join('/'), f);
            assert(!h.emit(onRoute, msg), 'unexpectedly emitted after removal');
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not receive at ' + '"' + onRoute.join('/') + '" after deleting at literal "' + deleteRoute.join('/') + '" when deleting by handle', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            var g = f.listener = function () {};
            h.on(onRoute, f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute.join('/'), g);
            assert(!h.emit(deleteRoute, msg), 'unexpectedly emitted after removal');
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });

        it('should not leak when deleting all listeners ' + '"' + onRoute.join('/') + '" by route "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            assert(_.isEmpty(h._eventTree.hash), 'was not empty to start with');
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(!_.isEmpty(h._eventTree.hash), 'was empty even after adding listener');
            h.removeAllListeners(deleteRoute.join('/'));
            assert(_.isEmpty(h._eventTree.hash), 'was not empty after removal');
        });



        it('should not receive at literal ' + '"' + onRoute.join('/') + '" after deleting all at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute.join('/'), function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeAllListeners(deleteRoute);
            assert(!h.emit(onRoute, msg), 'unexpectedly emitted after removal');
            assert.equal(1, msg.emitted, 'unexpectedly called after removal');
        });


        it('should not leak when deleting all listeners at literal ' + '"' + onRoute.join('/') + '" by route "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            assert(_.isEmpty(h._eventTree.hash), 'was not empty to start with');
            h.on(onRoute.join('/'), function (msg) {
                msg.emitted += 1;
            });
            assert(!_.isEmpty(h._eventTree.hash), 'was empty even after adding listener');
            h.removeAllListeners(deleteRoute);
            assert(_.isEmpty(h._eventTree.hash), 'was not empty after removal');
        });

        it('should not receive at ' + '"' + onRoute.join('/') + '" after deleting all at literal "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeAllListeners(deleteRoute.join('/'));
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
            h.removeAllListeners(deleteRoute.join('/'));
            assert(_.isEmpty(h._eventTree.hash), 'was not empty after removal');
        });


    };

    var shouldNotBeDeletedAt = function (onRoute, deleteRoute) {
        it('should receive at literal ' + '"' + onRoute.join('/') + '" after deleting at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            h.on(onRoute.join('/'), f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute, f);
            assert(h.emit(onRoute, msg), 'was not emitted after mismatching removal');
            assert.equal(2, msg.emitted, 'was not called after mismatching removal');
        });

        it('should receive at ' + '"' + onRoute.join('/') + '" after deleting at literal "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            var f = function (msg) {
                msg.emitted += 1;
            };
            h.on(onRoute, f);
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeListener(deleteRoute.join('/'), f);
            assert(h.emit(onRoute, msg), 'was not emitted after mismatching removal');
            assert.equal(2, msg.emitted, 'was not called after mismatching removal');
        });



        it('should receive at literal ' + '"' + onRoute.join('/') + '" after deleting all at "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute.join('/'), function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeAllListeners(deleteRoute);
            assert(h.emit(onRoute, msg), 'was not emitted after mismatching removal');
            assert.equal(2, msg.emitted, 'was not called after mismatching removal');
        });

        it('should receive at ' + '"' + onRoute.join('/') + '" after deleting all at literal "' + deleteRoute.join('/') + '"', function () {
            var msg = { emitted: 0 };
            h.on(onRoute, function (msg) {
                msg.emitted += 1;
            });
            assert(h.emit(onRoute, msg), 'did not emit to start with');
            assert.equal(1, msg.emitted, 'was not called to start with');
            h.removeAllListeners(deleteRoute.join('/'));
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
