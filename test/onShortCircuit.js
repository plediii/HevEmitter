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

        it('two star error should short circuit one level', function (done) {
            var h = new H();
            var twoStarShort = true;
            h.on(['**'], function (msg, cb) {
                return cb(true);
            });
            h.on(['gross'], function (msg, cb) {
                twoStarShort = false;
                cb();
            });
            h.emit(['gross']).then(function() {
                assert(false);
            })
            .catch(function (err) {
                assert(twoStarShort);
                done();
            });
        });

        it('two star error should short circuit one star', function (done) {
            var h = new H();
            h.on(['**'], function (msg, cb) {
                return cb(true);
            });
            h.on(['*'], function (msg, cb) {
                assert(false);
            });
            h.emit(['gross']).then(function() {
                assert(false);
            })
            .catch(done);
        });

        it('one star error should short circuit one level', function (done) {
            var h = new H();
            h.on(['*'], function (msg, cb) {
                return cb(true);
            });
            h.on(['gross'], function (msg, cb) {
                assert(false);
            });
            h.emit(['gross']).then(function() {
                assert(false);
            })
            .catch(done);
        });

        it('one level should short circuit one level', function (done) {
            var h = new H();
            h.on(['baby'], function (msg, cb) {
                return cb(true);
            });
            h.on(['baby'], function (msg, cb) {
                assert(false);
            });
            h.emit(['baby']).then(function() {
                assert(false);
            })
            .catch(done);
        });
        
    });

});
