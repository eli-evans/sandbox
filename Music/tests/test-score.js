const {Score, Voice, Sequence, Duration, Dynamics, Util} = require('../Composition.js');

// Composition
let score = new Score({keySignature: 'g major'});
score.addVoice({name: 'Player 1'});
score.addVoice({name: 'Player 2'});

score.voices.forEach((player, i) => {
	let aPitches = score.keySignature.scale.randomBetween(`G${4-i}`, `D${5-i}`, 3);
	let a = Sequence.fromPitches(aPitches);
	a.sequence.forEach(m => {
		m.duration = 1;
		m.velocity = Dynamics.get(Util.randomElement(['mf', 'f']));
	});

	let bDurations = [];
	for (let i = 0; i < 24; ++i) {
		bDurations.push(Duration.random([1, .5]));
	}
	let b = Sequence.fromMatrix(aPitches, bDurations);
	b.sequence.forEach(m => {
		m.velocity = Dynamics.get(Util.randomElement(['mf', 'f']));
	});

	let cDurations = [];
	for (let i = 0; i < 48; ++i) {
		cDurations.push(Duration.random([.5, .25]));
	}
	let c = Sequence.fromMatrix(aPitches, cDurations);

	player.play(a).play(a).play(a).play(a).play(b).play(c).play(a);
});

score.writeMidi('test-score');