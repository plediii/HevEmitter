/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter newlistener', function () {

    var h;
    beforeEach(function () {
        h = new H();
    });

    describe('on events', function () {

        it('should be triggered when a listener is added to a "name" event', function () {
            var called = 0;
            h.on(['newListener'], function () {
                called++;
            });
            assert.equal(0, called, 'bad initial state');
            h.on(['star'], function () {});
            assert.equal(1, called, 'newListener was not called');
        });

        it('should *not* be triggered after removing specific listener', function () {
            var called = 0;
            var f = function () {
                called++;
            }
            h.on(['newListener'], f);
            assert.equal(0, called, 'bad initial state');
            h.removeListener(['newListener'], f);
            assert.equal(0, called, 'bad initial state');
            h.on(['star'], function () {});
            assert.equal(0, called, 'newListener was called after removal');
        });

        it('should *not* be triggered after removing all listeners', function () {
            var called = 0;
            var f = function () {
                called++;
            }
            h.on(['newListener'], f);
            assert.equal(0, called, 'bad initial state');
            h.removeAllListeners(['newListener'], f);
            assert.equal(0, called, 'bad initial state');
            h.on(['star'], function () {});
            assert.equal(0, called, 'newListener was called after removal');
        });


        it('should be triggered before listener is available', function () {
            var called = 0;
            var route = ['four'];
            assert.equal(0, h.listeners(route), 'initially found listener');
            var f = function () {
                assert.equal(0, h.listeners(route).length, 'found  listener prematurely');
                called++;
            };
            h.on(['newListener'], f);
            h.on(route, function () {});
            assert.equal(1, called, 'newListener event was not called');
            assert.equal(1, h.listeners(route).length, 'did not find listener after adding');
        });


        it('should *NOT* trigger * listeners', function (done) {
            h.on(['*', '*'], function () {
                done(true);
            });
            h.on(['newListener'], function () {
                done();
            });
            h.on(['star'], function () {});
        });

        it('should *NOT* trigger ** listeners', function (done) {
            h.on(['**'], function () {
                done(true);
            });
            h.on(['newListener'], function () {
                done();
            });
            h.on(['star'], function () {});
        });

        it('should be triggered when a listener is added to a "name" event, with data', function (done) {
            h.on(['newListener'], function (data) {
                assert(data);
                done();
            });
            h.on(['star'], function () {});
        });

        it('should be triggered with listener route as first argument', function (done) {
            var route = ['five', 'ten'];
            h.on(['newListener'], function (data) {
                assert.deepEqual(route, data);
                done();
            });
            h.on(route, function () {});
        });

        it('should be triggered with listener function as second argument', function (done) {
            var route = ['five', 'ten'];
            var f = function () {};
            h.on(['newListener'], function (data, cb) {
                assert.equal(cb, f, 'did not receive callback function as second argument');
                done();
            });
            h.on(route, f);
        });

    });

    describe('on sub events', function () {
        it('should be triggered when a listener is added to a "newlistener/route" event', function (done) {
            var h = new H();
            h.on(['newListener', 'powersurge'], function () {
                done(true);
            });
            h.on(['newListener', 'alright'], function () {
                done();
            });
            h.on(['alright'], function () {});
        });
    });

});
