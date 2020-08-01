let fs = require('fs');
let WordNumberData = require('./WordNumberData.js');


let corpora = ['SBLGreek'];
let counts = {};

corpora.forEach( corpus => {
	
	let path = `/Users/eevans/Documents/GitHub/WordNumberDatabases/Data/${corpus}`;	
	let wndb = new WordNumberData(path);

	let output = []; 

	output.push([
		'name',
		'chapters',
		'verses',
		'words',
		'lemmas',
		'lemmasAB',
		'lemmmasAT',
		'roots',
		'rootsAB',
		'rootsAT' 
		].join('\t'));

	wndb.books.forEach( book => {

		// count singles across corpus
		wndb.counter.singles('lemmas').forEach(lemma => {
			if (book.counter.has('lemmas', lemma)) {
				book.counter.count('all', 'LUAT');
			}
		});

		wndb.counter.singles('roots').forEach(root => {
			if (book.counter.has('roots', root) !== undefined) {
				book.counter.count('all', 'RUAT');
			}
		});

		var out = [
			book.name,
			book.chapters.length,
			book.counter.total('all', 'verses'),
			book.counter.total('all', 'words'),
			book.counter.total('lemmas'),
			book.counter.singles('lemmas').length,
			book.counter.total('all', 'LUAT'),
			book.counter.total('roots'),
			book.counter.singles('roots').length,
			book.counter.total('all', 'RUAT'),
		];

		output.push(
			out.map( r => r ? r : 0).join('\t')
		);
	});

	fs.writeFileSync('output.txt', output.join('\n'));
});