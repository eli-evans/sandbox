class Counter {
	constructor() {
		this._lists = [];
	}

	count(list, key, amount) {
		if (amount === undefined) {
			amount = 1;
		}
		if (this._lists[list] === undefined) {
			this._lists[list] = {};
		}
		if (this._lists[list][key] === undefined) {
			this._lists[list][key] = 0;
		}
		this._lists[list][key] += amount;
	}

	has(list, key) {
		if (key === undefined) {
			return (this._lists[list] !== undefined);
		}
		else {
			return (this._lists[list] !== undefined && this._lists[list][key] !== undefined);
		}
	}

	total(list, key) {
		if (key === undefined) {
			return Object.keys(this._lists[list]).length;
		}
		else {
			return this._lists[list][key];
		}
	}

	all() {
		var ret = [];
		this.lists.forEach( list => {
			ret.push( this.list(list) );
		});
		return ret;
	}

	list(list) {
		let sd = this.standardDeviation(list);
		let mean = this.average(list);
		let sum = this.sum(list);
		return {
			name: list,
			items: this.items(list).map( r =>  {
				r.standardDeviations = (r.count - mean) / sd;
				r.percentage = (r.count / sum) * 100;
				r.variance = Math.abs(mean - r.count);
				return r;
			}),
			mean: mean,
			standardDeviation: sd
		}
	}

	get lists() {
		return Object.keys(this._lists).sort( (a,b) => this.total(b) - this.total(a) );
	}

	items(list) {
		// returns sorted by frequency, then order
		return this.itemNames(list)
			.map( r => {return {name: r, count: this._lists[list][r]} } );
	}

	itemNames(list) {
		return Object.keys(this._lists[list])
			.sort( (a,b) => this._lists[list][b] - this._lists[list][a] || a.localeCompare(b) )
	}

	singles(list) {
		return this.items(list)
			.filter( r => r.count === 1)
			.map( r => r.name);
	}

	value(list, key) {
		return this._lists[list][key];
	}

	values(list) {
		return this.items(list)
			.map( r => r.count );
	}

	standardDeviation(list) {
		return this._stDev(this.values(list));	
	}

	_stDev(data) {
		let avg = this._avg(data);
		
		let squareDiffs = data.map((value) => {
		  let diff = value - avg;
		  let sqrDiff = diff * diff;
		  return sqrDiff;
		});
		
		let avgSquareDiff = this._avg(squareDiffs);
	  
		var stdDev = Math.sqrt(avgSquareDiff);
		return stdDev;
	}
	  
	average(list){
		return this._avg(this.values(list));
	}

	_avg(data) {
		return this._sum(data) / data.length;
	}

	mean(list) {
		return this.average(list);
	}

	sum(list) {
		return this._sum(this.values(list));
	}

	_sum(data) {
		return data.reduce((a, b) => a + b, 0);
	}
}


try {
	module.exports = Counter;
} catch (e) {}