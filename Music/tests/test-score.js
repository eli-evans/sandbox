const {Score, Voice, Sequence, Duration, 
	Dynamics, Util, Articulation} = require('../Composition.js');

// Composition
let score = new Score({keySignature: 'g major', timeSignature: '4/4'});
score.addVoice({name: 'Player 1'});
score.addVoice({name: 'Player 2'});

score.voices.forEach((player, i) => {
	let aPitches = score.keySignature.scale.randomBetween(`G${4-i}`, `D${5-i}`, 17);
	let a = Sequence.fromPitches(aPitches);
	a.sequence.forEach(m => {
		m.duration = Util.randomElement([.5, 1, 2]);
		m.velocity = Dynamics.get(Util.randomElement(['mf', 'f']));
		m.articulation = Articulation.random();
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
// score.dump();

console.log(`Second measure: ${score.voice('Player 1').measureTicks(2)} ticks`);