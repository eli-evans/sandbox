const Base = require('./Base.js');
const Duration = require('./Duration.js');
const Pitch = require('./Pitch.js');
const Dynamics = require('./Dynamics.js');
const Util = require('./Util.js');
const Articulation = require('./Articulation.js');

/**
 * An Event is a base class for things that go into a 
 * {@link Sequence} notes, and rests. An event has
 * a type, a start time and a duration. 
 */

class Event extends Base {
	constructor (params = {}) {
		super();
		this.init({
			start: -1,
			duration: new Duration(1)
		}, params);
		this.duration = this.duration;
	}

	/**
	 * @returns the {@link Duration} of the event.
	 */
	get duration() {
		return this._duration;
	}

	/**
	 * Sets the {@link Duration} of the event.
	 * @type {Duration} or @type {Number} or @type {String} 
	 */
	set duration(d = 1) {
		this._duration = (d instanceof Duration) ? d : 
			(Util.isString(d) && Duration.get(d)) ? Duration.fromString(d) :
			(Util.isNumber(d)) ? new Duration(d) :
				d;
	}

	/**
	 * @returns the start point of the event in ticks. If set to -1,
	 * assumed to be zero ticks after the last event encountered, 
	 * if in a context that consists of a series of events, such
	 * as a {@link Sequence}. The start point is relative to the 
	 * container, so in a seque{@link Sequence}, 0 is the beginning
	 * of the sequence, and is added to the start point of the 
	 * sequence when placed into a track. 
	 * 
	 * @type {Number}
	 */
	get start() {
		return this._start;
	}

	/**
	 * Sets the absolute start point of the event, in ticks where 
	 * quarter = 128 ticks. Defaults to -1, which means no explicit
	 * start point. 
	 */
	set start(ticks = -1) {
		this._start = ticks;
	}

	/**
	 * Mutate the event by multiplying its duration value by a
	 * quotient, eg, 2 to double, or .5 to halve.
	 * @param {Number} q 
	 */
	scaleDuration(q = 1) {
		this._duration.scale(q);
	}
}

/**
 * A Rest is a kind of {@link Event} that specifies a pause for
 * a certain duration.
 */
class Rest extends Event {
	constructor(params = {}) {
		super(params);
	}
}

/**
 * A Note is a kind of {@link Event} that also specifies:
 * - pitch @type {Pitch} - the pitch of the note to play
 * -  
 */

class Note extends Event {

	/**
	 * Construct a note event. Pitch is always an array. If it has one
	 * element, it is a single note; if it has many, the notes are played
	 * simultaneously, a chord. Chord notes share velocity and duration. 
	 * To create independent polyphonic lines, play multiple overlapping
	 * notes into a sequence by specifying start time.
	 * 
	 * @param {object} params  
	 * @param {array} params.pitches - array of {@link Pitch} objects
	 * @param {Duration} params.duration - how long is the note (see {@link Duration})
	 * @param {Number} params.velocity - how loud is the note (0-127)
	 * @param {Number} params.articulation - technique specifier (see {@link Articulation})
	 */
	constructor(params = {}) {
		super(params);
		this.init({
			pitches: [Pitch.fromString('C4')],
			duration: new Duration(1),
			velocity: 64,
			articulation: Articulation.Default,
		}, params);
	}

	/**
	 * Promote a pitch object to a note by adding optional duration and velocity.
	 * @param {Pitch} pitch 
	 * @param {Duration} duration 
	 * @param {number} velocity
	 * @param {Articulation} articulation
	 */
	static fromPitch(pitch, duration = new Duration(1), velocity = Dynamics.mf, articulation = Articulation.Default) {
		return Note.fromPitches([pitch], duration, velocity, articulation);
	}

	/**
	 * Promote an array of pitch objects to notes by adding optional duration and velocity.
	 * @param {array} pitches - of {@link Pitch} objects 
	 * @param {Duration} duration
	 * @param {number} velocity 
	 * @param {number} articulation
	 */
	static fromPitches(pitches, duration = new Duration(1), velocity = Dynamics.mf, articulation = Articulation.Default) {
		return new Note({pitches, duration, velocity, articulation});
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
	 * @returns the velocity of the note as an integer.
	 */
	get velocity() {
		return this._velocity;
	}
	set velocity(v) {
		this._velocity = Util.bounce(v, 0, 127);
	}

	/**
	 * @returns the articulation 
	 */
	get articulation() {
		return this._articulation;
	}
	set articulation(a) {
		if (!a instanceof Articulation)
			throw new Error('Must set articulation to an Articulation object.');
		
		this._articulation = a;
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
	 * @returns the note as a string suitable for initializing another
	 * {@link Note} object.
	 */
	toString() {
		return `${this.pitches.join(',')}:${this.duration}:${this.velocity}`;
	}
}

module.exports = {Note, Rest, Event};