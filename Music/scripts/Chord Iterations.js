const {Score, Voice, Sequence, Duration, Note,
	Dynamics, Util, Articulation, Scale, Pitch} = require('../Composition.js');
const { maybe } = require('../Util.js');

// Composition
let score = new Score({keySignature: 'c major', timeSignature: '4/4'});
let leftHand = score.addVoice({name: 'Piano'});

let chords = [
	'C4,E4,G4,C5', // major
	'E3,C4,G4,C5', // major 63
	'C4,E4,G4,B4', // major 7
	'C4,E4,G4,B4,D5', // major 9
	'C4,E4,Gb4,B4', // major 7 b5 

	'C4,Eb4,G4,C5', // minor
	'Eb3,C4,G4,C5', // minor 63
	'C4,Eb4,G4,Bb4', // minor 7
	'C4,Eb4,G4,Bb4,D5', // minor 9
	'C4,Eb4,Gb4,Bb4', // minor 7 b5

	'C4,Eb4,Gb4,A4', // full diminished
	'C4,Eb4,Gb4,Bb4', // half diminished
	
	'C4,Eb4,G#4,C5', // augmented
];

let roots = ['B3', 'Eb4', 'F4', 'Gb4'];

for (var i = 0; i < 20; ++i) {
	roots.forEach( r => {
		leftHand.play(getRandomChord(r));
	});

	leftHand.rest(4);
}


score.writeMidi('chords');

function getRandomChord(root) {
	let chord = Note.fromString(Util.randomElement(chords));
	chord.duration = 4;
	chord.transpose(Pitch.fromString(root).compareTo(chord.pitch));
	
	return chord;
}