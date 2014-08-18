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
                .then(function () { done() });
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
                .then(function () { done() });
        });


        it('should NOT trigger one level method after one star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['circus'], f);
            h.removeAllListeners(['*']);
            h.emit(['circus'])
                .then(function () { done() });
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
                .then(function () { done() });
        });

        it('should NOT trigger one level method after two star removal', function (done) {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['sadface'], f);
            h.removeAllListeners(['**']);
            h.emit(['sadface'])
                .then(function () { done() });
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
                .then(function () { done() });
        });

    });

    describe('removeAllListeners leaks', function () {

        it('should be empty after removing one level listener', function () {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['son'], f);
            assert(!_.isEmpty(h._eventTree.hash));
            h.removeAllListeners(['son']);
            assert(_.isEmpty(h._eventTree.hash));
        });

        it('should NOT trigger a second one level method after one level removal', function () {
            var h = new H();
            var f = function () {
                assert(false);
            };            
            var g = function () {
                assert(false);
            };
            h.on(['son'], f);
            h.on(['son'], g);
            assert(!_.isEmpty(h._eventTree.hash));
            h.removeAllListeners(['son']);
            assert(_.isEmpty(h._eventTree.hash));
        });


        it('should NOT trigger one level method after one star removal', function () {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['circus'], f);
            assert(!_.isEmpty(h._eventTree.hash));
            h.removeAllListeners(['*']);
            assert(_.isEmpty(h._eventTree.hash));
        });

        it('should NOT trigger two level method after one star removal', function () {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['squirrel', 'snake'], f);
            assert(!_.isEmpty(h._eventTree.hash));
            h.removeAllListeners(['*', 'snake']);
            assert(_.isEmpty(h._eventTree.hash));
        });

        it('should NOT trigger one level method after two star removal', function () {
            var h = new H();
            var f = function () {
                assert(false);
            };
            h.on(['sadface'], f);
            assert(!_.isEmpty(h._eventTree.hash));
            h.removeAllListeners(['**']);
            assert(_.isEmpty(h._eventTree.hash));
        });

        it('should NOT trigger a second two level method after two star removal', function () {
            var h = new H();
            var f = function () {
                assert(false);
            };
            var g = function () {
                assert(false);
            };
            h.on(['cash', 'act'], f);
            h.on(['cash', 'act'], g);
            assert(!_.isEmpty(h._eventTree.hash));
            h.removeAllListeners(['**']);
            assert(_.isEmpty(h._eventTree.hash));
        });

    });

});
