/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter on', function () {

    describe('removeListener', function () {

        describe('.on listener ', function () {

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

            it('should NOT leak after one level removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                assert(_.isEmpty(h._eventTree.hash));
                h.on(['son'], f);
                assert(!_.isEmpty(h._eventTree.hash));
                h.removeListener(['son'], f);
                assert(_.isEmpty(h._eventTree.hash));
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

        describe('.once listener ', function () {

            it('should NOT trigger one level method after one level removal', function (done) {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['son'], f);
                h.removeListener(['son'], f);
                h.emit(['son'])
                    .then(function () { done(); });
            });

            it('should NOT leak after one level removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                assert(_.isEmpty(h._eventTree.hash));
                h.once(['son'], f);
                assert(!_.isEmpty(h._eventTree.hash));
                h.removeListener(['son'], f);
                assert(_.isEmpty(h._eventTree.hash));
            });


            it('SHOULD trigger one level method after one level removal of different function', function (done) {
                var h = new H();
                var f = function () {
                    done();
                };
                h.once(['son'], f);
                h.removeListener(['son'], function () {});
                h.emit(['son']);
            });


            it('should NOT trigger one level method after one star removal', function (done) {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['circus'], f);
                h.removeListener(['*'], f);
                h.emit(['circus'])
                    .then(function () { done(); });
            });

            it('SHOULD trigger one level method after one star removal of different function ', function (done) {
                var h = new H();
                var f = function () {
                    done();
                };
                h.once(['circus'], f);
                h.removeListener(['*'], function () {});
                h.emit(['circus']);
            });

            it('SHOULD trigger two level method after one star removal', function (done) {
                var h = new H();
                var f = function () {
                    done();
                };
                h.once(['gore', 'leena'], f);
                h.removeListener(['*'], f);
                h.emit(['gore', 'leena']);
            });

            it('should NOT trigger two level method after one star removal', function (done) {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], f);
                h.emit(['squirrel', 'snake'])
                    .then(function () { done(); });
            });

            it('SHOULD trigger two level method after one star removal of different function', function (done) {
                var h = new H();
                var f = function () {
                    done();
                };
                h.once(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], function () {});
                h.emit(['squirrel', 'snake']);
            });

            it('should NOT trigger one level method after two star removal', function (done) {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['sadface'], f);
                h.removeListener(['**'], f);
                h.emit(['sadface'])
                    .then(function () { done(); });
            });

            it('should NOT trigger two level method after two star removal', function (done) {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['cash', 'act'], f);
                h.removeListener(['**'], f);
                h.emit(['cash', 'act'])
                    .then(function () { done(); });
            });

            it('SHOULD trigger two level method after two star removal of different function', function (done) {
                var h = new H();
                var f = function () {
                    done();
                };
                h.once(['cash', 'act'], f);
                h.removeListener(['**'], function () {});
                h.emit(['cash', 'act']);
            });

        });

        describe('promise listener ', function () {

            it('should NOT trigger one level method after one level removal', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['son'], f);
                h.removeListener(['son'], f);
                h.emit(['son'])
                    .then(function () { done(); });
            });

            it('should NOT leak after one level removal', function () {
                var h = new H();
                var f = function (msg , cb) {
                    assert(false);
                };
                assert(_.isEmpty(h._eventTree.hash));
                h.on(['son'], f);
                assert(!_.isEmpty(h._eventTree.hash));
                h.removeListener(['son'], f);
                assert(_.isEmpty(h._eventTree.hash));
            });


            it('SHOULD trigger one level method after one level removal of different function', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    done();
                };
                h.on(['son'], f);
                h.removeListener(['son'], function () {});
                h.emit(['son']);
            });


            it('should NOT trigger one level method after one star removal', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['circus'], f);
                h.removeListener(['*'], f);
                h.emit(['circus'])
                    .then(function () { done(); });
            });

            it('SHOULD trigger one level method after one star removal of different function ', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    done();
                };
                h.on(['circus'], f);
                h.removeListener(['*'], function () {});
                h.emit(['circus']);
            });

            it('SHOULD trigger two level method after one star removal', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    done();
                };
                h.on(['gore', 'leena'], f);
                h.removeListener(['*'], f);
                h.emit(['gore', 'leena']);
            });

            it('should NOT trigger two level method after one star removal', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], f);
                h.emit(['squirrel', 'snake'])
                    .then(function () { done(); });
            });

            it('SHOULD trigger two level method after one star removal of different function', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    done();
                };
                h.on(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], function () {});
                h.emit(['squirrel', 'snake']);
            });

            it('should NOT trigger one level method after two star removal', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['sadface'], f);
                h.removeListener(['**'], f);
                h.emit(['sadface'])
                    .then(function () { done(); });
            });

            it('should NOT trigger two level method after two star removal', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['cash', 'act'], f);
                h.removeListener(['**'], f);
                h.emit(['cash', 'act'])
                    .then(function () { done(); });
            });

            it('SHOULD trigger two level method after two star removal of different function', function (done) {
                var h = new H();
                var f = function (msg, cb) {
                    done();
                };
                h.on(['cash', 'act'], f);
                h.removeListener(['**'], function () {});
                h.emit(['cash', 'act']);
            });

        });

        describe('alternate listener handle', function () {

            it('should be used to remove when provided', function (done) {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                var listener = f.listener = 'house';
                h.on(['son'], f);
                h.removeListener(['son'], listener);
                h.emit(['son'])
                    .then(function () { done(); });
            });

        });

    });

});
