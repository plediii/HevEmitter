/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter', function () {

    describe('on string', function () {

        it('should be able to specify one level "name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('temp', function () {});
            h.emit(['temp'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should not be be triggered on non-matchin "name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('just', function () {});
            h.emit(['one'])
                .then(function (called) {
                    assert(!called);
                    done();
                });
        });

        it('should be able to specify one level "*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('*', function () {});
            h.emit(['pyrotechnics'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify one level "**" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('**', function () {});
            h.emit(['doug'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify two level "name/name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('thank/you', function () {});
            h.emit(['thank', 'you'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "name/name" events using a different delimiter', function (done) {
            var h = new H({ delimiter: '::' });
            h.on('thank::you', function () {});
            h.emit(['thank', 'you'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify two level "name/*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('crash/*', function () {});
            h.emit(['crash', 'here'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "name/**" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('tired/**', function () {});
            h.emit(['tired', 'of', 'raking'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify two level "*/name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('*/rigby', function () {});
            h.emit(['im', 'rigby'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "*/*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on('*/*', function () {});
            h.emit(['oh', 'well'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

    });

    describe('emit string', function () {

        it('should be able to specify one level "name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['temp'], function () {});
            h.emit('temp')
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should not be be triggered on non-matchin "name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['just'], function () {});
            h.emit('one')
                .then(function (called) {
                    assert(!called);
                    done();
                });
        });

        it('should be able to specify one level "*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['*'], function () {});
            h.emit('pyrotechnics')
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify one level "**" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['**'], function () {});
            h.emit('doug')
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify two level "name/name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['thank', 'you'], function () {});
            h.emit('thank/you')
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "name/*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['crash', '*'], function () {});
            h.emit('crash/here')
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "name/**" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['tired', '**'], function () {});
            h.emit('tired/of/raking')
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "*/name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['*', 'rigby'], function () {});
            h.emit('im/rigby')
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "*/*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.on(['*', '*'], function () {});
            h.emit('oh/well')
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

    });

    describe('once string', function () {

        it('should be able to specify one level "name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('temp', function () {});
            h.emit(['temp'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should not be be triggered on non-matchin "name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('just', function () {});
            h.emit(['one'])
                .then(function (called) {
                    assert(!called);
                    done();
                });
        });

        it('should be able to specify one level "*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('*', function () {});
            h.emit(['pyrotechnics'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify one level "**" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('**', function () {});
            h.emit(['doug'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify two level "name/name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('thank/you', function () {});
            h.emit(['thank', 'you'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "name/*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('crash/*', function () {});
            h.emit(['crash', 'here'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "name/**" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('tired/**', function () {});
            h.emit(['tired', 'of', 'raking'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });


        it('should be able to specify two level "*/name" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('*/rigby', function () {});
            h.emit(['im', 'rigby'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

        it('should be able to specify two level "*/*" events', function (done) {
            var h = new H({ delimiter: '/' });
            h.once('*/*', function () {});
            h.emit(['oh', 'well'])
                .then(function (called) {
                    assert(called);
                    done();
                });
        });

    });

    describe('removeListener string', function () {

        it('should be possible to remove a function by a string route', function (done) {
            var h = new H({ delimiter: '/' });
            var f = function () {};
            h.on(['thank', 'you'], f);
            h.removeListener('thank/you', f);
            h.emit(['thank', 'you'])
                .then(function (called) {
                    assert(!called);
                    done();
                });
        });
    });

    describe('removeAllListeners string', function () {

        it('should be possible to remove all listeners by a string route', function (done) {
            
            var h = new H({ delimiter: '/' });
            var f = function () {};
            h.on(['thank', 'you'], f);
            h.removeAllListeners('thank/you');
            h.emit(['thank', 'you'])
                .then(function (called) {
                    assert(!called);
                    done();
                });
        });
    });

});
