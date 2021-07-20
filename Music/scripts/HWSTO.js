const {Score, Voice, Sequence, Duration, Note,
	Dynamics, Util, Articulation, Scale, Pitch} = require('../Composition.js');
const { maybe } = require('../Util.js');

// Composition
let score = new Score({keySignature: 'c major', timeSignature: '4/4'});
let leftHand = score.addVoice({name: 'Left Hand'});
let rightHand = score.addVoice({name: 'Right Hand'});

let dPentatonic = new Scale({
	mode: 'pentatonic',
	root: Pitch.fromString('D'),
	members: ['D1', 'E1', 'F#1', 'A2', 'B2']
});

let leftSequence = new Sequence();

Util.repeat(4*16, () => {
	if (maybe()) {
		leftSequence.addNote( 
			new Note({
				pitches: dPentatonic.randomBetween('D3', 'B3'),
				duration: Duration.fromString('h'),
				velocity: Util.maybe(.66) ? Dynamics.pp : Dynamics.mp,
			})
		)
	}
	else {
		let note = new Note({
			pitches: dPentatonic.randomBetween('D3', 'E4'),
			duration: Duration.fromString('q'),
			velocity: Dynamics.pp});
		leftSequence.addNote(note);
		leftSequence.addNote(note);
	}

});

leftHand.playSequence(leftSequence);

let rightSequence = Sequence.fromSequence(leftSequence)
rightSequence.diminute();
rightSequence.transpose(12);
Util.repeat(2, () => rightHand.playSequence(rightSequence));

score.writeMidi('hwsto');


