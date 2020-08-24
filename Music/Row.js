const Base = require('./Base.js');
const Util = require('./Util.js');
const Pitch = require('./Pitch.js');

/**
 * A row is an ordered list of pitch classes, that is {@link Pitch} objects.
 * Initialized with an object that specifies a `members` parameter. 
 * @param {Object} params - object to initialize from
 * @param {Array} params.members - array of {@link Pitch} objects
 * 
 * Technically you can pass an array of strings and those will be upgraded to
 * {@link Pitch} objects.
 */

class Row extends Base {
	constructor(params = {}) {
		super(params);
		this.init({_members: []}, params);
	}

	/**
	 * Static factory method to make a Row from an array of pitch class names.
	 * eg: `let row = Row.fromArray(['C', 'D', 'E'])`
	 * @param {Array} pitchClasses - list of pitch class names. 
	 */
	static fromArray(pitchClasses) {
		let row = new Row();
		pitchClasses.forEach(pitchClass => {
			row.addMember(pitchClass); // TODO make this a Pitch object
		});
		return row;
	}

	/**
	 * Static factory method to make a Row from a string containing
	 * pitch class names. eg: `let row = Row.fromString('A B C# D E')`
	 * @param {string} str - string of space-separated pitch class names
	 */
	static fromString(str) {
		return Row.fromArray(str.split(' '));
	}

	/**
	 * Static factory method to make a Row from another row.
	 * @param {Row} row 
	 */
	static fromRow(row) {
		return Row.fromArray(row.members);
	}

	/**
	 * Pitch classes that are members of the row. Public property get/set.
	 * @returns an array of {@link Pitch} objects. 
	 */
	get members() {
		return this._members;
	}
	set members(array) {
		this._members = array;
	}

	/**
	 * Pushes a member into the row at the end.
	 * @param {Pitch} member - the {@link Pitch} object to add
	 * @param {string} member - optionally, the name of a pitch class
	 */
	addMember(member) {
		if (Util.isString(member)) {
			this._members.push(Pitch.fromString(member));
		}
		else if (member instanceof Pitch) {
			this._members.push(member);
		}
		else {
			throw new Error(`Can't add member ${member}`);
		}
	}

	/**
	 * @returns the retrograde (reverse) of the row's members as 
	 * an array of {@link Pitch} objects.
	 */
	retrograde() {
		let temp = this._members;
		temp.reverse();
		return temp;
	}

	/**
	 * @returns the row's members as a randomly ordered array of
	 * {@link Pitch} objects
	 */
	shuffle() {
		return Util.shuffle(this._members);
	}

	/**
	 * @returns a random member of the row.
	 * @type {Pitch}
	 */
	randomMember() {
		return Util.randomElement(this._members);
	}

	/**
	 * @returns the members as a space-separated string of pitch class names.
	 */
	toString() {
		return this._members.map(p => p.toString()).join(' ');
	}
}

module.exports = Row;