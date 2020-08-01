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

var bible = new Bible();
var headings = Object.values(lgenre);

var json = JSON.parse(fs.readFileSync('/Users/eevans/Documents/GitHub/ShipLongacreGenre/data/en/longacre_pericope_genres.json'));

var counter = new Counter();

json.data.forEach( r => {
	var genre = getGenre(r.xref);
	if (genre) {
		var book = getBook(r.ref);
		var verses = countVerses(r.ref);
		verses = verses === NaN ? 15 : verses;

		if (book) { 
			counter.count(book, genre, verses);
		}
	}
});

console.log( (['name', 'best guess'].concat(headings)).join('\t') );

counter.all().forEach( list => {
	let best;

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

// console.log('\n');
// console.log( JSON.stringify( counter.all(), null, 4));

function countVerses(str) {
	let ret = 0;

	let matrix = str.split('-')
		.map( r => r.split('.')
			.map(r => parseInt(r) )
			.map(r => r === NaN ? 1 : r )
		);
	matrix[0] = matrix[0].slice(1,);

	if (matrix.length === 1) {
		return 1; // no distance
	}

	if (matrix[0][0] === matrix[1][0] && matrix[0][1] === matrix[1][1]) {
		// book and chapter are the same, distance is simple subtraction
		ret = matrix[1][2] - matrix[0][2];
		ret += 1;
	}
	else if(matrix[0][0] === matrix[1][0]) {
		// book is the same
		let book = bible.getBookByNumber(matrix[0][0]);
		
		// iterate over chapters, add all verses
		let sum = 0;
		for (i = matrix[0][1]; i < matrix[1][1]; ++i) {
			sum += book.chapters[i-1];
		}
		sum -= (matrix[0][2] - 1);  // back off initial chapter start verse
		sum += matrix[1][2]; // add on ending chapter verses
		
		ret = sum + 1;
	}
	else {
		console.warn(`How do I ${str}?`)
	}

	return ret;
}

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

function getBook(str) {
	var ret = "";
	var re = new RegExp(/^bible\.(\d+)/);
	re.test(str);

	var book = bible.getBookByNumber(parseInt(RegExp.$1));
	if (book) {
		ret = book.name;
	}
	else {
		console.warn(`What happened with ${str}`);
	}
	return ret;
}