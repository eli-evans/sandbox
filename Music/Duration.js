const Tonal = require('@tonaljs/tonal');
const Base = require('./Base.js');
const Util = require('./Util.js');

/**
 * A duration is an object that encodes the length of a note or
 * other event. It can be expressed as beats (1 quarter = 1 beat)
 * or as ticks (1 beat = 128 ticks).
 */
class Duration extends Base {

	static TICKS_PER_BEAT = 128;

	/**
	 * Spawn a new duration from a number of beats.
	 * @param {number} ticks 
	 */
	constructor(beats = 1) {
		super();
		this.beats = beats;
	}

	/**
	 * Spawn a duration from a number of ticks.
	 * @param {number} ticks 
	 */
	static fromTicks(ticks = Duration.TICKS_PER_BEAT) {
		return new Duration(ticks / Duration.TICKS_PER_BEAT);
	}

	static _durationNames = {
		'w' : 4,
		'h.' : 3,
		'h' : 2,
		'q.' : 1.5,
		'q' : 1,
		'e' : 1/2,
		'e.' : (1/2) + (1/4),
		'triplet' : 1/3,
		'sixteenth' : 1/4,
		'quintuplet' : 1/5,
		'sextuplet' : 1/6,
	};

	static fromString(str = 'quarter') {
		let ret;
		let dur = Tonal.DurationValue.get(str);
		if (!dur.empty) {
			ret = new Duration(4 * dur.value);
		}
		else if (Duration._durationNames[str] !== undefined) {
			ret = new Duration(Duration._durationNames[str]);
		}
		return ret;
	}

	/**
	 * Get duration as ticks. Read-only. (Modify beats instead.)
	 * @type {number}
	 */
	get ticks() {
		return this._ticks;
	}

	/**
	 * Get duration as beats.
	 * @type {number}
	 */
	get beats() {
		return this._ticks / Duration.TICKS_PER_BEAT;
	}

	/**
	 * Set beats. (May round things off because of ticks resolution.)
	 * @param {number} n - a number of beats, eg, 2 for half note
	 */
	set beats(n) {
		this._ticks = Math.floor(n * Duration.TICKS_PER_BEAT);
		return this.beats;
	}

	/**
	 * A string value suitable for using with midi-writer-js
	 * @type {string}
	 */
	get midiWriterValue() {
		return 't' + this._ticks;
	}

	/**
	 * Mutate the duration by a factor, q. 
	 * @param {number} q - set to 2 to double, 0.5 to halve.
	 */
	scale(q = 1) {
		this._ticks = Math.floor(this._ticks * q);
		return this.beats;
	}

	/**
	 * Adds half again to the value of the duration. Has
	 * expected results when dotting a half note (2 beats -> 3 beats)
	 * but may not if you dot weird durations.
	 */
	dot() {
		this._ticks = Math.floor(
			(this.beats + (this.beats/2)) * Duration.TICKS_PER_BEAT
		);
		return this.beats;
	}

	/**
	 * Subtracts half again of the value of the duration. Has 
	 * expected results when un-dotting a dotted half note
	 * (3 beats -> 2) or dotted quarter (1.5 beats -> 1).
	 */
	undot() {
		this._ticks = Math.floor(
			(this.beats - (this.beats/2)) * Duration.TICKS_PER_BEAT
		);
		return this.beats;
	}

	/**
	 * Returns an array of all the names supported by this module.
	 */
	static names() {
		return Tonal.DurationValue.names().concat(
			Object.keys(Duration._durationNames)
		).sort();
	}

	toString() {
		return '' + this.beats;
	}

	/**
	 * For each duration in the array, dots every other duration, 
	 * and undots the following one. Good for turning a list of
	 * eighth notes into dotted-eighth sixteenth pairs. Doesn't change
	 * the overall duration of the pairs; whatever is added to the
	 * first unit in the pair is removed from the second on. Can result
	 * in negative values if the pairs aren't well-matched.
	 * @param {array} array 
	 */
	static dotPairs(array = []) {
		let diff = 0;
		array.forEach((d,i) => {
			if (i % 2 == 0) {
				let oldValue = d.ticks;
				d.dot();
				diff = d.ticks - oldValue; 
			 }	
			 else {
				 d._ticks -= diff;
				 diff = 0;
			 }		
		});
		return array;
	}

	static random(filter) {
		filter = filter || Object.keys(Duration._durationNames);
		filter = filter.map(d => {
			return d instanceof Duration ? d :
				Util.isString(d) ? Duration.fromString(d) :
				Util.isNumber(d) ? new Duration(d) :
				d;
		});
		return Util.randomElement(filter);
	}
}

module.exports = Duration;