const Tonal = require('@tonaljs/tonal');
const Base = require('./Base.js');
const Scale = require('./Scale.js');
const Pitch = require('./Pitch.js');

/**
 * A Key is used to set a key signature for a {@link Score}.
 * It supports only major and minor scales.
 * @param {string} key - the name of the key, eg, `C# Major`
 */
class Key extends Base {
	constructor(key = 'Cmaj') {
		super();

		let pitch = Pitch.getPitchClassName(key);

		if (Key.isMajor(key)) {
			let t = Tonal.Key.majorKey(pitch);
			this.init({
				midi : [t.alteration, 0],
				name: `${pitch} Major`,
				pitchClass: Pitch.fromString(pitch),
				quality: "major",
				flats: 0,
				sharps: 0,	
				scale: new Scale({mode: 'ionian', root: pitch})			
			});
		}
		else if (Key.isMinor(key)) {
			let t = Tonal.Key.minorKey(Pitch.getPitchClassName(key));
			this.init({
				midi : [t.alteration, 0],
				name: `${pitch} Minor`,
				pitchClass: Pitch.fromString(pitch),
				quality: "minor",
				flats: 0,
				sharps: 0,	
				scale: new Scale({mode: 'aeolian', root: pitch})			
			});
		}
	}

	/**
	 * @returns an array of two integers. The first is in the range
	 * of -7 to 7, and indicates the number of flats (negative) or 
	 * sharps (positive) in the key. The second is 0 for major, 
	 * 1 for minor. Read-only property.
	 * @type {number}
	 */
	get midi() {
		return this._midi;
	}

	/**
	 * @returns the name of the key. Ready-only property.
	 * @type {string}
	 */
	get name() {
		return this._name;
	}

	/**
	 * @returns the {@Link Scale} object that represents the scale
	 * implied by the key. Read-only property.
	 * @type {Scale}
	 */
	get scale() {
		return this._scale;
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

module.exports = Key;