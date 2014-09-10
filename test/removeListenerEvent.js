/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter removeListener event ', function () {


    describe('on events', function () {
        it('should be triggered when a listener is removed from a "name" event', function (done) {
            var h = new H();
            h.on(['star'], function () {});
            h.on(['removeListener'], function () {
                done();
            });
            h.removeAllListeners(['star']);
        });

        it('should be triggered when a listener is removed from a "name" event, with data', function (done) {
            var h = new H();
            h.on(['star'], function () {});
            h.on(['removeListener'], function (data) {
                assert(data);
                done();
            });
            h.removeAllListeners(['star']);
        });


        it('should be triggered when a listener is removed from a "name" event, with data.event equal to the listened to event', function (done) {
            var h = new H();
            h.on(['star'], function () {});
            h.on(['removeListener'], function (data) {
                assert.deepEqual(data.event, ['star']);
                done();
            });
            h.removeAllListeners(['star'])
        });

        it('should be triggered when a listener is removed from a "name" event, with data.listener equal to the listener function', function (done) {
            var h = new H();
            var listener = function () {};
            h.on(['star'], listener);
            h.on(['removeListener'], function (data) {
                assert.equal(data.listener, listener);
                done();
            });
            h.removeAllListeners(['star']);
        });
    });

    describe('once events', function () {
        it('should be triggered when a listener is removed from a "name" event', function (done) {
            var h = new H();
            h.once(['star'], function () {});
            h.on(['removeListener'], function () {
                done();
            });
            
        });

        it('should be triggered when a listener is removed from a "name" event, with data', function (done) {
            var h = new H();
            h.on(['removeListener'], function (data) {
                assert(data);
                done();
            });
            h.once(['star'], function () {});
            h.removeAllListeners(['star']);
        });


        it('should be triggered when a listener is removed from a "name" event, with data.event equal to the listened to event', function (done) {
            var h = new H();
            h.once(['star'], function () {});
            h.on(['removeListener'], function (data) {
                assert.deepEqual(data.event, ['star']);
                done();
            });
            h.removeAllListeners(['star']);
        });

        it('should be triggered when a listener is removed from a "name" event, with data.listener equal to the listener function', function (done) {
            var h = new H();
            var listener = function () {};
            h.once(['star'], listener);
            h.on(['removeListener'], function (data) {
                assert.equal(data.listener, listener);
                done();
            });
            h.removeAllListeners(['star']);
        });
    });

    describe('on sub events', function () {
        it('should be triggered when a listener is added to a specific "removeListener/route" event', function (done) {
            var h = new H();
            h.on(['alright'], function () {});
            h.on(['removeListener', 'powersurge'], function () {
                done(true);
            });
            h.on(['removeListener', 'alright'], function () {
                done();
            });
            h.removeAllListeners(['alright']);
        });

    });

});
