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
console.log(` - Random: ${row2.randomMember().toString()}`);
row2.shuffle();
console.log(` - Shuffled: ${row2.toString()}`);

let row3 = Row.fromArray(row2.retrograde);
console.log(`\nRow 3: ${row3.toString()}`);

let row4 = Row.twelveToneRow();
console.log(`\nRow4: ${row4.toString()}`);
console.log(` - Inverted: ${row4.inversion}`);
