const Duration = require('../Duration.js');
const Tonal = require('@tonaljs/tonal');

Duration.names().forEach(name => {
	let duration = Duration.fromString(name);
	console.log(`${name} = ${duration.ticks} ticks = ${duration.beats} beats`);
});

let dur = new Duration(1.75);
console.log(`\nbeats: ${dur.beats}; ticks: ${dur.ticks}`);
dur.scale(2/3);
console.log(`beats: ${dur.beats}; ticks: ${dur.ticks}`);

let half = new Duration(2);
half.dot();
console.log(`\nDotted half:\nbeats: ${half.beats}; ticks: ${half.ticks}`);
half.dot();
console.log(`\nDouble-dotted half:\nbeats: ${half.beats}; ticks: ${half.ticks}`);

let dots = [
	new Duration(1),
	new Duration(1),
	new Duration(.5),
	new Duration(.5),
	new Duration(.5)
];

console.log("\nMass dot:");
console.log(JSON.stringify(Duration.dotPairs(dots)));