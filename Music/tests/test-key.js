const Key = require('../Key.js');

let key = new Key('Ab minor');
key.dump();

console.log(`MIDI: ${key.midi}`);
console.log(`Name: ${key.name}`);
console.log(`Scale: ${key.scale.toString()}`);

