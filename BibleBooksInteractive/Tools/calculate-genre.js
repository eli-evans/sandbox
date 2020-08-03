let fs = require('fs');
let Util = require('../../Util/Util.js');
let Counter = require('../../Util/Counter.js');

const Bible = require('../../Util/Bible.js');

const lgenre = {
	// "1" : "Narrative",
	"1.1" : "Narrative, Story",
	"1.2" : "Narrative, Future Events",
	
	// "2" : "Procedural",
	"2.1" : "Procedural, How it was done",
	"2.2" : "Procedural, How to do it",
	
	// "3" : "Behavioral",
	"3.1" : "Behavioral, Hortatory",
	"3.2" : "Behavioral, Evaluation",
	
	// "4" : "Expository",
	"4.1" : "Expository, What things are or were like",
	"4.2" : "Expository, What things will be like"
};

var headings = Object.values(lgenre);

var json = JSON.parse(fs.readFileSync('/Users/eevans/Documents/GitHub/ShipLongacreGenre/data/en/longacre_pericope_genres.json'));

var counter = new Counter();

json.data.forEach( r => {
	var genre = getGenre(r.xref);
	if (genre) {
		var book = Bible.getBookNumberFromRef(r.ref);
		var verses = Bible.countVerses(r.ref);
		verses = verses === NaN ? 15 : verses;

		if (book) { 
			counter.count(book, genre, verses);
		}
	}
});

console.log( (['name', 'best guess'].concat(headings)).join('\t') );

counter.all().forEach( list => {
	let best;

	// Look into: https://stackoverflow.com/questions/54886939/finding-the-peaks-of-an-array-using-javascript

	list.items.forEach( item => {
		if (item.standardDeviations >= 1.5) {
			best = item;
		}
		else if (list.items.length === 1) {
			best = item;
		}
		else if (item.percentage >= 50) {
			best = item;
		}
	});

	let bestval = best ? best.name : '??';
	let out = [list.name, bestval].concat( headings.map( r => counter.value(list.name, r) ) );
	console.log(out.join('\t'))

});


function getGenre(str) {
	if (/label/.test(str)) {
		return "";
	}

	var ret = "";
	var re1 = new RegExp(/Primary=#lgenre\.([0-9.]+)/);
	var re2 = new RegExp(/lgenre\.([0-9.]+)/);
	if (re1.test(str)) {
		ret = RegExp.$1;
	}
	else if (re2.test(str)) {
		ret = RegExp.$1;
	}
	else {
		console.warn(`Unknown: ${str}`)
	}

	if (lgenre[ret] !== undefined) {
		ret = lgenre[ret];
	}

	return ret;
}
