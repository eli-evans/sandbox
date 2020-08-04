const fs = require('fs');
const Util = require('../../Util/Util.js');
const Counter = require('../../Util/Counter.js');
const Bible = require('../../Util/Bible.js');
const DatatypeReference = require('../../Util/DatatypeReference.js');

if (process.argv[2] === undefined) {
	console.log('USAGE: node supdata-best-guess.js PATH')
	process.exit();
}

let json = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// /Users/eevans/Documents/GitHub/ShipLongacreGenre/data/en/longacre_pericope_genres.json
// littype-nt.json
// littype-ot.json

let counter = new Counter();

json.data.forEach( r => {
	if (!/^label/.test(r.xref)) {
		let countable = new DatatypeReference(r.xref).render();

		if (countable) {
			var book = `${Bible.getBookNumberFromRef(r.ref)}\t${Bible.getBookNameFromRef(r.ref)}`;
			var verses = Bible.countVerses(r.ref);
			verses = verses === NaN ? 15 : verses;

			if (book) { 
				counter.count(book, countable, verses);
			}
		}
	}
});

// headings = counter.uniqueItemNames();
headings = [];

console.log( (['Book Number\tTitle', 'Best Guess'].concat(headings)).join('\t') );

counter.listNames.sort((a,b) => parseInt(a) - parseInt(b)).forEach( listName => {
	let list = counter.list(listName);
	let best = counter.dominant(listName, 1.2);

	let bestval = best ? best.name : list.items[0].name;
	let out = [list.name, bestval].concat( headings.map( r => counter.value(list.name, r) ) );
	console.log(out.join('\t'))
});

