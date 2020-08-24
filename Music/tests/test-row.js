const {Row, Pitch} = require('../Composition.js');

let row1 = new Row({
	members: [
		Pitch.fromString('C'),
		Pitch.fromString('E'),
		Pitch.fromString('A')
	]
});
console.log(`Row 1: ${row1.toString()}`);

let row2 = Row.fromString('A B C# F# G#');
console.log(`\nRow 2: ${row2.toString()}`);
console.log(` - Shuffle: [${row2.shuffle()}]`);
console.log(` - Random: ${row2.randomMember().toString()}`);

let row3 = Row.fromArray(row2.retrograde());
console.log(`\nRow 3: ${row3.toString()}`);

console.log(row3.toString());
