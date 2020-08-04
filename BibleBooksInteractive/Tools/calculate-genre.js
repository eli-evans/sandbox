const fs = require('fs');
const Util = require('../../Util/Util.js');
const Counter = require('../../Util/Counter.js');
const Bible = require('../../Util/Bible.js');
const DatatypeReference = require('../../Util/DatatypeReference.js');

let json = JSON.parse(fs.readFileSync(argv[1]));

// /Users/eevans/Documents/GitHub/ShipLongacreGenre/data/en/longacre_pericope_genres.json
// 

let counter = new Counter();

json.data.forEach( r => {
	let countable = getCountable(r.xref);

	if (countable) {
		var book = Bible.getBookNumberFromRef(r.ref);
		var verses = Bible.countVerses(r.ref);
		verses = verses === NaN ? 15 : verses;

		if (book) { 
			counter.count(book, countable, verses);
		}
	}
});

headings = counter.uniqueItemNames();

console.log( (['name', 'best guess'].concat(headings)).join('\t') );

counter.all().forEach( list => {
	let best = counter.dominant(list.name);

	let bestval = best ? best.name : '??';
	let out = [list.name, bestval].concat( headings.map( r => counter.value(list.name, r) ) );
	console.log(out.join('\t'))
});

function getCountable(str) {
	let dtr = new DatatypeReference(str);
	
	if (dtr.type === 'lgenre') {
		return dtr.render();
	}
}
