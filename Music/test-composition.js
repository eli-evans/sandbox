const {Composition, Scale, Phrase, Pitch} = require('./Composition.js');
// const Tonal = require('@tonaljs/tonal');

const modes = [	'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian' ];
const scale = Scale.get('major', 'C5');

let comp = new Composition({tempo: 72, timeSignature: [5,4], keySignature: "C major"});
let violins = comp.addInstrument({ name: 'Violins' });
let violas = comp.addInstrument({ name: 'Violas' });
let cellos = comp.addInstrument({ name: 'Cellos' });

violins.octave(5);
cellos.octave(3);

for (cycle = 1; cycle <= 10; ++cycle) {

	rotate(scale);
	rotate(modes);

	violinScale = Scale.get(modes[0], scale[0]);
	violaScale = Scale.transpose( Scale.get(modes[0], scale[0]), -24+7);
	celloScale = Scale.transpose( Scale.get(modes[0], scale[0]), -24);

	let ost = new Phrase({
		durations: [4],
		pitches: [1,2,1,4,5].map( p => violinScale[p-1] ),
	});
	// console.log(ost);

	for(m = 1; m <= 8; ++m) {
		violins.play(ost);
		
		if (m == 8) {
			cellos.repeat(5, () => cellos.note(Pitch.transpose(celloScale[0], 12)));
			violas.repeat(5, () => violas.note(Pitch.transpose(violaScale[0], 12)));
		}
		else {
			cellos.repeat(5, () => cellos.note(celloScale[m-1]));
			violas.repeat(5, () => violas.note(violaScale[m-1]));
		}
	}
	[violins, violas, cellos].map(i => i.rest('whole').rest('quarter'));
}

comp.dump()

comp.writeMidi();

function rotate(arr) {
	arr.push(arr.shift());
}