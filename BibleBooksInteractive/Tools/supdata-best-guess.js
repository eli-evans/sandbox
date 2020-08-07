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
counter.pathSeparator = '\t';

json.data.forEach( r => {
	if (!/^label/.test(r.xref)) {
		let countable = new DatatypeReference(r.xref).render();

		if (countable) {
			var booknum = Bible.getBookNumberFromRef(r.ref);
			var bookname = Bible.getBookNameFromRef(r.ref);
			var verses = Bible.countVerses(r.ref);

			verses = verses === NaN ? 15 : verses; // *hack, sputter, cough*

			if (booknum) { 
				counter.count(booknum, bookname, countable, verses);
			}
		}
	}
});

headings = counter.names();
// headings = [];

let booksdata = [];

// console.log( (['Book Number\tTitle', 'Best Guess'].concat(headings)).join('\t') );

counter.paths().forEach( pathName => {
	let out = [pathName, counter.dominant(pathName).name || '??']; // dominant = best guess
	
	let parts = pathName.split(counter.pathSeparator);
	let booknum = parseInt(parts[0]);
	let bookname = parts[1];
	let book = Bible.getBookByNumber(booknum);
	let bookdata = {name: bookname, number: booknum, abbr: book.abbr, data: []} ;

	let analysis = counter.analyze(pathName);
	let store = {};
	analysis.items.forEach( item => {
		store[item.name] = item;
	});

	headings.forEach(key => {
		let value = counter.value([pathName, key]);
		out.push(value);

		if (value) {
			// bookdata.data.push({name: key, value: value});
			bookdata.data.push( store[key] );
		}
	});

	booksdata.push( bookdata );
	// console.log(out.join('\t'));
});

console.log(JSON.stringify(booksdata, null, 4));

