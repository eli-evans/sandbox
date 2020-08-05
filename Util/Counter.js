const stats = require('simple-statistics');

class Counter {
	constructor() {
		this._keys = {};
		this.pathSeparator = '/';
		this.matchLevel = Counter.matchLevel.Prefix;
	}

	static matchLevel = {
		Loose : 1,
		Prefix : 2,
		Exact : 4,
	};

	count(...args) {
		let amount = 1;
		let key = [];

		args.forEach( arg => {
			if (Array.isArray(arg)) {
				key = key.concat(arg)
			}
			else if (typeof arg === 'string' || arg instanceof String) {
				key.push(arg);
			}
			else if (!isNaN(arg)) {
				amount = arg;
			}
		});

		key = this._arrayToKey(key);
		
		if (this._keys[key] === undefined) {
			this._keys[key] = 0;
		}

		this._keys[key] += amount;
	}

	value(key) {
		let ret = 0;
		key = this._arrayToKey(key);
		if (this._keys[key] !== undefined) {
			ret = this._keys[key]; 
		}
		return ret;
	}

	values(q) {
		return this.list(q).map( r => this.value(r) );
	}

	aggregate(q) {
		return stats.sum(this.values(q));
	}

	analyze(q) {
		let results = this.list(q);

		if (results.length === 0) {
			throw new Error(`No results for query: ${q}`);
		}

		let values = results.map( r => this.value(r));

		let ret = {
			items: [],
			min: stats.min(values),
			max: stats.max(values),
			extent: stats.extent(values),
			stdev: stats.standardDeviation(values),
			variance: stats.variance(values),
			median: stats.median(values),
			mode: stats.mode(values),
			mean: stats.mean(values),
			harmonicMean: stats.harmonicMean(values),
			sum: stats.sum(values),
		};

		results.forEach( r => {
			let value = this.value(r);

			ret.items.push({
				path: r,
				name: r.split(this.pathSeparator).pop(),
				value: value,
				stdev: (value - ret.mean) / ret.stdev,
				percentage: (value / ret.sum) * 100,
				variance: Math.abs(ret.mean - value)
			});
		});
		return ret;
	}

	matchLoose() {
		this.matchLevel = Counter.matchLevel.Loose;
	}

	matchExact() {
		this.matchLevel = Counter.matchLevel.Exact;
	}

	matchPrefix() {
		this.matchLevel = Counter.matchLevel.Prefix;
	}

	list(q) {
		return Object
			.keys(this._keys)
			.filter( key => this._isMatch(this._arrayToKey(q), key) )
			.sort( (a,b) => this.value(b) - this.value(a) || a.localeCompare(b) );
	}

	singles(q) {
		return this.list(q).filter( r => this.value(r) === 1 );
	}

	dominant(q, threshold) {
		// given a list name, we get the list, which has the side-effect
		// of adding some basic stats analysis to the items, then we
		// check if any one of the items in the list is significantly more
		// frequent than the other values via a threshold, which should be > 1.0.

		if (threshold === undefined) {
			threshold = 1.5;
		}

		let dominant;
		let analysis = this.analyze(q);

		let stdev = analysis.items.filter(r => r.stdev >= threshold);
		let perc = analysis.items.filter(r => r.percentage >= (100 / analysis.items.length) * threshold);

		if (analysis.items.length === 1) {
			dominant = analysis.items[0];
		}
		else if (stdev.length === 1) {
			dominant = stdev[0];
		}
		else if (perc.length === 1) {
			dominant = perc[0];	
		}

		return dominant;
	}

	_isMatch(q, key) {
		if (q === undefined) {
			return true; // match all
		}

		let match = false;
		let index = key.indexOf(q);
		let next = key[index + q.length];
		let prev = key[index - 1];

		// if it's exact, it's also prefix and loose
		match = (q === key);

		// if it's not exact, maybe it's a prefix match
		if (!match && this.matchLevel === Counter.matchLevel.Prefix && index === 0) {
			if (next === this.pathSeparator) {
				match = true;
			}
		}
		
		// if it's not a prefix match, maybe it's a loose match
		if (!match && this.matchLevel === Counter.matchLevel.Loose && index > -1) {
			if ((index === 0 || prev === this.pathSeparator) && (next === undefined || next === this.pathSeparator)) {
				match = true;
			}
		}
		return match;
	}

	_arrayToKey(key) {
		let ret = key;
		if (Array.isArray(key)) {
			ret = key.join(this.pathSeparator);
		}
		return ret;
	}
}

try {
	module.exports = Counter;
} catch (e) {}