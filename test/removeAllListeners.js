/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter on', function () {

    describe('removeAllListeners', function () {

        it('should NOT trigger one level method after one level removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['son'], f);
            h.removeAllListeners(['son']);
            h.emit(['son'])
                .then(done);
        });

        it('should NOT trigger a second one level method after one level removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };            
            var g = function () {
                assert(false);
            };
            h.on(['son'], f);
            h.on(['son'], g);
            h.removeAllListeners(['son']);
            h.emit(['son'])
                .then(done);
        });


        it('should NOT trigger one level method after one star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['circus'], f);
            h.removeAllListeners(['*']);
            h.emit(['circus'])
                .then(done);
        });

        it('SHOULD trigger two level method after one star removal', function (done) {
            var h = new H();
            var f = function () {
                done();
            };
            h.on(['gore', 'leena'], f);
            h.removeAllListeners(['*']);
            h.emit(['gore', 'leena']);
        });

        it('should NOT trigger two level method after one star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['squirrel', 'snake'], f);
            h.removeAllListeners(['*', 'snake']);
            h.emit(['squirrel', 'snake'])
                .then(done);
        });

        it('should NOT trigger one level method after two star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['sadface'], f);
            h.removeAllListeners(['**']);
            h.emit(['sadface'])
                .then(done);
        });

        it('should NOT trigger a second two level method after two star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            var g = function () {
                assert(false);
            };
            h.on(['cash', 'act'], f);
            h.on(['cash', 'act'], g);
            h.removeAllListeners(['**']);
            h.emit(['cash', 'act'])
                .then(done);
        });

    });

});
