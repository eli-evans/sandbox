const fs = require('fs');
const WordNumberData = require('../../Util/WordNumberData.js')

let corpora = [
	// 'SBLGreek',
	'LHB',
	// 'SweteLXX2'
];

let lemmas = {};

corpora.forEach( corpus => {
	let path = `C:/Users/eevans/Documents/GitHub/WordNumberDatabases/Data/${corpus}`;	
	let wndb = new WordNumberData(path, /* (x) => /\.86\.[0-9]+\.xml/.test(x) */);

	let scheme = corpus === "SBLGreek" ? "lbs-morph+el" :
		"LHB" ? "lbs-morph+he" :
		"SweteLXX2" ? "lbs-morph+el" : 
		"Unknown Corpus";

	wndb.forEachWord( (word, context) => {
		let lemma = word.getValue('lemma');
		let morph = word.getValue('morph');
		let surface = word.getValue('surface');

		if (lemmas[lemma] === undefined) {
			lemmas[lemma] = [];
		}
		lemmas[lemma].push({lemma, morph, surface, reference: context.verse.reference});
	});

	for(let lemma in lemmas) {
		if (lemmas[lemma].length > 1) {
			console.log(lemma);
			fs.writeFileSync(`../data/${scheme}/${lemma}.json`, JSON.stringify(lemmas[lemma], null, 4));
		}
	}	
});