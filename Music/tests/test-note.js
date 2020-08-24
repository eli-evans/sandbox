const {Note, Pitch, Util, Duration, Dynamics} = require ('../Composition.js');

console.log('\nNotes from string specs:');
('C4,E4,G4::mf C4 E4 G4 G#4:.5:ff G#4:.5:pp'.split(' ')).forEach(noteSpec => {
	let note = Note.fromString(noteSpec);
	console.log(note.toString());
});

console.log('\nNotes from each pitch class, with random duration and velocity:');
Pitch.pitchClasses.forEach(pitchClass => {
	let pitches = [Pitch.fromString(pitchClass + '4')];
	let duration = new Duration(Util.randomElement([.25, .5, 1, 1.5, 2]));
	let velocity = Dynamics.get(Util.randomElement(['mf', 'f', 'ff']));

	let note = new Note({pitches, duration, velocity});
	console.log(note.toString());
});

