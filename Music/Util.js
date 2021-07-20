const Tonal = require('@tonaljs/tonal');

class Util {
	static bounce(value, min, max) {
		return (value > max) ? max :
			(value < min) ? min :
			value;
	}

	static randomElement(array) {
		return array[ Math.floor(Math.random() * array.length) ];
	}

	static rotate(array) {
		array.push(array.pop());
	}

	static maybe(weight) {
		return (Math.random() <= weight);
	}

	static shuffle(array) {
		return Tonal.Collection.shuffle(array);
	}

	static isString(str) {
		return (str !== undefined && (typeof str === 'string' || str instanceof String));
	}

	static isNumber(n) {
		return (parseInt(n) !== NaN || parseFloat(n) !== NaN);
	}

	static isObject(obj) {
		return (obj === Object(obj));
	}

	static isArray(arr) {
		return (Array.isArray(arr));
	}

	static isRest(str) {
		return /[Rr](est)?/.test(str);
	}

	static balance(a, b) {
		let [a1, b1] = [a, b];

		if (a.length < b.length) {
			while (a.length < b.length) {
				a = a.concat(a1);
			}
			a = a.slice(0, b.length);
		}
		else if (b.length < a.length) {
			while (b.length < a.length) {
				b = b.concat(b1);
			}
			b = b.slice(0, a.length);
		}
		return [a, b];
	}

	static repeat(r, cb) {
		for (let i = 0; i < r; ++i) {
			cb();
		}
	}
}

module.exports = Util;