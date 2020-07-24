const fs = require('fs');
const dataPath = '/users/eevans/documents/github/NTLettersInteractive/data/';

var input = JSON.parse( fs.readFileSync(dataPath + 'ntletters.json') );
var output = [];

let authors = {
	'bk.#Paul' : 'Paul',
	'bk.#Peter' : 'Peter',
	'bk.#WriterHebrews' : 'Writer of Hebrews',
	'bk.#John' : 'John',
	'bk.#James.4' : 'James',
	'bk.#Judas.2' : 'Jude'
}

let descriptions = {
	'bk.#Paul' : 'Apostle who wrote to many churches.',
	'bk.#Peter' : 'One of the original 12 disciples and leader of the church in Jerusalem.',
	'bk.#WriterHebrews' : 'Unknown person writing to Christians of Jewish heritage.',
	'bk.#John' : 'The apostle John, who wrote a gospel, three letters, and Revelation.',
	'bk.#James.4' : 'Some say the brother of Jesus.',
	'bk.#Judas.2' : 'Jude, the brother of James.'
}

input.forEach( rec => {
	var author = rec.authors[0];

	let authorNode = findNode(author, output);
	if (authorNode === null) {
		authorNode = {name: authors[author], authorName: authors[author], description: {en: descriptions[author]}, id: author, children: []};
		output.push(authorNode);
	}

	rec.authorName = authors[author];
	authorNode.children.push(rec);

});

output.forEach( auth => {
	var nWords = 0;
	auth.children.forEach( rec => {
		nWords += rec["n_words"];
		rec.value = Math.sqrt(rec["n_words"]);
	});
	auth["n_words"] = nWords;
	auth.value = Math.sqrt(nWords);
});

fs.writeFileSync('NTLetters.json', JSON.stringify(output, null, 4));



function findNode(nodeId, context) {
	if (context) {
		for (var i = 0; i < context.length; ++i) {
			if (context[i].id === nodeId) {
				return context[i];
				break;
			}
			ret = findNode(nodeId, context[i].children);
			if (ret && ret.id === nodeId) {
				return ret;
			}
		}
	}

	return null;
}