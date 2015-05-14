/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter on', function () {

    describe('removeAllListeners', function () {

        describe('.on callbacks', function () {
            it('should NOT trigger one level method after one level removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['son'], f);
                h.removeAllListeners(['son']);
                assert(h.emit(['son']));
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
                h.removeAllListeners(['son']);
                assert(h.emit(['son']));
            });


            it('should NOT trigger one level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['circus'], f);
                h.removeAllListeners(['*']);
                assert(h.emit(['circus']));
            });

            it('SHOULD trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {};
                h.on(['gore', 'leena'], f);
                h.removeAllListeners(['*']);
                assert(h.emit(['gore', 'leena']));
            });

            it('should NOT trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['squirrel', 'snake'], f);
                h.removeAllListeners(['*', 'snake']);
                assert(!h.emit(['squirrel', 'snake']));
            });

            it('should NOT trigger one level method after two star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.on(['sadface'], f);
                h.removeAllListeners(['**']);
                assert(h.emit(['sadface']));
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
                h.removeAllListeners(['**']);
                assert(!h.emit(['cash', 'act']));
            });
        });

        describe('.once callbacks', function () {
            it('should NOT trigger one level method after one level removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['son'], f);
                h.removeAllListeners(['son']);
                assert(!h.emit(['son']));
            });

            it('should NOT trigger a second one level method after one level removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };            
                var g = function () {
                    assert(false);
                };
                h.once(['son'], f);
                h.once(['son'], g);
                h.removeAllListeners(['son']);
                assert(!h.emit(['son']));
            });


            it('should NOT trigger one level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['circus'], f);
                h.removeAllListeners(['*']);
                assert(!h.emit(['circus']));
            });

            it('SHOULD trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {};
                h.once(['gore', 'leena'], f);
                h.removeAllListeners(['*']);
                assert(h.emit(['gore', 'leena']));
            });

            it('should NOT trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['squirrel', 'snake'], f);
                h.removeAllListeners(['*', 'snake']);
                assert(!h.emit(['squirrel', 'snake']));
            });

            it('should NOT trigger one level method after two star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['sadface'], f);
                h.removeAllListeners(['**']);
                assert(!h.emit(['sadface']));
            });

            it('should NOT trigger a second two level method after two star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                var g = function () {
                    assert(false);
                };
                h.once(['cash', 'act'], f);
                h.once(['cash', 'act'], g);
                h.removeAllListeners(['**']);
                assert(!h.emit(['cash', 'act']));
            });
        });

    });

    describe('removeAllListeners leaks', function () {

        describe('.on callbacks', function () {

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

        describe('.once callbacks', function () {

            it('should be empty after removing one level listener', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['son'], f);
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
                h.once(['son'], f);
                h.once(['son'], g);
                assert(!_.isEmpty(h._eventTree.hash));
                h.removeAllListeners(['son']);
                assert(_.isEmpty(h._eventTree.hash));
            });


            it('should NOT trigger one level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['circus'], f);
                assert(!_.isEmpty(h._eventTree.hash));
                h.removeAllListeners(['*']);
                assert(_.isEmpty(h._eventTree.hash));
            });

            it('should NOT trigger two level method after one star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['squirrel', 'snake'], f);
                assert(!_.isEmpty(h._eventTree.hash));
                h.removeAllListeners(['*', 'snake']);
                assert(_.isEmpty(h._eventTree.hash));
            });

            it('should NOT trigger one level method after two star removal', function () {
                var h = new H();
                var f = function () {
                    assert(false);
                };
                h.once(['sadface'], f);
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
                h.once(['cash', 'act'], f);
                h.once(['cash', 'act'], g);
                assert(!_.isEmpty(h._eventTree.hash));
                h.removeAllListeners(['**']);
                assert(_.isEmpty(h._eventTree.hash));
            });

        });

    });

});
