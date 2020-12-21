const fs = require('fs');
const WordNumberData = require('../Util/WordNumberData.js')

let corpora = ['SBLGreek', 'LHB', 'SweteLXX2'];

let wnum2verse = {};

corpora.forEach( corpus => {
	let path = `C:/Users/eevans/Documents/GitHub/WordNumberDatabases/Data/${corpus}`;	
	let wndb = new WordNumberData(path /*, (x) => /\.1\.[0-9]+\.xml/.test(x) */);

	wndb.books.forEach(book => {
		book.chapters.forEach(chapter => {
			chapter.verses.forEach(verse => {
				verse.words.forEach(word => {
					wnum2verse[word.wnum] = verse.reference;
				});
			});
		});
	});

	fs.writeFileSync(`${corpora}.json`, JSON.stringify(wnum2verse, null, 4));
});