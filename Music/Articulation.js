const Base = require('./Base.js');
const Util = require('./Util.js');

class Articulation extends Base {
	static Default = new Articulation({name: 'Default', value: 1});
	static Detache = new Articulation({name: 'Detache', value: 1});
	static Normal = new Articulation({name: 'Normal', value: 1});
	static Legato = new Articulation({name: 'Legato', value: 2});
	static Staccato = new Articulation({name: 'Staccato', value: 3});
	static Marcato = new Articulation({name: 'Marcato', value: 4});
	static Pizzicato = new Articulation({name: 'Pizzicato', value: 4});
	static Flutter = new Articulation({name: 'Flutter', value: 5});
	static TrillHalf = new Articulation({name: 'TrillHalf', value: 6});
	static TrillWhole = new Articulation({name: 'Legato', value: 7});
	static Sforzando = new Articulation({name: 'Sforzando', value: 8});
	static FortePiano = new Articulation({name: 'FortePiano', value: 8});
	static Staccatissimo = new Articulation({name: 'Staccatissimo', value: 9});

	/**
	 * Returns a random articulation.
	 */
	static random() {
		return Util.randomElement([Articulation.Normal, Articulation.Legato, Articulation.Staccato, 
			Articulation.Marcato, Articulation.Pizzicato, Articulation.Flutter, 
			Articulation.TrillHalf, Articulation.TrillWhole, Articulation.Sforzando, 
			Articulation.FortePiano, Articulation.Staccatissimo]);
	}

	/**
	 * Constructs a new articulation object. You probably don't need
	 * to call this directly. Instead, use the static enumerations
	 * @example let stacc = Articulation.Staccato;
	 * @param {object} params
	 * @param {string} params.name
	 * @param {number} params.value 
	 */
	constructor(params = {}) {
		super();
		this.init({
			name : 'Default', 
			value : 1
		}, params);
	}

	get name() {
		return this._name;
	}
	set name(n) {
		this._name = n;
	}

	get value() {
		return this._value;
	}
	set value(v) {
		this._value = Util.bounce(v, 1, 16);
	}
}


module.exports = Articulation;