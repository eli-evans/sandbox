const Util = require('./Util.js');
const Base = require('./Base.js');
const Sequence = require('./Sequence.js');
const {Note, Rest} = require('./Note.js');
const Pitch = require('./Pitch.js');
const Duration = require('./Duration.js');

/**
 * A Voice represents a single instrument or singer that plays notes into a sequence.
 */

class Voice extends Base {
	constructor(params = {}) {
		super();
		this.init({
			name: 'Voice',
			patch: 0,
			range: [Pitch.fromString('C0'), Pitch.fromString('C9')],
			sequence: [],
			measure: 4,
		}, params);
	}

	/**
	 * Get the name of the voice.
	 * @type {string}
	 */
	get name() {
		return this._name;
	}

	/**
	 * Set the name of the voice.
	 * @type {string}
	 */
	set name(name) {
		this._name = name;
	}

	/**
	 * Gets the midi patch number of the voice.
	 * @type {string}
	 */
	get patch() {
		return this._patch;
	}

	/**
	 * Gets the current value of the midi patch number. 
	 * Note that setting this does not add a patch change
	 * event to the sequence, it changes the entire voice from
	 * the beginning.
	 */
	set patch(n) {
		this._patch = n;
	}

	/**
	 * Gets the range of the voice, a two-element array where the
	 * first element is a {@link Pitch} representing the lowest
	 * note the voice should play and the last is a {@link Pitch}
	 * representing the highest note. Read-only.
	 */
	get range() {
		return this._range;
	}

	/**
	 * Gets the sequence of notes in the voice. Will be an array of {@link Note} objects.
	 * Read-only property.
	 * @type {array}
	 */
	get sequence() {
		return this._sequence;
	}

	get measure() {
		return this._measure;
	}
	set measure(m) {
		this._measure = m;
	}

	measureTicks(n = 1) {
		let start = new Duration(n * this._measure);
		let dur = new Duration(this._measure);
		return [start.ticks, start.ticks + dur.ticks];
	}

	/**
	 * A shortcut for playSequence(), playArray(), playString(), or playNote() 
	 * depending on what you send it. 
	 * @param {any} seq 
	 */
	play(seq = new Sequence()) {
		let err;
		seq instanceof Sequence ? this.playSequence(seq) :
			seq instanceof Note ? this.playSequence(new Sequence([seq])) :
			Util.isArray(seq) ? this.playArray(seq) :
			Util.isString(seq) ? this.playString(seq) :
			err = `Can't play ${seq}`;
		
		if (err !== undefined)
			throw new Error(err);
		
		return this;
	}

	/**
	 * Adds a rest to this voice of a given duration.
	 * @param {Duration} d 
	 */
	rest(d = 1) {
		this._sequence.push(new Rest(d));
	}

	/**
	 * Adds the notes from a {@link Sequence} object into the voice's sequence. 
	 * This is the basic way to "play" notes.
	 * @param {Sequence} seq 
	 */
	playSequence(seq = new Sequence()) {
		seq.sequence.forEach((note,i) => {
			this._sequence.push(note);
		});
	}

	/**
	 * Plays an array of {@link Note} objects or strings in the format accepted 
	 * by {@link Note.fromString()}.
	 * @param {array} seq - list of notes to play into the sequence 
	 */
	playArray(seq = []) {
		this.playSequence(Sequence.fromArray(seq));
	}

	/**
	 * Plays a string given a sequence of notes. Same format as {@link Sequence}.
	 * @param {string} str 
	 */
	playString(str = '') {
		this.playSequence(Sequence.fromString(str));
	}
}

module.exports = Voice;