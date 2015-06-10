/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter', function () {

    describe('on string', function () {

        it('should be able to specify one level "name" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('temp', function () {});
            assert(h.emit(['temp']));
        });

        it('should not be be triggered on non-matchin "name" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('just', function () {});
            assert(h.emit(['one']));
        });

        it('should be able to specify one level "*" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('*', function () {});
            assert(h.emit(['pyrotechnics']));
        });

        it('should be able to specify one level "**" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('**', function () {});
            assert(h.emit(['doug']));
        });


        it('should be able to specify two level "name/name" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('thank/you', function () {});
            assert(h.emit(['thank', 'you']));
        });

        it('should be able to specify two level "name/name" events using a different delimiter', function () {
            var h = new H({ delimiter: '::' });
            h.on('thank::you', function () {});
            assert(h.emit(['thank', 'you']));
        });


        it('should be able to specify two level "name/*" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('crash/*', function () {});
            assert(h.emit(['crash', 'here']));
        });

        it('should be able to specify two level "name/**" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('tired/**', function () {});
            assert(h.emit(['tired', 'of', 'raking']));
        });


        it('should be able to specify two level "*/name" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('*/rigby', function () {});
            assert(h.emit(['im', 'rigby']));
        });

        it('should be able to specify two level "*/*" events', function () {
            var h = new H({ delimiter: '/' });
            h.on('*/*', function () {});
            assert(h.emit(['oh', 'well']));
        });

    });

    describe('emit string', function () {

        it('should be able to specify one level "name" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['temp'], function () {});
            assert(h.emit('temp'));
        });

        it('should not be be triggered on non-matchin "name" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['just'], function () {});
            assert(!h.emit('one'));
        });

        it('should be able to specify one level "*" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['*'], function () {});
            assert(h.emit('pyrotechnics'));
        });

        it('should be able to specify one level "**" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['**'], function () {});
            assert(h.emit('doug'));
        });

        it('should be able to specify two level "name/name" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['thank', 'you'], function () {});
            assert(h.emit('thank/you'));
        });

        it('should be able to specify two level "name/*" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['crash', '*'], function () {});
            assert(h.emit('crash/here'));
        });

        it('should be able to specify two level "name/**" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['tired', '**'], function () {});
            assert(h.emit('tired/of/raking'));
        });

        it('should be able to specify two level "*/name" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['*', 'rigby'], function () {});
            assert(h.emit('im/rigby'));
        });

        it('should be able to specify two level "*/*" events', function () {
            var h = new H({ delimiter: '/' });
            h.on(['*', '*'], function () {});
            assert(h.emit('oh/well'));
        });

    });

    describe('once string', function () {

        it('should be able to specify one level "name" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('temp', function () {});
            assert(h.emit(['temp']));
        });

        it('should not be be triggered on non-matchin "name" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('just', function () {});
            assert(h.emit(['one']));
        });

        it('should be able to specify one level "*" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('*', function () {});
            assert(h.emit(['pyrotechnics']));
        });


        it('should be able to specify one level "**" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('**', function () {});
            assert(h.emit(['doug']));
        });

        it('should be able to specify two level "name/name" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('thank/you', function () {});
            assert(h.emit(['thank', 'you']));
        });

        it('should be able to specify two level "name/*" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('crash/*', function () {});
            assert(h.emit(['crash', 'here']));
        });

        it('should be able to specify two level "name/**" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('tired/**', function () {});
            assert(h.emit(['tired', 'of', 'raking']));
        });

        it('should be able to specify two level "*/name" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('*/rigby', function () {});
            assert(h.emit(['im', 'rigby']));
        });

        it('should be able to specify two level "*/*" events', function () {
            var h = new H({ delimiter: '/' });
            h.once('*/*', function () {});
            assert(h.emit(['oh', 'well']));
        });

    });

    describe('removeListener string', function () {

        it('should be possible to remove a function by a string route', function () {
            var h = new H({ delimiter: '/' });
            var f = function () {};
            h.on(['thank', 'you'], f);
            h.removeListener('thank/you', f);
            assert(!h.emit(['thank', 'you']));
        });
    });

    describe('removeAllListeners string', function () {

        it('should be possible to remove all listeners by a string route', function () {
            var h = new H({ delimiter: '/' });
            var f = function () {};
            h.on(['thank', 'you'], f);
            h.removeAllListeners('thank/you');
            assert(!h.emit(['thank', 'you']));
        });
    });

});
