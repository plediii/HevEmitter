/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('underscore');
var assert = require('assert');

describe('HevEmitter on', function () {

    describe('removeListener', function () {

        it('should NOT trigger one level method after one level removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['son'], f);
            h.removeListener(['son'], f);
            h.emit(['son'])
                .then(function () { done(); });
        });

        it('SHOULD trigger one level method after one level removal of different function', function (done) {
            var h = new H();
            var f = function () {
                done();
            };
            h.on(['son'], f);
            h.removeListener(['son'], function () {});
            h.emit(['son']);
        });


        it('should NOT trigger one level method after one star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['circus'], f);
            h.removeListener(['*'], f);
            h.emit(['circus'])
                .then(function () { done(); });
        });

        it('SHOULD trigger one level method after one star removal of different function ', function (done) {
            var h = new H();
            var f = function () {
                done();
            };
            h.on(['circus'], f);
            h.removeListener(['*'], function () {});
            h.emit(['circus']);
        });

        it('SHOULD trigger two level method after one star removal', function (done) {
            var h = new H();
            var f = function () {
                done();
            };
            h.on(['gore', 'leena'], f);
            h.removeListener(['*'], f);
            h.emit(['gore', 'leena']);
        });

        it('should NOT trigger two level method after one star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['squirrel', 'snake'], f);
            h.removeListener(['*', 'snake'], f);
            h.emit(['squirrel', 'snake'])
                .then(function () { done(); });
        });

        it('SHOULD trigger two level method after one star removal of different function', function (done) {
            var h = new H();
            var f = function () {
                done();
            };
            h.on(['squirrel', 'snake'], f);
            h.removeListener(['*', 'snake'], function () {});
            h.emit(['squirrel', 'snake']);
        });

        it('should NOT trigger one level method after two star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['sadface'], f);
            h.removeListener(['**'], f);
            h.emit(['sadface'])
                .then(function () { done(); });
        });

        it('should NOT trigger two level method after two star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['cash', 'act'], f);
            h.removeListener(['**'], f);
            h.emit(['cash', 'act'])
                .then(function () { done(); });
        });

        it('SHOULD trigger two level method after two star removal of different function', function (done) {
            var h = new H();
            var f = function () {
                done();
            };
            h.on(['cash', 'act'], f);
            h.removeListener(['**'], function () {});
            h.emit(['cash', 'act']);
        });

    });

});
