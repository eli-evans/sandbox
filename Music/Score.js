const MidiWriter = require('midi-writer-js');

const Util = require('./Util.js');
const Base = require('./Base.js');
const Voice = require('./Voice.js');
const Key = require('./Key.js');
const Duration = require('./Duration.js');

/**
 * A Score is a collection of voices that comprises a single piece of
 * music.
 */

class Score extends Base { 

	/**
	 * Constructor from parameters.
	 * @param {object} params - key value pairs to initialize the object 
	 * @param {string} title - what to call this score. Default 'Untitled'.
	 * @param {array} voices - array of {@link Voice} objects that represent the
	 * individual players of the piece. Default none.
	 * @param {array} timeSignature - array of two integers, a numerator and 
	 * a denominator to define the time signature of the piece (eg, [3,4] is 3/4)
	 * (default: [4,4])
	 * @param {Key} keySignature - a {@link Key} object or a string to initialize 
	 * one from to represent the tonality of the piece (default: C Major)
	 * @param {Duration} quanta - the smallest note duration (default: thirty-second)
	 * @param {integer} tempo - expressed in beats per minute (default: 120)
	 */
	constructor(p = {}) {
		super();
		
		// make some strings objects
		if (Util.isString(p.keySignature)) {
			p.keySignature = new Key(p.keySignature)
		}
		if (Util.isString(p.timeSignature) && p.timeSignature.indexOf('/') > -1) {
			p.timeSignature = p.timeSignature.split('/');
		}

		this.init({
			title: 'Untitled',
			voices: [],
			timeSignature: [4, 4],
			keySignature: new Key('C major'),
			quanta: new Duration(1/32),
			tempo: 120,
		}, p);
	}

	/**
	 * @returns the string title.
	 */
	get title() {
		return this._title;
	}

	/**
	 * Sets the title of the piece.
	 */
	set title(str) {
		this._title = str;
	}

	/**
	 * @returns the array that represents the time signature of the piece.
	 */
	get timeSignature() {
		return this._timeSignature;
	}

	/**
	 * @returns the {@link Key} of the piece. 
	 */
	get keySignature() {
		return this._keySignature;
	}

	/**
	 * Sets the {@link Key} of the piece from a Key or string, eg, "F# minor"
	 */
	set keySignature(key) {
		this._keySignature = (key instanceof Key) ? key : new Key(key);
	}

	/**
	 * @returns the {@link Scale} object that represents the key signature.
	 */
	get scale() {
		return this._scale;
	}

	/**
	 * @returns the quantization {@link Duration}. Read-only.
	 */
	get quanta() {
		return this._quanta;
	}

	/**
	 * @returns the beats per minute. Read-only.
	 */
	get tempo() { // TODO: functions to change the tempo
		return this._tempo;
	}

	/**
	 * @returns an array of {@link Voice} objects that are in the score.
	 * Read-only property.
	 */
	get voices() {
		return this._voices;
	}

	/**
	 * @returns the {@link Voice} object with this name.
	 * @param {string} name 
	 */
	voice(name) {
		return (this.voices.filter(voice => voice.name === name))[0];
	}

	/**
	 * Adds a voice to the score.
	 * @param {any} v - name {@link Voice} object or string to add
	 */
	addVoice(name) {
		let voice = (name instanceof Voice) ? name : new Voice(name);
		this._voices.push(voice);
		return voice;
	}

	/**
	 * Adds a few voices at a time to the score.
	 * @param {Array} array - list of voices to add 
	 */
	addVoices(array) {
		array.forEach(v => this.addVoice(v));
	}

	/**
	 * Adds two each of: Piccolo, Flute, Oboe, Clarinet and Bassoon
	 */
	addWindSection() {
		throw new Error('Not implemented');
	}

	/**
	 * Adds two each of: Horn, Trumpet, Trombone, and one Tuba
	 */
	addBrassSection() {
		throw new Error('Not implemented');
	}

	/**
	 * Adds 1st Violins, 2nd Violins, Violas, Violoncellos, and Double Basses.
	 */
	addStringSection() {
		this.addVoices([
			new Voice({name: '1st Violins', patch: 41, range: ['G3', 'A7']}),
			new Voice({name: '2nd Violins', patch: 41, range: ['G3', 'A7']}),
			new Voice({name: 'Violas', patch: 42, range: ['C3', 'E6']}),
			new Voice({name: 'Violoncellos', patch: 43, range: ['C2', 'C6']}),
			new Voice({name: 'Double Basses', patch: 44, range: ['C1', 'C5']}),
		]);
	}

	/**
	 * Removes the specified voice from the score.
	 * @param {string} name 
	 */
	removeVoice(name) {
		// TODO - filter and splice
	}

	/**
	 * Renders the score as a MIDI file.
	 * @param {string} filename - where to save the output 
	 */
	writeMidi(filename = 'output') {
		let tracks = [];
		
		this.voices.forEach(voice => {

			let track = new MidiWriter.Track();
			track.addEvent(new MidiWriter.ProgramChangeEvent({ voice: voice.patch }));

			track.addInstrumentName(voice.name);
			track.addTrackName(voice.name);

			track.setTimeSignature(this.timeSignature[0], this.timeSignature[1]);
			track.setKeySignature( ...this.keySignature.midi);
			track.setTempo(this.tempo);

			let rest = 0;
			voice.sequence.forEach(note => {
				if (note.type === 'rest') {
					rest += note.duration.ticks;
				}
				else {
					track.addEvent(
						new MidiWriter.NoteEvent({
							pitch: note.pitches.map(p=>p.toString()),
							duration: note.duration.midiWriterValue,
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
}

module.exports = Score;