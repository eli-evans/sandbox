const Base = require('./Base.js');

class Dynamics extends Base {
	/**
	 * @returns a number between 16-127 given a string representing
	 * dynamic level (ppp - fff).
	 * @param {string} name 
	 */
	static get(name) {
		return (name === 'ppp') ? 16 * 1 :
			(name === 'pp') ? 16 * 2 :
			(name === 'p') ? 16 * 3 :
			(name === 'mp') ? 16 * 4 :
			(name === 'mf') ? 16 * 5 :
			(name === 'f') ? 16 * 6 :
			(name === 'ff') ? 16 * 7 :
			(name === 'fff') ? 16 * 8 - 1 :
			0;
	}

	/**
	 * Dynamics.ppp, Dynamics.pp, Dynamics.p, Dynamics.mp
	 * Dynamics.mf, Dynamics.f, Dynamics.ff, Dynamics.fff
	 */
	static ppp = Dynamics.get('ppp');
	static pp = Dynamics.get('pp');
	static p = Dynamics.get('p');
	static mp = Dynamics.get('mp');
	static mf = Dynamics.get('mf');
	static f = Dynamics.get('f');
	static ff = Dynamics.get('ff');
	static fff = Dynamics.get('fff');
	
	/**
	 * Keeps your velocity value between Dynamics.ppp and Dynamics.fff.
	 * @example Dynamics.bounce(1000); // 127
	 * @param {number} vel 
	 */
	static bounce(vel) {
		return (vel > Dynamics.fff) ? Dynamics.fff :
			(vel < Dynamics.ppp) ? Dynamics.ppp :
			vel;
	}

	/**
	 * Adds a set amount to a velocity. Won't go past boundaries. 
	 * Useful as a callback.
	 * @param {number} vel 
	 * @param {number} amt 
	 */
	static cresc(vel, amt) {
		vel += amt;
		return Dynamics.bounce(vel);
	}

	/**
	 * Subtracts a set amount to a velocity. Won't go past boundaries.
	 * Useful as a callback.
	 * @param {number} vel 
	 * @param {number} amt 
	 */
	static decresc(vel, amt) {
		return Dynamics.cresc(vel, -amt);
	}
}

module.exports = Dynamics;