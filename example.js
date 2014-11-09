/*jslint node: true */
"use strict";

console.log('###Creating a new emitter');
var HevEmitter = require('./index');
var H = HevEmitter.EventEmitter;
var h = new H();

console.log('###Listening for hierarchical events');
h.on(['finn', 'the', 'human'], function () {
    console.log('jake the dog');
});

h.on(['finn', 'the', 'peasant'], function (msg) {
    console.log(msg, ' the cat');
});

console.log('###Emitting a hierarchical event');
console.log("// waiting on ['finn', 'the', '*'] emission");
h.emit(['finn', 'the', '*'], 'cake');

console.log('###Emitting to all listeners in a hierarchy');
console.log("// waiting on ['finn', '**'] emission");
h.emit(['finn', '**'], 'cake');

console.log('###Listening to all events in a hierarchy');
h.on(['finn', '**'], function () {
    console.log('princess bubblegum');
});
console.log("// waiting on ['finn', 'the', 'human'] emission");
h.emit(['finn', 'the', 'human'], 'cake');

console.log('###Removing events in a hierarchy');
h.on(['*', 'the', '*'], function (msg) {
    console.log('Hello ', msg);
});
h.removeAllListeners(['finn', '**']);
console.log("// waiting on ['finn', 'the', '*'] emission");
h.emit(['finn', 'the', '*'], 'EventEmitter');

console.log('### Using delimited strings');
h.emit('neil/the/tyson', 'cosmos');

console.log('###Short circuiting');
h.on(['**'], function (msg, next) {
    if (msg === 'picard') {
        return next();
    }
});

console.log("// waiting on ['data', 'the', 'android'] and ['geordi', 'the', 'engineer'] emissions");
h.emit(['data', 'the', 'android'], 'picard');
h.emit(['geordi', 'the', 'engineer'], 'riker');


console.log('List of active routes: ');
console.log(h.list().join('\n'));

