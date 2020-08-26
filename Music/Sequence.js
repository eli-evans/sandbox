const Base = require('./Base.js');
const Util = require('./Util.js');
const {Note, Rest} = require('./Note.js');
const Duration = require('./Duration.js');
const Dynamics = require('./Dynamics.js');
const Articulation = require('./Articulation.js');
const Pitch = require('./Pitch.js');
const { exception } = require('console');

/**
 * A Sequence is an ordered list of notes.
 */

class Sequence extends Base {

	/**
	 * Make a sequence from a list of notes.
	 * @param {object} notes - list of note strings or {@link Note} objects
	 */
	constructor(notes = []) {
		super();
		this.init({sequence: []});
		notes.forEach(note => {
			this.addNote(note);
		});
	}

	/**
	 * Synonym for the normal constructor.
	 * @param {array} array - list of note strings or {@link Note} objects 
	 */
	static fromArray(array = []) {
		return new Sequence(array);
	}

	static fromPitches(array = []) {
		return new Sequence(array.map(p => Note.fromPitch(p)));
	}

	/**
	 * Constructs a Sequence from two arrays:
	 * @param {array} pitchNames - array of pitch names, eg, ['F#2']
	 * @param {array} durations - array of duration values, in beats, eg, [2]
	 * 
	 * The arrays will be balanced, that is, they will be forced to be
	 * the same length. This is accomplished by concatenating the elements
	 * of a shorter array into itself until it is as long as the longer array.
	 * In this way, you can pass a long array of pitchNames and a 
	 * short array of durations and then expect that rhthmic
	 * 'motif' to be repeated over the length of the pitches.
	 */
	static fromMatrix(pitchNames = ['C4'], durations = [1]) {
		let seq = new Sequence();
		
		// balance rhythm and pitches
		let [p, d] = [pitchNames, durations]; 

		while (p.length !== d.length) {
			[p, d] = Util.balance(pitchNames, durations);
			[pitchNames, durations] = [p,d];
		}

		d.forEach( (duration,i) => {
			seq.addNote( new Note( {
				type: Util.isRest(p[i]) ? 'rest' : 'note',
				pitches: [p[i]],
				duration: d[i]
			}));
		});

		return seq;
	}

	/**
	 * Constructs a Sequence given a string
	 * @param {string} str 
	 */
	static fromString(str = 'C4') {
		let seq = new Sequence();

		str.split(' ').forEach(note => {
			seq.addNote(Note.fromString(note));
		});
		return seq;
	}

	/**
	 * Returns a clone of a Sequence object.
	 * @param {Sequence} seq 
	 */
	static fromSequence(seq = new Sequence()) {
		return Sequence.fromArray(seq.sequence);
	}

	/**
	 * Returns a new {@link Sequence} with notes in reverse order.
	 * Not technically a 'retrograde' because a sequence is not a
	 * tone row, because it can have repeated pitch classes, but
	 * it's close enough.
	 */
	static fromRetrograde(seq = new Sequence()) {
		return Sequence.fromArray(seq.retrograde());
	}

	/**
	 * Read-only array of notes in the sequence.
	 */
	get sequence() {
		return this._sequence;
	}

	/**
	 * Adds a note to the sequence and returns it. You can use an already-
	 * constructed {@link Note} object, or a string suitable for use with 
	 * the {@link Note.fromString()} method.
	 * @param {Note} note - the {@link Note} object or note name string 
	 */
	addNote(note = 'C4') {
		this._sequence.push(note instanceof Note ? note : Note.fromString(note));
		return this._sequence[this._sequence.length - 1];
	}

	/**
	 * @returns the "retrograde" of the notes in the sequence, that is,
	 * an array of {@link Note} objects in reverse order. Not technically
	 * a retrograde row, since a sequence can have have repeated pitches,
	 * but it's close enough.
	 */
	retrograde() {
		let temp = this.sequence;
		temp.reverse();
		return temp;
	}

	/**
	 * @returns the "inversion" of the notes in the sequence, that is,
	 * an array of the notes in the sequence, but subtracted from the
	 * highest note's absolute midi value.  
	 */
	invert() {
		throw new exception('Not implemented'); // TODO
	}

	/**
	 * Increases all the durations in the sequence by a factor of 2.
	 */
	augment() {
		this.scaleDuration(2);
	}

	/**
	 * Decreases all the durations in the sequence by cutting them in half.
	 */
	diminute() {
		this.scaleDuration(.5);
	}

	/**
	 * Increases or decreases all the durations in the sequence by
	 * multiplying them by a quotient. 
	 * 
	 * @param {number} q - the quotient. Set to a fraction for 
	 * diminuition (eg, 0.25 will cut quarters into sixteenths), or
	 * to a number larger than 1 to augment (eg, 3 will turn quarters
	 * into dotted quarters). Behavior of values greater than 4 or 
	 * less than 0 are not defined. It's possible to scale duration
	 * too high or too low, so just be careful.
	 */
	scaleDuration(q = 1.0) {
		this.sequence.forEach( note => {
			note.scaleDuration(q);
		});
	}

	/**
	 * Mutates all the notes in the sequence by moving their pitches
	 * up or down by a number of halfsteps.
	 * @param {integer} steps - negative to go down, positive to go up
	 */
	transpose(steps = 0) {
		this.sequence.forEach(note => {
			note.transpose(steps);
		});
	}
}

module.exports = Sequence;