let fs = require('fs');
let WordNumberData = require('./WordNumberData.js');


let corpora = ['LogosLXX'];
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
			if (book.counter['lemmas'][lemma] !== undefined) {
				book.counter.count('all', 'LUAT');
			}
		});

		wndb.counter.singles('roots').forEach(root => {
			if (book.counter['roots'][root] !== undefined) {
				book.counter.count('all', 'RUAT');
			}
		});

		var out = [
			book.name,
			book.chapters.length,
			book.counter['all']['verses'],
			book.counter['all']['words'],
			book.counter.items('lemmas').length,
			book.counter.singles('lemmas').length,
			book.counter['all']['LUAT'],
			book.counter.items('roots').length,
			book.counter.singles('roots').length,
			book.counter['all']['RUAT'],
		];

		output.push(
			out.map( r => r ? r : 0).join('\t')
		);
	});

	fs.writeFileSync('output.txt', output.join('\n'));
});