const { timingSafeEqual } = require("crypto");

class DatatypeReference {

	// lightweight mockup cheese; not for production

	constructor(str) {
		if (str !== undefined) {
			return DatatypeReference.fromString(str);
		}
	}

	render() {
		switch (this.type) {
			case 'bible':
				return this.renderBible();
			break;
			
			case 'lgenre':
				return this.renderLgenre();
			break;
			
			default:
				return this.internal;
			break;
		}
	}

	renderBible() {
		// TOOD
	}

	renderLgenre() {
		let ret = this.internal;

		const lgenre = {
			"1" : "Narrative",
			"1.1" : "Narrative, Story",
			"1.2" : "Narrative, Future Events",
			
			"2" : "Procedural",
			"2.1" : "Procedural, How it was done",
			"2.2" : "Procedural, How to do it",
			
			"3" : "Behavioral",
			"3.1" : "Behavioral, Hortatory",
			"3.2" : "Behavioral, Evaluation",
			
			"4" : "Expository",
			"4.1" : "Expository, What things are or were like",
			"4.2" : "Expository, What things will be like"
		};

		if (lgenre[this.data] !== undefined) {
			ret = lgenre[this.data];
		}

		return ret;
	}

	// static factories

	static fromString(str) {
		let dtr = new DatatypeReference();

		this.internal = str;

		if (/^([^.]+)\.(.*)$/.test(str)) {
			let type = RegExp.$1;
			let data = RegExp.$2;

			if (type.indexOf('+') > -1) {
				let typesub = type.split('+');
				dtr.type = typesub[0];
				dtr.subtype = typesub[1];
			}
			else {
				dtr.type = type;
			}

			dtr.data = data;

			if (data.indexOf('.') > -1 && /^[A-z0-9\.]+$/.test(data)) {
				dtr.parts = data.split('.');
			}
		}
		else {
			throw new Error(`Not a datatype reference: ${str}`);
		}

		return dtr;
	}
}

try { 
	module.exports = DatatypeReference;
} catch (e) {}