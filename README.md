# HevEmitter

A Hierarchical event emitter with promise.  

## Examples

### Creating a new emitter

```javascript
var HevEmitter = require('hevemitter');
var H = HevEmitter.EventEmitter;
var h = new H();
```

### Listening for hierarchical events

```javascript
h.on(['finn', 'the', 'human'], function () {
    console.log('jake the dog');
});

h.on(['finn', 'the', 'peasant'], function (msg) {
    console.log(msg, ' the cat');
});
```

The event listener may only receive on data argument.  Any second
argument is assumed to be a callback function used for short
circuiting the event hierarchy.

### Emitting a hierarchical event

```javascript
h.emit(['finn', 'the', '*'], 'cake');
```

Here the `*` means to trigger all events at that level.  With the
listeners from the previous example, we expect the output:
```shell
jake the dog
cake the cat
```

### Emitting to all listeners in a hierarchy

This would trigger the same output:
```javascript
h.emit(['finn', '**'], 'cake');
```
Here, `**` refers to all listeners to events at that level, the parent
route (`['finn']`), and all descendants.


### Listening to all events in a hierarchy
```javascript
h.on(['finn', '**'], function () {
    console.log('princess bubblegum');
});
```
This would listen to an event route of any length, with `'finn'` in the first position.

For example
```javascript
h.emit(['finn', 'the', 'human'], 'cake');
```

Outputs:
```shell
jake the dog
princess bubblegum
```

The specific route `['finn', 'the', 'peasant']` did not match this time, however the general route `['finn', '**']` did.

### Removing events in a hierarchy

```javascript
h.on(['*', 'the', '*'], function (msg) {
  console.log('Hello ', msg);
});
h.removeAllListeners(['finn', '**']);
h.emit(['finn', 'the', '*'], 'EventEmitter');
```
Here, we've removed all events starting with 'finn', leaving only the
'hello' listener.  So the resulting output is:
```shell
Hello EventEmitter
```

Note that removing `**` events removes `**`, `*` and `'name'` listeners.

Removing `*` removes only `*` listeners and `'name'` lisenters.

Removing `'name'` listeners removes only `name` listeners.

### Short circuiting

If the event listener has a second argument, it must be a callback
function indicating whether the listeners to descendant events should
be invoked.  If the callback function is not invoked, or invoked with
a truthy argument, no further events will not be invoked.

The order of callback at every level is `**` events first, then `*`
events, then `'name'` events (in no particular order), followed by
descendant events.

Currently, we have only the `['*', 'the', '*']` listener.  We can
enforce that only greetings to Captain Picard are allowed:
```
h.on(['**'], function (msg, next) {
  if (msg === 'picard') {
    return next();
  }
});

h.emit(['data', 'the', 'android'], 'picard');
h.emit(['geordi', 'the', 'engineer'], 'riker');
```
This will output only
```
Hello picard
```
The message to Commander Riker will be blocked.


