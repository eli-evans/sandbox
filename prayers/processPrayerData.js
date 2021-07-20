const fs = require('fs');
const Util = require('../Util/Util.js');
const Bible = require('../Util/Bible.js');

let supdata = JSON.parse(fs.readFileSync('SD-SPEAKING-TO-GOD.json', {encoding: 'utf8'}));
let wnumMap = JSON.parse(fs.readFileSync('./wnums.json', {encoding: 'utf8'}));

let content = {};

supdata.data.forEach(rec => {
	let label = parseLabel(rec.xref);
	// console.log(label);

	if (label.Mode.includes('Prayer') && label.Content) {
		label.Content.forEach(c => {
			if (content[c] === undefined) {
				content[c] = [];
			}
			let v = wnum2verses(rec.wordNumbers);
			content[c].push(v);

			console.log(`${c}\t${v}`)
		});
	}
});

// Object.keys(content).sort((a,b) => content[b].length - content[a].length || a.localeCompare(b)).forEach(key => console.log(key));

fs.writeFileSync('prayer-references-by-type.json', JSON.stringify(content, null, 4));


function parseLabel(str) {
	let output = {};

	let parts = str.split('|');
	output.name = parts.shift().replace('^label.', '');

	parts.forEach(part => {
		let [key, value] = part.split('=');
		if (output[key] === undefined)
			output[key] = [];
		
		if (value.substr(0, 1) === '$')
			value = value.substr(1, value.length - 1);
		else {
			console.warn(`Unknown type flag ${value.substr(0,1)}`);
		}

		output[key].push(value);
	});

	return output;
}

function wnum2verses(wnums) {
	let verses = [];
	wnums.forEach(wnum => {
		wnum = wnum.replace(/^wn\./, '');

		if (wnumMap[wnum] && !verses.includes(wnumMap[wnum])) {
			verses.push(wnumMap[wnum]);
		}
	});
	
	// consolidate
	let output = [];

	let acc = {};
	let lastv = {};
	verses.forEach(verse => {
		let curr = Bible.assembleSingle(verse);

		if (curr.b === lastv.b && curr.c === lastv.c && curr.v === lastv.v + 1) {
			acc.v2 = curr.v;
		}
		else {
			if (lastv.b) {
				if (acc.v !== acc.v2) {
					output.push(`${acc.type}.${acc.b}.${acc.c}.${acc.v}-${acc.b}.${acc.c}.${acc.v2}`);
				}
				else {
					output.push(`${acc.type}.${acc.b}.${acc.c}.${acc.v}`);
				}
			}
			acc = {type: curr.type, b: curr.b, c: curr.c, v: curr.v, v2: curr.v};
		}
		lastv = {type: curr.type, b: curr.b, c: curr.c, v: curr.v};
	});

	if (acc.b) {
		if (acc.v !== acc.v2) {
			output.push(`${acc.type}.${acc.b}.${acc.c}.${acc.v}-${acc.b}.${acc.c}.${acc.v2}`);
		}
		else {
			output.push(`${acc.type}.${acc.b}.${acc.c}.${acc.v}`);
		}
	}

	let rendered = [];
	output.forEach(d => {
		let r = Bible.assembleRange(d);
		let book = Bible.getBookByNumber(r.b);

		let ret = '';

		if (r.c2 && r.c2 === r.c) {
			ret = `${book.name} ${r.c}:${r.v}-${r.v2}`;
		}
		else if (r.c2 > 0) {
			ret = `${book.name} ${r.c}:${r.v}-${r.c2}:${r.v2}`;
		}
		else {
			ret = `${book.name} ${r.c}:${r.v}`;
		}
		rendered.push(ret);
	});

	return rendered.join('; ');
}