const fs = require('fs');

const bibleBookAbbr = [
	"",

	"Ge", "Ex", "Le", "Nu", "Dt", "Jos", "Ju", "Ru", "1Sa", "2Sa", "1Ki", "2Ki",
	"1Ch", "2Ch", "Ezr", "Ne", "Es", "Job", "Ps", "Pr", "Ec", "So", "Is", "Je",
	"La", "Eze", "Da", "Ho", "Joe", "Am", "Ob", "Jon", "Mic", "Na", "Hab", "Zep",
	"Zec", "Mal",

	"Tob", "Jud", "Add Es", "Wis Sol", "Sir", "Bar", "Lt Je", "S3Y",
	"Sus", "Bel", "1Ma", "2Ma", "1Es", "Pr Man", "Ps 151", "3Ma", "2Es", "4Ma",

	"", "", "", "",

	"Mt", "Mk", "Lu", "Jn", "Ac", "Ro", "1Co", "2Co", "Ga", "Eph", "Php",
	"Col", "1Th", "2Th", "1Ti", "2Ti", "Tit", "Phm", "Heb", "Jam", "1Pe",
	"2Pe", "1Jn", "2Jn", "3Jn", "Jud", "Rev"
];

const Relation = "Citation";

var json = JSON.parse(fs.readFileSync('/Users/eevans/Documents/GitHub/ShipOTQuotesInNTInteractive/data/OTQuotesInNTInteractive.json'));

var counts = {};
var output = { byBook: {}, byChapter: {} };

json = json.filter(rec => isEpistle(rec)); // just take epistle data

// get book2book data
json.forEach(rec => {
	var data = getBookData(rec);
	var rel = rec.Relationship; 

	if (counts[data.ot] === undefined) {
		counts[data.ot] = {};
	}
	if (counts[data.ot][data.nt] === undefined) {
		counts[data.ot][data.nt] = {};
	}
	if (counts[data.ot][data.nt][rel] === undefined) {
		counts[data.ot][data.nt][rel] = [];
	}

	counts[data.ot][data.nt][rel].push(data);
});

Object.keys(counts).forEach(fr => {
	Object.keys(counts[fr]).forEach(to => {
		Object.keys(counts[fr][to]).forEach( rel => {
			if (output.byBook[rel] === undefined) {
				output.byBook[rel] = [];
			}
			output.byBook[rel].push({ from: fr, to: to, value: counts[fr][to][rel].length });
		});
	});
});

counts = [];

// get chapter2book data
json.forEach(rec => {
	var data = getChapData(rec);
	var bk = getBook(rec.NewTestamentReference);
	var rel = rec.Relationship;

	if (counts[bk] === undefined) {
		counts[bk] = {};
	}
	if (counts[bk][data.ot] === undefined) {
		counts[bk][data.ot] = {};
	}
	if (counts[bk][data.ot][data.nt] === undefined) {
		counts[bk][data.ot][data.nt] = {};
	}

	if (counts[bk][data.ot][data.nt][rel] === undefined) {
		counts[bk][data.ot][data.nt][rel] = [];
	}
	data.book = bk;
	data.chapNum = getChapNum(rec.NewTestamentReference);
	counts[bk][data.ot][data.nt][rel].push(data);
});

let seen = {};
Object.keys(counts).forEach(bk => {
	Object.keys(counts[bk]).forEach(fr => {
		Object.keys(counts[bk][fr]).forEach(to => {
			if (output.byChapter[bk] === undefined) {
				output.byChapter[bk] = [];
			}
			if (!seen[to]) {
				output.byChapter[bk].push( { to: to, nodeColor: "#FF0000", /* chapNum: counts[bk][fr][to][0]['chapNum'] */ } );
				seen[to] = true;
			}
		});
		output.byChapter[bk] = output.byChapter[bk].sort( (a,b) => a.chapNum - b.chapNum);
	});
});

// console.log(output.byChapter);

Object.keys(counts).forEach(bk => {
	let bookData = [];
	Object.keys(counts[bk]).forEach(fr => {
		Object.keys(counts[bk][fr]).forEach(to => {
			bookData.push({ from: fr, to: to, value: counts[bk][fr][to].length });
		});
	});
	bookData = bookData.sort( (a,b) => a.to.localeCompare(b.to) || a.from.localeCompare(b.from) );
	bookData.forEach( bd => output.byChapter[bk].push(bd));
});

fs.writeFileSync("../Data/otquotes.json", JSON.stringify(output, null, 4));

function isEpistle(rec) {
	var nt = rec.NewTestamentReference.split('.');
	var n = parseInt(nt[1]);
	return (n >= 66 && n <= 86);
}

function getBookData(rec) {
	let ret = {};
	ret.nt = getBook(rec.NewTestamentReference);
	ret.ot = getBook(rec.SourceReference);

	return ret;
}

function getChapData(rec) {
	let ret = {};
	ret.nt = getBookChap(rec.NewTestamentReference);
	ret.ot = getBook(rec.SourceReference);

	return ret;
}

function getBookChap(str) {
	var parts = str.split('.');
	return `${bibleBookAbbr[parseInt(parts[1])]} ${parts[2]}`;
}

function getBook(str) {
	var parts = str.split('.');
	return bibleBookAbbr[parseInt(parts[1])];
}

function getChapNum(str) {
	var sp = str.split('.');
	return parseInt(sp[2]);
}
