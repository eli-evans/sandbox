const Tonal = require('@tonaljs/tonal');
const Base = require('./Base.js');
const Duration = require('./Duration.js');
const Pitch = require('./Pitch.js');
const Dynamics = require('./Dynamics.js');
const Util = require('./Util.js');

/**
 * A Note is a musical event that has pitch (or pitches sounded 
 * simultaneously), duration, and velocity. 
 */

class Note extends Base {

	/**
	 * Construct a note event.
	 * @param {object} params  
	 * @param {string} params.type - note|rest|chord
	 * @param {array} params.pitches - array of {@link Pitch} objects
	 * @param {Duration} params.duration - how long is the note (see {@link Duration})
	 * @param {integer} params.velocity - how loud is the note (0-127)
	 */
	constructor(params = {}) {
		super();
		this.init({
			type: 'note',
			pitches: [Pitch.fromString('C4')],
			duration: new Duration(1),
			velocity: 64
		}, params);
	}

	static fromPitch(pitch, duration = new Duration(1), velocity = Dynamics.mf) {
		return Note.fromPitches([pitch], duration, velocity);
	}

	static fromPitches(pitches, duration = new Duration(1), velocity = Dynamics.mf) {
		return new Note({pitches, duration, velocity});
	}

	/**
	 * Static factory to make a Note object from a string in a prescribed
	 * format: `pitches:duration:velocity`. Pitches are one or more 
	 * comma-separated strings specifying a {@link Pitch}. Duration is
	 * a single {@link Duration} value. Velocity is an integer between
	 * 1 and 100, or a string from {@link Dynamics}. 
	 * 
	 * @example
	 * let chord = Note.fromString('A4,C#5,E:half:mp');
	 * let note = Note.fromString('Eb6:8:99');
	 * 
	 * @param {string} str - the string
	 */
	static fromString(str) {
		let [p = 'C4', duration = 'q', velocity = 'mf'] = str.split(':');

		let pitches = [];
		p.split(/,/).forEach( pitch => {
			if (Pitch.isPitchName(pitch))
				pitches.push(Pitch.fromString(pitch));
			else
				throw new Error(`Bad pitch name ${pitch}`);
		});

		if (parseFloat(duration)) { 
			duration = new Duration(parseFloat(duration));
		}
		else {
			duration = Duration.fromString(duration) || new Duration(1);
		}

		if (velocity && parseInt(velocity)) { 
			velocity = Util.bounce(parseInt(velocity), 0, 127);
		}
		else {
			velocity = Dynamics.get(velocity) || Dynamics.mf;
		}

		return new Note({pitches, duration, velocity});
	}

	/**
	 * @returns an array of {@link Pitch} objects.
	 */
	get pitches() {
		return this._pitches;
	}

	/**
	 * @returns the first (or only) {@link Pitch} object in the note.
	 */
	get pitch() {
		return this._pitches[0];
	}

	/**
	 * @returns the {@link Duration} of the note.
	 */
	get duration() {
		return this._duration;
	}
	set duration(d) {
		this._duration = (d instanceof Duration) ? d : 
			(Util.isString(d) && Duration.get(d)) ? Duration.fromString(d) :
			(Util.isNumber(d)) ? new Duration(d) :
				d;
	}

	/**
	 * @returns the velocity of the note as an integer.
	 */
	get velocity() {
		return this._velocity;
	}
	set velocity(v) {
		this._velocity = Util.bounce(v, 0, 127);
	}

	/**
	 * Mutate the note by raising or lowering its pitch by a number
	 * of half-steps. Positive to go up, negative to go down.
	 * @param {integer} steps 
	 */
	transpose(steps = 1) {
		this._pitches.forEach(pitch => {
			pitch.transpose(steps);
		});
	}

	/**
	 * Mutate the note by multiplying its duration value by a
	 * quotient, eg, 2 to double, or .5 to halve.
	 * @param {number} q 
	 */
	scaleDuration(q = 1) {
		this._duration.scale(q);
	}

	/**
	 * @returns the note as a string suitable for initializing another
	 * {@link Note} object.
	 */
	toString() {
		return `${this.pitches.join(',')}:${this.duration}:${this.velocity}`;
	}
}

module.exports = Note;