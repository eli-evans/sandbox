const Tonal = require('@tonaljs/tonal');
const Row = require('./Row.js');
const Pitch = require('./Pitch.js');
const Util = require('./Util.js');

class Scale extends Row {

	constructor(params = {}) {
		super();
		this.init({mode: 'ionian', root: Pitch.fromString('C4'), members: []}, params);

		this._mode = this._mode.toLowerCase();
		if (Scale.isMajor(this._mode))
			this._mode = 'ionian';
		if (Scale.isMinor(this._mode))
			this._mode = 'aeolian';

		// if no pitches specified, fill them in
		if (this._members.length === 0) {
			this._members = Tonal.Mode.get(this._mode).intervals
				.map(Tonal.Note.transposeFrom(this._root));
		}

		this._members = this._members.map(p => Pitch.fromString(p));
	}

	static fromString(name = 'C major') {
		let pitch = Pitch.getPitchName(name);
		if (Scale.isMajor(name))
			return new Scale({mode: 'ionian', root: Pitch.fromString(pitch)});
		if (Scale.isMinor(name))
			return new Scale({mode: 'aeolian', root: Pitch.fromString(pitch)});
	}

	get members() {
		return this._members;
	}
	get mode() {
		return this._mode;
	}
	get root() {
		return this._root;
	}

	randomMembers(count = 1) {
		let ret = [];
		for (var i = 0; i < count; ++i) {
			ret.push(Util.randomElement(this.members));
		}
		return ret;
	}

	randomPitches(count = 1) {
		let ret = [];
		for (var i = 0; i < count; ++i) {
			ret.push(Util.randomElement(this.family));
		}
		return ret;
	}

	randomBetween(min, max, count = 1) {
		let ret = [];

		if (Pitch.isPitchName(min))
			min = Pitch.fromString(min);
		if (Pitch.isPitchName(max))
			max = Pitch.fromString(max);

		for (var i = 0; i < count; ++i) {
			let r;
			
			// try as many as 100 times
			Rand: for (let j = 0; j < 100; ++j) {
				r = Util.randomElement(this.family);
				if (r.midi >= min.midi && r.midi <= max.midi)
					break Rand; // got it
			}
			ret.push(r);
		}
		return ret;
	}

	transpose(steps) {
		let temp = new Scale({mode: this.mode, root: Pitch.fromTransposition(this.root, steps)});
		Object.assign(this, temp);
	}

	degree(n) {
		// starts at 1
		return this.members[ parseInt(n) - 1 ].replace(/[0-9]+$/, '');
	}

	toString() {
		let members = this.members.map(p => p.name);
		return `${this.name}: {${members.join(', ')}}`;
	}

	get family() {
		let family = [];
		this.members.forEach( p => {
			family = family.concat(p.family);
		});
		return family.sort(Pitch.compare);
	}

	get name() {
		return `${this._root} ${this._mode}`; 
	}

	/**
	 * @returns true if this is the name of a major key.
	 * @param {string} str - string to test 
	 */
	static isMajor(str) {
		return /Maj(or)?/i.test(str);
	}

	/**
	 * @returns true if this is the name of a minor key.
	 * @param {string} str - string to test 
	 */
	static isMinor(str) {
		return /Min(or)?/i.test(str);
	}
}

module.exports = Scale;