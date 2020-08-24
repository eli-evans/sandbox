const Base = require('./Base.js');
const Util = require('./Util.js');

/**
 * A Pitch is the combination of a pitch class name and an octave
 * specification. A Pitch object represents a single tone. A pitch 
 * with an unspecified octave is a pitch class, so 'C' is valid and 
 * implies 'C0', 'C1', ... 'C9'. 
 */

class Pitch extends Base {

//
// Class data
//

static pitchClasses = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
static sharpClasses = ['B#', 'C#', 'D', 'D#', 'E', 'E#', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
static flatClasses = ['C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb'];

//
// Construction
//

	/**
	 * Initialize a pitch with a number between 0 and 127. You probably
	 * want to use {@link Pitch.fromString} to initialize from a string name instead.
	 */
	constructor(value = 60) {
		super();
		this._value = Util.bounce(value, 0, 127);
	}

	/**
	 * Initialize a Pitch object with a string pitch name, which is 
	 * a pitch class name plus an optional octave specifier
	 * @param {string} name - for example `D#7` or `G3` or `Eb`
	 */
	static fromString(name = 'C4') {
		let pitch = new Pitch();

		if (Pitch.isPitchName(name)) {
			let steps = Pitch.getSteps(name);
			let octave = Pitch.getOctave(name) || 0;
			pitch._value = Util.bounce((octave + 1) * 12 + steps, 0, 127);
		}
		else {
			throw new Error(`Cannot initialize Pitch with ${name}`);
		}
		
		return pitch;
	}

	/**
	 * Spawn a new Pitch from a {@link Pitch}. 
	 * @param {Pitch} pitch
	 */
	static fromPitch(pitch) {
		return new Pitch(pitch.value);
	}

	/**
	 * @returns a new pitch given a pitch and transposition.
	 * @param {Pitch} pitch 
	 * @param {number} steps 
	 */
	static fromTransposition(pitch, steps) {
		return new Pitch(pitch.value + steps, 0, 127);
	}

//
// Public Property Accessors
//

	/**
	 * @returns {string} name of the pitch, qualified with an octave, if any. Read-only property.
	 */
	get name() {
		return this.pitchClass + this.octave;
	}

	/**
	 * @returns {string} representing the pitch class. Read-only property.
	 */
	get pitchClass() {
		return Pitch.pitchClasses[this.steps];
	}

	/**
	 * @returns {string} representing the pitch class, but sharp. Read-only.
	 */
	get sharpName() {
		return Pitch.sharpClasses[this.steps] + this.octave;
	}

	/**
	 * @returns {string} representing the pitch class, but flat. Read-only.
	 */
	get flatName() {
		return Pitch.flatClasses[this.steps] + this.octave;
	}

	/**
	 * @returns an integer that represents the octave of the ptich. Read-only.
	 * Hint: use the {@link transpose} method to change octaves (+12 = up one octave)
	 */
	get octave() {
		return Math.floor(this._value / 12) - 1;
	}

	/**
	 * @returns {number} (int) between 0 and 127 representing the absolute MIDI value of the pitch.
	 */
	get midi() {
		return this._value;
	}

	/**
	 * @returns {number} (int) between 0 and 127 representing the absolute MIDI value of the pitch.
	 */
	get value() {
		return this._value;
	}

	/**
	 * @returns the chromatic note count of the pitch class where C is 0 and B natural is 11. 
	 * @type {number}
	 */
	get steps() {
		return this._value % 12;
	}

	/**
	 * @returns an array of all the pitches in the range C0-G10 (midi note 0-127)
	 * that are implied by the pitch class. That is: All the notes with this name
	 * in all the octaves.
	 */
	get family() {
		let ret = [];

		for(let n = 0; n < 128; ++n) {
			if ((n % 12) === this.steps) {
				ret.push(new Pitch(n));
			}
		}
		
		return ret;
	}

//
// Instance Methods
//

	/**
	 * Mutates the pitch by raising or lowering it by a number of
	 * half-steps.
	 * @param {integer} steps - negative to go down, positive up
	 */
	transpose(steps) { 
		this._value = Util.bounce(this._value + steps);
		return this;
	}

	/**
	 * Returns 1 if the pitch is higher, 0 if it's the same, -1 if it's lower
	 * (in absolute terms). 
	 * @param {Pitch} pitch 
	 */
	compareTo(pitch) {
		return this._value - pitch._value;
	}

	/**
	 * @returns the object as a string, the pitch name.
	 */
	toString() {
		return this.name;
	}

//
// Class Methods
//

	/**
	 * @returns {number} between 0 and 11 representing the pitch class in a given string.
	 * 'C' = 0, and 'B' = 11
	 * @param {name} name
	 */
	static getSteps(name) {
		let pitchClass = Pitch.getPitchClassName(name);

		let index = Pitch.sharpClasses.indexOf(pitchClass);
		if (index === -1)
			index = Pitch.flatClasses.indexOf(pitchClass);
		if (index === -1)
			throw new Error(`Unable to get steps from ${name}`);
		
		return index;
	}

	/**
	 * @returns true if the string is a conforming pitch name with 
	 * pitch class and optional octave. Will return true with or without 
	 * ocatve specifier.
	 * @param {string} str - the string to test
	 */
	static isPitchName(str) {
		return /^[A-Ga-g][#b]*[0-9]*$/.test(str);
	}

	/**
	 * @returns true if the string is a pitch class name. Will return
	 * false if an octave is specified.
	 * @param {string} str 
	 */
	static isPitchClassName(str) {
		return /^[A-Ga-g][#b]*$/.test(str.toString());
	}

	/**
	 * @returns an integer representing the octave from a given
	 * string that is purportedly a pitch name. Undefined if
	 * no match.
	 * @param {string} str - the string to extract from
	 */
	static getOctave(str) {
		let ret;
		if (/([0-9]+)$/.test(str)) {
			ret = parseInt(RegExp.$1);
		}
		return ret;
	}

	/**
	 * @returns the pitch name portion of a string, with or without octave.
	 * Useful for turning eg, 'Ab major' into just 'Ab'.
	 * @param {string} str 
	 */
	static getPitchName(str) {
		let ret = str;
		if (/^([A-Ga-g][#b]?[0-9]*)/.test(str.toString())) {
			ret = RegExp.$1.toUpperCase()
				.replace(/([A-G])B([0-9]?)$/, '$1b$2');
		}
		return ret;
	}

	/**
	 * @returns the pitch class name portion of a string. Useful for turning
	 * eg, 'Ab6' into just 'Ab'.
	 * @param {string} str 
	 */
	static getPitchClassName(str) {
		let ret = str;
		if (/^([A-Ga-g][#b]?)/.test(str.toString())) {
			ret = RegExp.$1.toUpperCase().replace(/([A-G])B$/, '$1b');
		}
		return ret;
	}

	/**
	 * @returns true if the string has a sharp accidnetal.
	 * @param {string} name 
	 */
	static isSharp(name) {
		return /#[0-9]*$/.test(name.toString());
	}

	/**
	 * @returns true if the string has a flat accidental.
	 * @param {string} name 
	 */
	static isFlat(name) {
		return /b[0-9]*$/.test(name.toString());
	}

	/**
	 * @returns the sharp equivalent of the pitch string, if it it is a flat
	 * @param {string} name 
	 */
	static sharpOf(name) {
		throw new Error("Not implemented");
	}

	/**
	 * @returns the flat equivalent of the pitch string, if it is a sharp
	 * @param {string} name 
	 */
	static flatOf(name) {
		throw new Error("Not implemented");
	}

	/**
	 * @returns 1 if the pitch is higher, 0 if they're the same, -1 if it's lower
	 * (in absolute terms).
	 * @param {Pitch} a
	 * @param {Pitch} b 
	 */
	static compare(a, b) {
		return a._value - b._value;
	}
}

module.exports = Pitch;