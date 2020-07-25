class DataTable {

// Expects an array of flat objects where each property represents a column

	constructor (data) {
		this.rows = data;
	}

	pivot(prop) {
		let ret = [];
		let pivot = {};

		// iterate over rows
		this.rows.forEach( (r, i) => {
			let propvals = ['_undefined_'];

			if (r[prop]) {
				if (Array.isArray(r[prop])) {
					propvals = r[prop];
				}
				else {
					propvals = [r[prop].toString()];
				}
			}

			propvals.forEach(propval => {
				if (pivot[propval] === undefined) {
					pivot[propval] = [];
				}
				pivot[propval].push(r);
			});
		});

		var output = [];
		Object.keys(pivot).forEach( key => {
			var node = {
				'id' : key,
				'name' : key,
				'children' : []
			};

			pivot[key].forEach( r => {
				node.children.push(r);
			});

			output.push(node);
		});

		return output;
	}
}

if (module) {
	module.exports = DataTable;
}

