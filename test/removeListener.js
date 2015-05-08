/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter on', function () {

    describe('removeListener', function () {

        describe('.on listener ', function () {

            it('should NOT trigger one level method after one level removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['son'], f);
                h.removeListener(['son'], f);
                assert(!h.emit(['son']));
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


            it('SHOULD trigger one level method after one level removal of different function', function () {
                var h = new H();
                var f = function () {};
                h.on(['son'], f);
                h.removeListener(['son'], function () {});
                assert(!h.emit(['son']));
            });

            it('should NOT trigger one level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['circus'], f);
                h.removeListener(['*'], f);
                assert(!h.emit(['circus']));
            });

            it('SHOULD trigger one level method after one star removal of different function ', function () {
                var h = new H();
                var f = function () {};
                h.on(['circus'], f);
                h.removeListener(['*'], function () {});
                assert(h.emit(['circus']));
            });

            it('SHOULD trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {};
                h.on(['gore', 'leena'], f);
                h.removeListener(['*'], f);
                assert(h.emit(['gore', 'leena']));
            });

            it('should NOT trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], f);
                assert(!h.emit(['squirrel', 'snake']));
            });

            it('SHOULD trigger two level method after one star removal of different function', function () {
                var h = new H();
                var f = function () {};
                h.on(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], function () {});
                assert(!h.emit(['squirrel', 'snake']));
            });

            it('should NOT trigger one level method after two star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['sadface'], f);
                h.removeListener(['**'], f);
                assert(!h.emit(['sadface']));
            });

            it('should NOT trigger two level method after two star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['cash', 'act'], f);
                h.removeListener(['**'], f);
                assert(!h.emit(['cash', 'act']));
            });

            it('SHOULD trigger two level method after two star removal of different function', function () {
                var h = new H();
                var f = function () {};
                h.on(['cash', 'act'], f);
                h.removeListener(['**'], function () {});
                assert(h.emit(['cash', 'act']));
            });

        });

        describe('.once listener ', function () {

            it('should NOT trigger one level method after one level removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['son'], f);
                h.removeListener(['son'], f);
                assert(!h.emit(['son']));
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


            it('SHOULD trigger one level method after one level removal of different function', function () {
                var h = new H();
                var f = function () {};
                h.once(['son'], f);
                h.removeListener(['son'], function () {});
                assert(!h.emit(['son']));
            });


            it('should NOT trigger one level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['circus'], f);
                h.removeListener(['*'], f);
                assert(!h.emit(['circus']));
            });

            it('SHOULD trigger one level method after one star removal of different function ', function () {
                var h = new H();
                var f = function () {};
                h.once(['circus'], f);
                h.removeListener(['*'], function () {});
                assert(h.emit(['circus']));
            });

            it('SHOULD trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {};
                h.once(['gore', 'leena'], f);
                h.removeListener(['*'], f);
                assert(h.emit(['gore', 'leena']));
            });

            it('should NOT trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], f);
                assert(!h.emit(['squirrel', 'snake']));
            });

            it('SHOULD trigger two level method after one star removal of different function', function () {
                var h = new H();
                var f = function () {
                };
                h.once(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], function () {});
                assert(h.emit(['squirrel', 'snake']));
            });

            it('should NOT trigger one level method after two star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['sadface'], f);
                h.removeListener(['**'], f);
                assert(!h.emit(['sadface']));
            });

            it('should NOT trigger two level method after two star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['cash', 'act'], f);
                h.removeListener(['**'], f);
                assert(!h.emit(['cash', 'act']));
            });

            it('SHOULD trigger two level method after two star removal of different function', function () {
                var h = new H();
                var f = function () {};
                h.once(['cash', 'act'], f);
                h.removeListener(['**'], function () {});
                assert(h.emit(['cash', 'act'])):
            });

        });

        describe('promise listener ', function () {

            it('should NOT trigger one level method after one level removal', function () {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['son'], f);
                h.removeListener(['son'], f);
                assert(h.emit(['son']));
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


            it('SHOULD trigger one level method after one level removal of different function', function () {
                var h = new H();
                var f = function (msg, cb) {};
                h.on(['son'], f);
                h.removeListener(['son'], function () {});
                assert(h.emit(['son']));
            });


            it('should NOT trigger one level method after one star removal', function () {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['circus'], f);
                h.removeListener(['*'], f);
                assert(!h.emit(['circus']));
            });

            it('SHOULD trigger one level method after one star removal of different function ', function () {
                var h = new H();
                var f = function (msg, cb) {};
                h.on(['circus'], f);
                h.removeListener(['*'], function () {});
                assert(h.emit(['circus']));
            });

            it('SHOULD trigger two level method after one star removal', function () {
                var h = new H();
                var f = function (msg, cb) {};
                h.on(['gore', 'leena'], f);
                h.removeListener(['*'], f);
                assert(h.emit(['gore', 'leena']));
            });

            it('should NOT trigger two level method after one star removal', function () {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], f);
                assert(!h.emit(['squirrel', 'snake']));
            });

            it('SHOULD trigger two level method after one star removal of different function', function () {
                var h = new H();
                var f = function (msg, cb) {};
                h.on(['squirrel', 'snake'], f);
                h.removeListener(['*', 'snake'], function () {});
                assert(h.emit(['squirrel', 'snake']));
            });

            it('should NOT trigger one level method after two star removal', function () {
                var h = new H();
                var f = function (msg, cb) {};
                h.on(['sadface'], f);
                h.removeListener(['**'], f);
                assert(h.emit(['sadface']));
            });

            it('should NOT trigger two level method after two star removal', function () {
                var h = new H();
                var f = function (msg, cb) {
                    assert(false);
                };
                h.on(['cash', 'act'], f);
                h.removeListener(['**'], f);
                assert(!h.emit(['cash', 'act']));
            });

            it('SHOULD trigger two level method after two star removal of different function', function (done) {
                var h = new H();
                var f = function (msg, cb) {};
                h.on(['cash', 'act'], f);
                h.removeListener(['**'], function () {});
                assert(h.emit(['cash', 'act']));
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
                assert(!h.emit(['son']));
            });

        });

    });

});
