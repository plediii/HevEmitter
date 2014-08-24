/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter on', function () {

    describe('explicit promise', function () {
        
        it('should wait for callback when provided', function (done) {
            var h = new H();
            var wait = true;
            h.on(['james'], function (msg, cb) {});
            h.on(['heroes'], function (msg, cb) {
                return cb();
            });
            h.emit(['james'])
                .then(function () {
                    wait = false;
                });
            h.emit(['heroes'])
                .then(function () {
                    assert(wait);
                    done();
                });
        });

        it('two star error should short circuit one named event on same level', function (done) {
            var h = new H();
            var twoStarShort = true;
            h.on(['**'], function (msg, cb) {
                return cb('block');
            });
            h.on(['gross'], function (msg, cb) {
                twoStarShort = false;
                cb();
            });
            h.emit(['gross'])
            .catch(function (err) {
                assert.equal(err.message, 'block');
                assert(twoStarShort);
                done();
            });
        });

        it('two star error should short circuit one named event on same level even if deferred', function (done) {
            var h = new H();
            var twoStarShort = true;
            h.on(['**'], function (msg, cb) {
                process.nextTick(function () {
                    return cb('block');
                });
            });
            h.on(['gross'], function (msg, cb) {
                twoStarShort = false;
                cb();
            });
            h.emit(['gross'])
            .catch(function (err) {
                assert.equal(err.message, 'block');
                assert(twoStarShort);
                done();
            });
        });

        it('two star error should short circuit one star', function (done) {
            var h = new H();
            var blocked = true;
            h.on(['**'], function (msg, cb) {
                return cb('block');
            });
            h.on(['*'], function (msg, cb) {
                blocked = false;
            });
            h.emit(['gross']).then(function() {
                blocked = false;
            })
            .catch(function (err) { 
                assert.equal(err.message, 'block');
                assert(blocked);
                done(); 
            });
        });

        it('one star error should short circuit named event at same level', function (done) {
            var h = new H();
            var blocked = true;
            h.on(['*'], function (msg, cb) {
                return cb('block');
            });
            h.on(['gross'], function (msg, cb) {
                blocked = false;
            });
            h.emit(['gross']).then(function() {
                blocked = false;
            })
            .catch(function (err) {
                assert.equal(err.message, 'block');
                assert(blocked);
                done(); 
            });
        });

        it('named event should short circuit named event', function (done) {
            var h = new H();
            var blocked = true;
            h.on(['baby'], function (msg, cb) {
                return cb('block');
            });
            h.on(['baby'], function (msg, cb) {
                blocked = false;
            });
            h.emit(['baby']).then(function() {
                blocked = false;
            })
            .catch(function (err) {
                assert.equal(err.message, 'block');
                assert(blocked);
                done(); 
            });
        });

        it('one level should short circuit one level even if deferred', function (done) {
            var h = new H();
            var blocked = true;
            h.on(['baby'], function (msg, cb) {
                process.nextTick(function () {
                    cb('block');
                });
            });
            h.on(['baby'], function (msg, cb) {
                blocked = false;
            });
            h.emit(['baby']).then(function() {
                blocked = false;
            })
            .catch(function (err) { 
                assert.equal(err.message, 'block');
                assert(blocked);
                done(); 
            });
        });

        
    });

});
