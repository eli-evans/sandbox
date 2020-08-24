const {Note, Pitch} = require('../Composition.js');

let octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let pitchClasses = 'B# C C# Db D D# Eb E E# Fb F F# Gb G G# Ab A A# Bb B'.split(' ');

octaves.forEach( o => {
	pitchClasses.forEach( p => {
		let pitch = Pitch.fromString(`${p}${o}`);

		console.log(`\nPitch ${p}${o} -> ${pitch.name}`);
		console.log(` - pitchClass: ${pitch.pitchClass}`);
		console.log(` - octave: ${pitch.octave}`);
		console.log(` - value: ${pitch.value}`);
		console.log(` - sharp name: ${pitch.sharpName}`);
		console.log(` - flat name: ${pitch.flatName}`);
		console.log(` - steps: ${pitch.steps}`);
		console.log(` - family: ${pitch.family}`);
	});
});