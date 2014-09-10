/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter newlistener', function () {


    describe('on events', function () {
        it('should be triggered when a listener is added to a "name" event', function (done) {
            var h = new H();
            h.on(['newListener'], function () {
                done();
            });
            h.on(['star'], function () {});
        });

        it('should be triggered when a listener is added to a "name" event, with data', function (done) {
            var h = new H();
            h.on(['newListener'], function (data) {
                assert(data);
                done();
            });
            h.on(['star'], function () {});
        });


        it('should be triggered when a listener is added to a "name" event, with data.event equal to the listened to event', function (done) {
            var h = new H();
            h.on(['newListener'], function (data) {
                assert.deepEqual(data.event, ['star']);
                done();
            });
            h.on(['star'], function () {});
        });

        it('should be triggered when a listener is added to a "name" event, with data.listener equal to the listener function', function (done) {
            var h = new H();
            var listener = function () {};
            h.on(['newListener'], function (data) {
                assert.equal(data.listener, listener);
                done();
            });
            h.on(['star'], listener);
        });
    });

    describe('once events', function () {
        it('should be triggered when a listener is added to a "name" event', function (done) {
            var h = new H();
            h.on(['newListener'], function () {
                done();
            });
            h.once(['star'], function () {});
        });

        it('should be triggered when a listener is added to a "name" event, with data', function (done) {
            var h = new H();
            h.on(['newListener'], function (data) {
                assert(data);
                done();
            });
            h.once(['star'], function () {});
        });


        it('should be triggered when a listener is added to a "name" event, with data.event equal to the listened to event', function (done) {
            var h = new H();
            h.on(['newListener'], function (data) {
                assert.deepEqual(data.event, ['star']);
                done();
            });
            h.once(['star'], function () {});
        });

        it('should be triggered when a listener is added to a "name" event, with data.listener equal to the listener function', function (done) {
            var h = new H();
            var listener = function () {};
            h.on(['newListener'], function (data) {
                assert.equal(data.listener, listener);
                done();
            });
            h.once(['star'], listener);
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
