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
