// dependencies
const Tonal = require('@tonaljs/tonal');
const MidiWriter = require('midi-writer-js');

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Composition {
	constructor(p) {
		Object.assign(this, {
			title: 'Untitled',
			instruments: {},
			timeSignature: [4, 4],
			keySignature: 'C major',
			quanta: 'thirty-second',
			tempo: 120,
		}, p);
	}

	addInstrument(p) {
		let instr = new Instrument(p);
		this.instruments[instr.name] = instr;
		instr.index = Object.keys(this.instruments).length;
		return instr;
	}

	_mapDuration(dur) {
		return (Duration.get(dur).value * (128*4));
	}

	writeMidi(filename = 'output') {
		let instruments = Object.keys(this.instruments)
			.sort((a, b) => a.index - b.index)
			.map( r => this.instruments[r] );

		let tracks = [];
		
		instruments.forEach(instrument => {

			let track = new MidiWriter.Track();
			track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: instrument.patch }));

			track.addInstrumentName(instrument.name);
			track.addTrackName(instrument.name);

			track.setTimeSignature(this.timeSignature[0], this.timeSignature[1]);
			track.setKeySignature( ...Key.get(this.keySignature).midi);
			track.setTempo(this.tempo);

			let rest = 0;
			instrument.sequence.forEach(note => {
				if (note.type === 'rest') {
					rest += this._mapDuration(note.duration);
				}
				else {
					track.addEvent(
						new MidiWriter.NoteEvent({
							pitch: note.pitches,
							duration: 't' + this._mapDuration(note.duration),
							velocity: note.velocity,
							wait: 't' + rest,
							sequential: !(note.type === 'chord'),
						})
					);
					rest = 0;
				}
			});

			tracks.push(track);
		});

		console.log(`Saving to ${filename}.mid ...`);

		let writer = new MidiWriter.Writer(tracks);
		writer.saveMIDI(filename);
	}
	
	dump() {
		console.log(JSON.stringify(this, null, 4));
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Instrument {
	constructor(params) {
		Object.assign(this, {
			name: 'Instrument',
			patch: 0,
			range: ['C2', 'C8'],
			state: {
				pitch: 'C4',
				duration: 'quarter',
				velocity: Dynamics.get('mp'),
				octave: 4,
			},
			sequence: [],
		}, params);
	}

	octave(oct = 4) {
		this.state.octave = oct;
		return this;
	}

	duration(dur = Duration.get('quarter')) {
		this.state.duration = dur;
		return this;
	}

	velocity(vel = Dynamics.get('mf')) {
		this.state.velocity = vel;
		return this;
	}

	play(phr) {
		if (phr instanceof Phrase) {
			phr.pitches.forEach( (p,i) => {
				this.note({pitches: [phr.pitches[i]], duration: phr.durations[i]});
			});
		}
		return this;
	}

	note(p = {}) {
		// special case for note
		if (typeof p === 'string' || p instanceof String) {
			p = {pitches: [p]};
		}

		let params = {};
		Object.assign(params, {
			type: 'note',
			duration: this.state.duration,
			velocity: this.state.velocity,
			pitches: ['C4']
		}, p);

		params.pitches = this._correctPitches(params.pitches);

		this.sequence.push(new Note(params));
		return this;
	}

	chord(params) {
		Object.assign(params, { type: 'chord' }, params);
		this.note(params);
		return this;
	}

	rest(p = {}) {
		// special case for note
		if (typeof p === 'string' || p instanceof String) {
			p = {duration: p};
		}

		let params = {};
		Object.assign(params, { type: 'rest' }, p);
		this.note(params);
		return this;
	}

	_correctPitches(pitches) {
		if (pitches === undefined) {
			return [];
		}
		if (!Array.isArray(pitches)) {
			pitches = [pitches];
		}

		pitches.forEach((p, i) => {
			if (/^([a-gA-G#b]+)$/.test(p)) {
				pitches[i] = p + this.state.octave;
			}
		});
		return pitches;
	}

	repeat(n = 2, cb) {
		for (let i = 0; i < n; ++i) {
			cb();
		}
		return this;
	}

	dump() {
		console.log(JSON.stringify(this, null, 4));
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Phrase {
	constructor(params) {
		this.durations = [];
		this.pitches = [];

		if (typeof params === "string" || params instanceof String) {
			this.fromString(params);
		}
		else if (params === Object(params)) {
			this.fromObject(params);
		}
	}

	fromString(str) {
		str.split(' ').forEach( note => {
			let [pitch, duration] = note.split(':');

			let tone = Tonal.Note.get(pitch);
			if (tone && tone.name !== '') {
				this.pitches.push(tone.name);
			}

			if (Duration.get(duration)) {
				this.durations.push(Duration.get(duration).name);
			}
		});
	}

	fromObject(params) {
		Object.assign(this, {
			durations: [4, 4, 4, 4],
			pitches: [1, 2, 3, 4],
		}, params);

		// balance rhythm and pitches
		let [p, d] = [this.pitches, this.durations];

		if (p.length < d.length) {
			while(p.length < d.length) {
				p = p.concat(this.pitches);
			}
			this.pitches = p.slice(0, d.length);
		}

		else if (d.length < p.length) {
			while (d.length < p.length) {
				d = d.concat(this.durations);
			}
			this.durations = d.slice(0, p.length);
		}
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Key {
	static get(key = 'Cmaj') {
		let pitch, quality, scale;

		if (/^([A-Ga-g][#b]?)/.test(key)) {
			pitch = RegExp.$1.toUpperCase().replace(/B$/, 'b');
		}
		if (/Maj(or)?/i.test(key)) {
			let t = Tonal.Key.majorKey(pitch);
			return {
				midi : [t.alteration, 0],
				name: `${pitch} Major`,
				pitch: pitch,
				quality: "major",
				flats: 0,
				sharps: 0,	
				scale: t.scale			
			}
		}
		else if (/Min(or)?/i.test(key)) {
			let t = Tonal.Key.minorKey(pitch);
			return {
				midi : [t.alteration, 0],
				name: `${pitch} Minor`,
				pitch: pitch,
				quality: "minor",
				flats: 0,
				sharps: 0,	
				scale: t.natural.scale			
			}	
		}
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Scale {
	static get(mode = 'ionian', root = 'C4') {
		return Tonal.Mode.get(mode).intervals.map(Tonal.Note.transposeFrom(root));
	}

	static transpose(scale, steps) {
		return scale.map( p => Pitch.transpose(p, steps));
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Note {
	constructor(params) {
		Object.assign(this, {
			type: 'note',
			pitch: 'C4',
			duration: 4,
			velocity: 64
		}, params);
	}

	dump() {
		console.log(JSON.stringify(this, null, 4));
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Pitch {
	static get(name) {
		let pch = Tonal.Note.get(name);
		return pch;
	}

	static transpose(name, steps) {
		return Tonal.Note.fromMidi( Pitch.get(name).midi + steps );
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Dynamics {
	static get(name) {
		return (name === 'ppp') ? 16 * 1 :
			(name === 'pp') ? 16 * 2 :
			(name === 'p') ? 16 * 3 :
			(name === 'mp') ? 16 * 4 :
			(name === 'mf') ? 16 * 5 :
			(name === 'f') ? 16 * 6 :
			(name === 'ff') ? 16 * 7 :
			(name === 'fff') ? 16 * 8 - 1 :
			0;
	}

	static cresc(vel, amt) {
		vel += amt;
		return (vel > Dynamics.get('fff')) ? Dynamics.get('fff') :
			(vel < Dynamics.get('ppp')) ? Dynamics.get('ppp') :
			vel;
	}

	static decresc(vel, amt) {
		return Dynamics.cresc(vel, -amt);
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Duration {
	static get(name) {
		name = ('' + name).toLowerCase();
		name =
			(name === '1') ? 'whole' :
			(name === '2') ? 'half' :
			(name === '4') ? 'quarter' :
			(name === '8') ? 'eighth' :
			(name === '16') ? 'sixteenth' :
			(name === '32') ? 'thirty-second' :
			(name === '64') ? 'sixty-fourth' :
			name;

		let dur = Tonal.DurationValue.get(name);
		if (dur.empty) {

			// n-tuplet
			if (/^([0-9]+)-tuplet/.test(name)) {
				let n = parseInt(RegExp.$1);
				dur = {
					empty: false,
					name: name,
					fraction: [1, n],
					value: 1 * 1 / n,
					shorthand: `${n}t`,
					names: [name, `${n}t`]
				};
			}
		}
		return dur;
	}

	static toTicks(dur) {
		return Math.floor(128 * dur.value);
	}
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = {Composition, Instrument, Phrase, Key, Scale, Note,
		Pitch, Dynamics, Duration};


