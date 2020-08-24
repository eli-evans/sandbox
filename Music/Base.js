/**
 * Base class for all Music objects that can be instantiated.
 */

class Base {
	/**
	 * Debugging function to write the JSON representation of this object
	 * to the console. 
	 */
	dump() {
		console.log(`\n"${this.constructor.name}": ${JSON.stringify(this, null, 4)}`);
	}

	/**
	 * Takes one or more objects and merges them into internal variables.
	 * Object keys will be prepended with `_` so `{key: 'value'}`
	 * becomes the equivalent of `this._key = 'value'`. Later objects in
	 * the arguments list with the same keys will overwrite earlier
	 * objects with those keys, so given `{key: 1}, {key: 2}`, the 
	 * value of `this._key` will be 2.
	 * @param  {...any} rest - arguments are expected to be objects
	 */
	init(...rest) {
		let params = {};

		rest.forEach(arg => {
			Object.keys(arg).forEach(key => {
				let newKey = key.replace(/^_/, '');
				params[`_${newKey}`] = arg[key];
			});
		});

		Object.assign(this, params);
	}

	/**
	 * @returns a string representation of the object.
	 * May be overriden by derived classes. 
	 */
	toString() {
		return JSON.stringify(this);
	}
}

module.exports = Base;