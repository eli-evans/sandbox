const {Note, Event, Rest, Pitch, Util, Duration, Dynamics, Articulation} = require ('../Composition.js');

console.log('\nAn empty event:');
let event = new Event();
event.dump();

console.log(`\nA default rest:`);
let rest = new Rest();
rest.dump();

console.log(`\nA default note:`)
let note = new Note();
note.dump();

console.log(`\nWith a random articulation:`);
note.articulation = Articulation.random();
note.dump();

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
	note.transpose(-3);
	console.log(`-3 steps: ${note.toString()}`);
});

